const convict = require('convict')

const config = convict({
  github: {
    appId: {
      doc: 'GitHub App ID',
      format: 'String',
      default: null,
      env: 'GITHUB_APP_ID'
    },
    clientId: {
      doc: 'GitHub App Client ID',
      format: 'String',
      default: null,
      env: 'GITHUB_APP_CLIENT_ID'
    },
    clientSecret: {
      doc: 'GitHub App Client Secret',
      format: 'String',
      default: null,
      env: 'GITHUB_APP_CLIENT_SECRET'
    },
    privateKey: {
      doc: 'GitHub App Private Key',
      format: 'String',
      default: null,
      env: 'GITHUB_APP_PRIVATE_KEY'
    }
  },
  token: {
    secret: {
      doc: 'User Access Token Secret Key',
      format: 'String',
      default: null,
      env: 'TOKEN_SECRET'
    },
    issuer: {
      doc: 'User Access Token Issuer',
      format: 'String',
      default: 'RPGScenarist',
      env: 'TOKEN_ISSUER'
    },
    audience: {
      doc: 'User Access Token Audience',
      format: 'String',
      default: 'RPGScenaristUser',
      env: 'TOKEN_AUDIENCE'
    }
  },
  cookie: {
    name: {
      doc: 'Cookie name',
      format: 'String',
      default: 'RPGScenaristToken',
      env: 'COOKIE_NAME'
    },
    secret: {
      doc: 'Cookie Secret',
      format: 'String',
      default: null,
      env: 'COOKIE_SECRET'
    },
    maxAge: {
      doc: 'Cookie maxAge',
      format: 'int',
      default: (1000 * 60 * 30), // 30min
      env: 'COOKIE_MAX_AGE'
    }
  }
})

config.validate()

module.exports = config

