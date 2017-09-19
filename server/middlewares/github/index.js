const express = require('express')
const cookieSession = require('cookie-session')
const path = require('path')
const fs = require('fs')
const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy
const jwt = require('jsonwebtoken')
const fetch = require('node-fetch')
const uid = require('uid2')
const crypto = require('crypto')

const config = require('../../config')

//const appId = process.env.GITHUB_APP_ID
//const clientId = process.env.GITHUB_APP_CLIENT_ID
//const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET
//const domainName = process.env.DOMAIN_NAME
//const privateKey = process.env.GITHUB_APP_PRIVATE_KEY
//const tokenKey = process.env.TOKEN_KEY
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

const authHtml = fs.readFileSync(require.resolve('./authenticated.html'), 'utf8')
const logoutHtml = fs.readFileSync(require.resolve('./logout.html'), 'utf8')

const getAuthHtml = (token, nextUrl = '/') => {
  return authHtml.replace('{{token}}', token).replace('{{nextUrl}}', nextUrl)
}
const getLogoutHtml = (nextUrl = '/') => {
  return logoutHtml.replace('{{nextUrl}}', nextUrl)
}

const generateAccessToken = (uid, payload = {}) => {
  const expiresIn = '1 hour'

  const token = jwt.sign(payload, tokenSecret, {
    expiresIn: expiresIn,
    audience: tokenAudience,
    issuer: tokenIssuer,
    subject: uid
  })
  
  return token
}

const verifyAccessToken = (token) => {
  if(typeof token !== 'string'){
    return null
  }

  try{
    const data = jwt.verify(token, tokenSecret, {audience: tokenAudience, issuer: tokenIssuer})
    return data
  }catch(err){
    console.error(err)
    return null
  }
}

const isValidUserToken = (req) => {
  if(!req.isAuthenticated()){
    return false
  }
  const reqToken = req.get('X-CSRF-TOKEN')
  const usrToken = req.user.userToken
  return reqToken !== 'undefined' && reqToken === usrToken
}

const checkUserToken = (req, res, next) => {
  if(isValidUserToken(req)){
    return next()
  }
  res.send()
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

const getRepositories = (token) => {
  return fetch('https://api.github.com/installation/repositories', {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.machine-man-preview+json'
    }
  })
  .then(res => res.json())
}

const getInstallationRepos = (installationId) => {
  const tokenUrl = `https://api.github.com/installations/${installationId}/access_tokens`
  const token = jwt.sign({}, privateKey, {
    algorithm: 'RS256',
    expiresIn: (60 * 10), // 10min
    issuer: appId
  })
  
  return fetch(tokenUrl, {
    method: 'POST',
    headers: {Authorization:`Bearer ${token}`, Accept:'application/vnd.github.machine-man-preview+json'}
  })
  .then(res => res.json())
  .then(json => getRepositories(json.token))
}


const githubAppMiddleware = (app, webpackConfig) => {
  passport.use(new GitHubStrategy({
    clientID: clientId,
    clientSecret: clientSecret,
    state: true
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      profile.accessToken = accessToken
      profile.userToken = uid(32)
      return done(null, profile)
    })
  }))

  passport.serializeUser((user, done) => {
    const data = {
      accessToken: user.accessToken,
      userToken: user.userToken,
      name: user._json.login
    }
    const encrypted = {
      data: encryptObj(data)
    }
    const token = generateAccessToken(user._json.login, encrypted)
    done(null, token)
  })

  passport.deserializeUser((obj, done) => {
    const data = verifyAccessToken(obj)
    if(data === null){
      return done(null, null)
    }
    const decrypted = decryptObj(data.data)
    done(null, decrypted)
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
    passport.authenticate('github', (err, user, info) => {
      if(err){
        return next(err)
      }
      if(!user){
        return res.redirect('/')
      }
      req.logIn(user, (err) => {
        if(err){
          return next(err)
        }
        const authHtml = getAuthHtml(req.user.userToken)
        res.send(authHtml)
      })
    })(req, res, next)
  })
  app.get('/github/logout', (req, res, next) => {
    req.logout()
    const logoutHtml = getLogoutHtml('/')
    res.send(logoutHtml)
  })

  app.get('/github/*', checkUserToken)
  app.get('/github/user', (req, res) => {
    if(req.isAuthenticated()){
      return fetch(`https://api.github.com/users/${req.user.name}`, {
        headers: {Accept:'application/vnd.github.machine-man-preview+json'}
      })
      .then(res => res.json())
      .then(json => {
        const user = {
          name: json.login,
          avatar_url: json.avatar_url + '&s=40'
        }
        res.send(user)
      })
      .catch(err => {
        console.error(err)
        res.send({})
      })
    }
    res.send({})
  })
  app.get('/github/organizations/:instid/repos/:repid', (req, res) => {
  })
  app.get('/github/organizations/:instid/repos', (req, res) => {
    if(req.isAuthenticated()){
      getInstallationRepos(req.params.instid)
      .then(repos => res.send(repos))
      .catch(err => {
        res.send([])
      })
    }
  })
  app.get('/github/organizations', (req, res) => {
    if(req.isAuthenticated()){
      return fetch('https://api.github.com/user/installations', {
        headers: {Authorization:`token ${req.user.accessToken}`, Accept:'application/vnd.github.machine-man-preview+json'}
      })
      .then(res => res.json())
      .then(json => {
        const orgs = json.installations.filter(installation => installation.target_type === 'Organization')
        res.send(orgs)
      })
      .catch(err => {
        console.error(err)
        res.send([])
      })
    }
    res.send([])
  })

  return app
}

module.exports = githubAppMiddleware

