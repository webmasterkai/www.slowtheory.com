http = require 'http'

module.exports = (env, callback) ->
  http.get { host: 'www.slowtheory.com', path: '/list?pageSize=5000&returnSizes=300x300xCR,1024x1024' }, (res) ->
    data = ''
    res.on 'data', (chunk) ->
      data += chunk.toString()
    res.on 'end', () ->
      console.log data
      env.locals.tb = JSON.parse data
      callback()