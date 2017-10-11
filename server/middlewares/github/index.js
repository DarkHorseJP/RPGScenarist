const cookieSession = require('cookie-session')
const fs = require('fs')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const uid = require('uid2')
const crypto = require('crypto')
const logger = require('../../logger')

const config = require('../../config')

const appId = config.get('github.appId')
const clientId = config.get('github.clientId')
const clientSecret = config.get('github.clientSecret')
const privateKey = config.get('github.privateKey')

const tokenSecret = config.get('token.secret')
const tokenIssuer = config.get('token.issuer')
const tokenAudience = config.get('token.audience')

const cookieName = config.get('cookie.name')
const cookieSecret = config.get('cookie.secret')
const cookieMaxAge = config.get('cookie.maxAge')

const authHtmlText = fs.readFileSync(require.resolve('./authenticated.html'), 'utf8')
const logoutHtmlText = fs.readFileSync(require.resolve('./logout.html'), 'utf8')

const getAuthHtml = (token, nextUrl = '/') => authHtmlText.replace('{{token}}', token).replace('{{nextUrl}}', nextUrl)
const getLogoutHtml = (nextUrl = '/') => logoutHtmlText.replace('{{nextUrl}}', nextUrl)

const generateAccessToken = (userId, payload = {}) => {
  // const expiresIn = '1 hour'
  const expiresIn = '1 day'

  const token = jwt.sign(payload, tokenSecret, {
    expiresIn,
    audience: tokenAudience,
    issuer: tokenIssuer,
    subject: userId
  })

  return token
}

const verifyAccessToken = (token) => {
  if (typeof token !== 'string') {
    return null
  }

  try {
    const data = jwt.verify(token, tokenSecret, { audience: tokenAudience, issuer: tokenIssuer })
    return data
  } catch (err) {
    logger.error(err)
    return null
  }
}

const isValidUserToken = (req) => {
  if (!req.isAuthenticated()) {
    return false
  }
  const reqToken = req.get('X-CSRF-TOKEN')
  const usrToken = req.user.userToken
  return reqToken !== 'undefined' && reqToken === usrToken
}

const checkUserToken = (req, res, next) => {
  if (isValidUserToken(req)) {
    return next()
  }
  return res.send()
}

const encryptObj = (obj) => {
  const cipher = crypto.createCipher('aes256', tokenSecret)
  const text = JSON.stringify(obj)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

const decryptObj = (encrypted) => {
  const decipher = crypto.createDecipher('aes256', tokenSecret)
  let text = decipher.update(encrypted, 'base64', 'utf8')
  text += decipher.final('utf8')
  const obj = JSON.parse(text)
  return obj
}

const getAccessToken = (instId) => {
  const tokenUrl = `https://api.github.com/installations/${instId}/access_tokens`
  const token = jwt.sign({}, privateKey, {
    algorithm: 'RS256',
    expiresIn: (60 * 10), // 10min
    issuer: appId
  })
  return fetch(tokenUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.machine-man-preview+json' }
  }).then((res) => res.json())
    .then((json) => json.token)
}

const getOption = (token) => ({
  headers: {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.machine-man-preview+json'
  }
})

const getRepositories = (token) => (
  fetch('https://api.github.com/installation/repositories', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.machine-man-preview+json'
    }
  }).then((res) => res.json())
)

const getInstallationRepos = (instId) => (
  getAccessToken(instId)
    .then((token) => getRepositories(token))
)

const setRepositoryInfo = (instId, owner, repo, name, desc) => (
  getAccessToken(instId)
    .then((token) => (
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.machine-man-preview+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description: desc
        })
      })
    ))
    .then((res) => res.json())
)

const createNewRepository = (instId, orgName, repoName) => (
  getAccessToken(instId)
    .then((token) => (
      fetch(`https://api.github.com/orgs/${orgName}/repos`, {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.machine-man-preview+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName
        })
      })
    ))
)

