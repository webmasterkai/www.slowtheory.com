https = require 'https'

module.exports = (env, callback) ->
  https.get { host: 'slowtheory.cloudant.com', path: '/www/assets' }, (res) ->
    data = ''
    res.on 'data', (chunk) ->
      data += chunk.toString()
    res.on 'end', () ->
      env.locals.assets = JSON.parse data
      callback()
