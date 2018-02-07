var url = require("url")
var METHODS = require("./constants").METHODS
var Joi=require("joi")
const Swagger= require("./swagger")
const util = require("./Util")
var rt = {}
var keys = Object.keys(METHODS)
var i = keys.length
while(i--){
  rt[keys[i]] = []
}

// rt = {"POST" : [],"GET" : []}


function findRoute(routeArray,route){
  var pathArray = route.path;   //["login","user"] , "/login/user"  ["login","user"]
  var urlParams = {}
  var match = true;
  var j = -1;
  var k = pathArray.length;
  while(++j < k){     // The best performing loop method
      var r = routeArray[j];
      var p = pathArray[j];
      if(r == undefined){
        match = false;
        break;
      }

     // "/user/:id"
      if(r[0] == ":"){
        urlParams[r.substr(1)] = p
      } else if (r == "*" ) {
            break;
      } else if (r != p) {
        match = false;
        break;
      }
  }
  if(match){
    return {params : urlParams,handler : route.handler,auth : route.auth,validation : route.validation,fail : route.failOver}
  }
  else {
    return false
  }
}




 function route(){
  var result = false;
  var match = function(req){
    var path = url.parse(req.url).pathname;
    var routeArray = path.split('/') //login/user    ["login","user"]
    var routing_table = rt[req.method]
    var i = routing_table.length
    while(i--){
      var route =  routing_table[i]
      result = findRoute(routeArray,route)
      if(result != false ){
        break;
      }
    }
    return result;
  }

  //TODO repeat code break;
  var get = function(config){
    var auth = false
    var validation = false
    var failOver = false
      if(config.auth != undefined){
        auth = config.auth
      }
      if(config.validation != undefined){
        validation = config.validation
      }
      if(config.failOver != undefined){
        failOver = config.failOver
      }else{
        failOver = util.sendJsonResponse;
      }

      let temp={
        query:Joi.object().keys({}),
        headers:Joi.object().keys({})
      };
      if(config.validation && config.validation.query){
        let joiTemp=Joi.object().keys(config.validation.query)
        temp.query=joiTemp
     }
     if(config.validation && config.validation.headers){
        temp.headers=Joi.object().keys(config.validation.headers)
     }
     let tags,description;
    if(config.tags){
      tags=config.tags[0] || config.path;
      description=config.tags[1] || config.path;
    } else{
       tags=config.path.split("/");
      if(tags[1] && tags[2]){
        tags= tags[1]+"/"+tags[2]
      }
      else{
        tags=config.path;
      }
       description=config.path;
    }
    
      Swagger.formRoutes({
        method: 'get',
        tags:tags,
        path: config.path,
        summary: 'List',
        description: description,
        action: config.handler,
        validators: temp
      });

      rt[METHODS.GET].push({path: config.path.split("/"),handler : config.handler,auth : auth,validation: validation,failOver :failOver})
  }

  var post = function(config){
    var auth = false
    var validation = false
    var failOver = false

    if(config.validation != undefined){
      validation = config.validation
    }
      if(config.auth != undefined){
        auth = config.auth

      }
    if(config.failOver != undefined){
      failOver = config.failOver
    }else{
      failOver = util.sendJsonResponse;
    }


    let temp={
      body:Joi.object().keys({}),
      headers:Joi.object().keys({})
    };
    if(config.validation && config.validation.body){
      let joiTemp=Joi.object().keys(config.validation.body)
      temp.body=joiTemp
     
   }
   if(config.validation && config.validation.headers){
    temp.headers=Joi.object().keys(config.validation.headers)
 }
   let tags,description;
    if(config.tags){
      tags=config.tags[0] || config.path;
      description=config.tags[1] || config.path;
    } else{
       tags=config.path.split("/");
      if(tags[1] && tags[2]){
        tags= tags[1]+"/"+tags[2]
      }
      else{
        tags=config.path;
      }
       description=config.path;
    }
  
    Swagger.formRoutes({
      method: 'post',
      path: config.path,
      summary: 'List',
      description: description,
      tags:tags,
      action: config.handler,
      validators: temp
    });

    rt[METHODS.POST].push({path: config.path.split("/"),handler : config.handler,auth : auth,validation: validation,failOver:failOver});
  }

  var put = function(config){
    var auth = false
    var validation = false
    var failOver = false

    if(config.validation != undefined){
      validation = config.validation
    }
      if(config.auth != undefined){
        auth = config.auth
      }
    if(config.failOver != undefined){
      failOver = config.failOver
    }else{
      failOver = util.sendJsonResponse;
    }

    let temp={
      body:Joi.object().keys({}),
      headers:Joi.object().keys({})
    };
    if(config.validation && config.validation.body){
      let joiTemp=Joi.object().keys(config.validation.body)
      temp.body=joiTemp
   }
   if(config.validation && config.validation.headers){
    temp.headers=Joi.object().keys(config.validation.headers)
 }
   let tags,description;
   if(config.tags){
     tags=config.tags[0] || config.path;
     description=config.tags[1] || config.path;
   } else{
      tags=config.path.split("/");
     if(tags[1] && tags[2]){
       tags= tags[1]+"/"+tags[2]
     }
     else{
       tags=config.path;
     }
      description=config.path;
   }
   
   Swagger.formRoutes({
     method: 'put',
     path: config.path,
     tags:tags,
     summary: 'List',
     description: description,
     action: config.handler,
     validators: temp
   });
   
    rt[METHODS.PUT].push({path: config.path.split("/"),handler : config.handler,auth : auth,validation: validation,failOver:failOver});
  }

  var deleteM = function(config){
    var auth = false
    var validation = false
    var failOver = false

    if(config.validation != undefined){
      validation = config.validation
    }
      if(config.auth != undefined){
        auth = config.auth
      }
    if(config.failOver != undefined){
      failOver = config.failOver
    }else{
      failOver = util.sendJsonResponse;
    }
    rt[METHODS.DELETE].push({path: config.path.split("/"),handler : config.handler,auth : auth,validation: validation,failOver:failOver});
  }

  return {
    get : get,
    delete:deleteM,
    post:post,
    put:put,
    match : match
  };
}

module.exports = route ();
