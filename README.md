# Next Juggernaut
![NJ Logo](https://raw.githubusercontent.com/Jungle-Works/next-juggernaut/master/images/nj-200x50.png)



## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install next-juggernaut --save
```

## Features

* PERFORMANCE BY KEEPING IT LIGHT WEIGHT 1.5 TIMES FASTER THEN EXPRESS
* SUPPORTS TEST-DRIVEN DEVELOPMENT 
* SWAGGER INBUILT
* MVP ARCH FOLLOWED  
* DISTRIBUTED SYSTEM INBUILT TARGETED 
* DEDICATED TO MICROSERIVCES  
* SERVICE DISCOVERY INBUILT 
* DATA FLOW SIMPLIFIED (ONE WAY COM, TWO WAY COM) COM WRITTEN FOR THIS
* RPC (REMOTE PROCEDURE CALL) - COM WHICH USED TO COMMUNICATE BETWEEN MICROSERVICES

## Example

```js
const configSever = {
   "protocol": "http",
   "port": 3000,
   "name": "dev_server",
   "host": "0.0.0.0",
    com: true,
};
const StrictJS = require('strictjs')(configSever);
const TcpCom = StrictJS.com(configSever);

StrictJS.get({
   path: `/`,
   validation: {},
   failOver:”fail action method”,
   Tags: ["tag for swagger",”description of api in swagger"],
   handler : function(req, res) {
     res.json(“Hello World !!”);
   },
 });
StrictJS.start();

```


## Docs & Community

 

**PROTIP** 

### Security Issues



## Quick Start


## Philosophy

Next-Juggernaut JS is a web framework for distributed systems targeting Microservices. In our journey we experimented with HAPI Js and Express JS but found them lacking in terms of dedication to microservices. It is based on NODEjs and provides better performance that HAPI JS and best coding style compared to Express JS.

## Examples

## Tests


## People

The original author of Next-Juggernaut is Jungleworks

## License

[MIT](LICENSE)



