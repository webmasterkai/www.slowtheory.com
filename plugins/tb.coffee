http = require 'http'

module.exports = (env, callback) ->
  http.get { host: 'www.slowtheory.com', path: '/photos/all' }, (res) ->
    data = ''
    res.on 'data', (chunk) ->
      data += chunk.toString()
    res.on 'end', () ->
      env.locals.tb = JSON.parse data
      callback()
