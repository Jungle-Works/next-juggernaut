var http = require('http');
var route = require("./routes");
var response = require("./response")
var request = require("./request")
var middleware = require('./middleware');
var postprocess = require('./postprocess');
var auth = require('./auth');
var validation = require("./validation")
var com = require("./com")

//for swagger implementation
var fs = require('fs')
var newSwag = require('./swagger');
var url = require('url');
var path = require('path');

/*
 * @Input
 * {
 *   host : "0.0.0.0"
 *   protocol :"http",
 *   port : "3001",
 *   name : "server name"
 *   tls : {
 *     key : "path_to_key",
 *     cert : "path_to_cert"
 *   },
 *   com : true
 * }
 * */


//context global
var cg = {}
//TODO mashup in Main Function
var server = {}
function StrictJs(context) {
  cg = context;
  server = getInstancePW(context, async function (req, res) {
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // maps file extention to MIME typere
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    };
//for rendering static files request
    fs.exists(pathname, async function (exist) {
      if (!exist) {
        response(res);
        //request(req);
        var match = route.match(req);
        var state = true
        if (match && match.validation) {
          state = await validation.validate(match, req, res)
        }
        if (match && match.auth) {
          state = auth.authenticate(match, req, res)
        }
        if (state) {
          if (match) {
            middleware.run(req, res, match.handler);
          }
          else {
            res.json({ "statusCode": 404 }) //TODO handle this ASAP
          }
          postprocess.run(req, res)
        }
      } else {
        // if is a directory search for index file matching the extention
        if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

        // read file from file system
        fs.readFile(pathname, function (err, data) {
          if (err) {
            res.statusCode = 500;
            res.end(`Error getting the file: ${err}.`);
          } else {
            // if the file is found, set Content-type and send data
            res.setHeader('Content-type', map[ext] || 'text/plain');
            res.end(data);
          }
        });
      }
    });
  })


  var start = function (port, cb) {
    // switch(cg.host){
    //
    // }

    newSwag.buildSwagger(cg)
    documentation();
    switch (typeof port) {
      case "function" :
        server.listen(cg.port, cg.host ? cg.host : "0.0.0.0", function () {
          port(server.listening)
        })
        break;
      case "number" :
        server.listen(port, cg.host ? cg.host : "0.0.0.0", function () {
          typeof cb == "function" ? cb(server.listening) : listnerLog()
        })
        break;
      case "undefined" :
        server.listen(cg.port ? cg.port : "0", cg.host ? cg.host : "0.0.0.0", function () {
          listnerLog()
        })
    }
  }

  var address = function () {
    return cg.protocol + "://" + server.address().address + ":" + server.address().port;
  }
  var documentation=function(){

    route.get({
      path: `/documentation`,
      validation:{},
      async handler(req, res) {
     
        res.redirect('node_modules/next-juggernaut/lib/swagger-ui/index.html');
      },
    });
  }

  return {
    start: start,
    get: route.get,
    post: route.post,
    put: route.put,
    delete: route.delete,
    before: middleware.before,
    after: postprocess.after,
    strategy: auth.strategy,
    address: address,
    com: com,
    server : server
  }
}

/*
 * Instance protocol wise  instance
 * */

function getInstancePW(context, cb) {
  switch (context.protocol) {
    case "http" :
      return require("http").createServer(cb);
      break;
    case "https":
      context.tls ? context.tls : new Error("Tls Not passed")
      return require("https").createServer(context.tls, cb)
    case "http2":
      return require("http2")  //TODO http2 support later
  }
}

function listnerLog() {
  switch (typeof cg.port) {
    case "number" :
      console.log("server is running on ", server.address().port)
      break;
    case "undefined":
      console.log("Port not specified! server is running on ", server.address().port)

  }
}

/*
 * Handing Server level events
 * */

module.exports = StrictJs;
