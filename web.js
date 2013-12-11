/*** Express multi use instance ***/
var express = require("express");
var app = express();
var OAuth = require('oauth');
var querystring = require('querystring');
var path = require('path');
var tb_consumerkey = process.env.TB_CONSUMERKEY,
    tb_consumersecret = process.env.TB_CONSUMERSECRET,
    tb_token = process.env.TB_TOKEN,
    tb_tokensecret = process.env.TB_TOKENSECRET;

app.use(express.compress());
app.set('json spaces',0);

// Get a listing of recent photos with optional arguments
app.get('/list', function(request, response) {
  var oauth = new OAuth.OAuth(
    null,
    null,
    tb_consumerkey,
    tb_consumersecret,
    '1.0A',
    null,
    'HMAC-SHA1'
  );

  var q = querystring.stringify(request.query);

  oauth.get(
    'https://slowtheory.trovebox.com/photos/list.json?' + q,
    tb_token, 
    tb_tokensecret, 
    function (e, data, res){
      if (e) console.error(e);  
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.json(JSON.parse(data));
    }
  );
});

app.get('/photos/update', function(request, response) {
  http.get({ host: 'www.slowtheory.com', path: '/list?pageSize=5000&returnSizes=300x300xCR,1024x1024' }, function(res) {
    data = '';
    res.on('data', function(chunk) {
      data += chunk.toString()
    });
    res.on('end', function() {
      var update = JSON.parse(data);
      var options = {
        hostname: process.env.CLOUDANT_URL,
        port: 443,
        path: '/www/photos',
        method: 'HEAD',
        auth: process.env.CLOUDANT_AUTH
      };
      // Send a request updating Cloudant with our latest information
      var req = https.request(options, function(res) {
        var rev = res.headers.etag;
        var path = process.env.CLOUDANT_PATH;
        // Add the revision if we didn't get a 404
        if (res.statusCode != 404) {
          update._rev = rev.replace(/\"/g,'');
          path = path + "?rev=" + rev.replace(/\"/g,'');
        }
        res.on('data', function(d) {
          process.stdout.write(d);
        });
        // Tell cloudant about our new files
        var updateoptions = {
          hostname: process.env.CLOUDANT_URL,
          port: 443,
          path: '/www/photos',
          method: 'PUT',
          headers: { 
                      'Content-Type':'application/json', 
                      'Content-Length':JSON.stringify(update).length 
                   },
          auth: process.env.CLOUDANT_AUTH
        }
        var updatereq = https.request(updateoptions, function(res) {
          res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
          });
        });
        updatereq.write(JSON.stringify(update));
        updatereq.end();
      });
      req.end();
    });
  });
  response.json({status:200});
});

app.use(express.logger());

// After all other routes are processed, set up our static site
app.use(express.static(path.join(__dirname, 'build')));

// If we haven't found it yet, return a 404 with an error page
app.use(function(req, res, next){
  res.status(404).sendfile(__dirname + '/build/error/index.html');
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
