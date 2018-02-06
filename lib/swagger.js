var _ = require('underscore');
const convert = require('./joi-route-to-swagger').convert;
var totalJason=[];
class Swagger{
    static formRoutes(a){
        if( !_.isEmpty(a.validators)){
            totalJason.push(a);
        }
    }
    static swaggerObj(){

        return totalJason;
    }
    static buildSwagger(cg){
        let temp={
              basePath: '',
              description: 'CL Base Project',
              host: cg.host + ":" + cg.port,
              routes:Swagger.swaggerObj()
            }
             const swaggerDocs = convert([temp]);
    }
}
module.exports = Swagger;
