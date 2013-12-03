http = require 'http'

module.exports = (env, callback) ->
  class TroveboxPage extends env.ContentPlugin
    constructor: (item = {}) ->

  env.registerGenerator 'trovebox', (contents, callback) ->
    data = []
    buffer = ''
    http.get { host: 'dropbox.timlupfer.com', path: '/tb2.json' }, (res) ->
        res.on 'data', (chunk) ->
          buffer += chunk.toString()
        res.on 'end', () ->
          photos = JSON.parse buffer
          for item, i in photos.result
            data.push new TroveboxPage item
          console.log data
          callback null, data

  callback()