const githubAppMiddleware = (app) => {
  passport.use(new GitHubStrategy({
    clientID: clientId,
    clientSecret,
    state: true
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      const userProfile = Object.assign({
        accessToken,
        userToken: uid(32)
      }, profile)
      return done(null, userProfile)
    })
  }))

  passport.serializeUser((user, done) => {
    const data = {
      accessToken: user.accessToken,
      userToken: user.userToken,
      name: user._json.login // eslint-disable-line no-underscore-dangle
    }
    const encrypted = {
      data: encryptObj(data)
    }
    const token = generateAccessToken(
      user._json.login, // eslint-disable-line no-underscore-dangle
      encrypted
    )

    done(null, token)
  })

  passport.deserializeUser((obj, done) => {
    const data = verifyAccessToken(obj)
    if (data === null) {
      return done(null, null)
    }
    const decrypted = decryptObj(data.data)
    return done(null, decrypted)
  })

  app.use(cookieSession({
    name: cookieName,
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: 'auto',
      proxy: true,
      maxAge: cookieMaxAge // 30min
    }
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/github/auth',
    passport.authenticate('github')
  )
  app.get('/github/auth/callback', (req, res, next) => {
    passport.authenticate('github', (err, user) => {
      if (err) {
        next(err)
        return
      }
      if (!user) {
        res.redirect('/')
        return
      }
      req.logIn(user, (_err) => {
        if (_err) {
          next(_err)
          return
        }
        const authHtml = getAuthHtml(req.user.userToken)
        res.send(authHtml)
      })
    })(req, res, next)
  })
  app.get('/github/logout', (req, res) => {
    req.logout()
    const logoutHtml = getLogoutHtml('/')
    res.send(logoutHtml)
  })


  app.get('/github/*', checkUserToken)
  app.get('/github/user', (req, res) => {
    fetch(`https://api.github.com/users/${req.user.name}`, {
      headers: { Accept: 'application/vnd.github.machine-man-preview+json' }
    })
      .then((_res) => _res.json())
      .then((json) => {
        const user = {
          name: json.login,
          avatar_url: `${json.avatar_url}&s=40`
        }
        res.send(user)
      })
      .catch((err) => {
        logger.error(err)
        res.send({})
      })
  })

  app.get('/github/orgs/:instid/*', (req, res, next) => {
    // TODO: check if the user is authenticated to access the installation
    getAccessToken(req.params.instid)
      .then((token) => {
        req.fetchOption = getOption(token)
        next()
      })
      .catch((err) => {
        logger.error(err)
        res.send()
      })
  })

  app.get([
    '/github/orgs/:instid/repos/:org/:repo/git/refs/heads/:ref1',
    '/github/orgs/:instid/repos/:org/:repo/git/refs/heads/:ref1/:ref2'
  ], (req, res) => {
    const org = req.params.org
    const repo = req.params.repo
    let ref = req.params.ref1
    if (typeof req.params.ref2 !== 'undefined') {
      ref += `/${req.params.ref2}`
    }
    const url = `https://api.github.com/repos/${org}/${repo}/git/refs/heads/${ref}`
    fetch(url, req.fetchOption)
      .then((data) => data.json())
      .then((json) => res.send(json))
      .catch((err) => {
        logger.error(err)
        res.send([])
      })
  })

  app.get('/github/zipball/:org/:repo/:ref', (req, res) => {
    const org = req.params.org
    const repo = req.params.repo
    const ref = req.params.ref
    const url = `https://api.github.com/repos/${org}/${repo}/zipball/${ref}`
    fetch(url).then((data) => {
      res.setHeader('content-type', 'application/octet-stream')
      data.body.pipe(res)
    }).catch((err) => {
      logger.error(`error: ${err}`)
      res.send(null)
    })
  })

  app.post('/github/orgs/:instid/repos/:owner', (req, res) => {
    if (!req.isAuthenticated) {
      res.send([])
      return
    }
    const name = req.body.name
    if (!name) {
      logger.error('name must be defined')
      res.send([])
      return
    }
    createNewRepository(
      req.params.instid,
      req.params.owner,
      name
    ).then((result) => {
      res.send(result)
    }).catch(() => {
      res.send([])
    })
  })

  app.patch('/github/orgs/:instid/repos/:owner/:repo', (req, res) => {
    if (!req.isAuthenticated) {
      logger.log('not authenticated')
      res.send([])
      return
    }
    const name = req.body.name
    const desc = req.body.desc
    if (!desc || !name) {
      logger.error('name/desc must be defined')
      res.send([])
      return
    }
    setRepositoryInfo(
      req.params.instid,
      req.params.owner,
      req.params.repo,
      name,
      desc
    ).then((result) => {
      res.send(result)
    }).catch(() => {
      res.send([])
    })
  })

  app.get('/github/orgs/:instid/repos', (req, res) => {
    if (!req.isAuthenticated) {
      res.send([])
      return
    }
    getInstallationRepos(req.params.instid)
      .then((repos) => res.send(repos))
      .catch(() => {
        res.send([])
      })
  })
  app.get('/github/orgs', (req, res) => {
    if (!req.isAuthenticated) {
      res.send([])
      return
    }
    fetch('https://api.github.com/user/installations', {
      headers: { Authorization: `token ${req.user.accessToken}`, Accept: 'application/vnd.github.machine-man-preview+json' }
    })
      .then((_res) => _res.json())
      .then((json) => {
        const orgs = json.installations.filter((installation) => installation.target_type === 'Organization')
        res.send(orgs)
      })
      .catch((err) => {
        logger.error(err)
        res.send([])
      })
  })

  return app
}

module.exports = githubAppMiddleware

