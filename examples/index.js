var cfg = {
    protocol: "http",
    port: 3001,
    name: "UserMicroservice",
    host: "0.0.0.0",
    com: true,
    tls : {

    }
}

var strictjs = require("../server")(cfg)
var com = strictjs.com(cfg)

com.registerFunction("getUser", function (payload, reply) {
    reply.sendReply(payload)
})

com.start((name, port) => {
    com.registerService(name, port, function () {
        com.executeRemote("UserMicroservice", {fn: "getUser", payload: {name: "Rahul"}})
    })
})
var joi = require("joi")
var jwt = require("jsonwebtoken")

strictjs.strategy("JwtAuth", (req, res, cb) => {
    const token = req.headers.authorization;
    var user = null
    jwt.verify(token, "secret_key", function (err, decode) {
        console.log(decode)
        cb(err, decode)
    })
})

strictjs.before((req, res, next) => {
    // console.log("before calling http")
    next()
})
strictjs.after(() => {
    // console.log("after calling http")
})

strictjs.get({
    path: "/login",
    handler: function (req, res) {
        var criteriaForJwt = {
            userID: "abc",
            role: "xyz",
            sessionID: "qwerty",
            date: new Date(),
        };
        const expireTime = {
            expiresIn: 34000,
        };
        const token = jwt.sign(criteriaForJwt, "secret_key", expireTime);
        res.json({"token": token})
    }
})

strictjs.post({
    path: "/names",
    handler: function (req, res) {
        console.log(req.form.fame)
        res.json({"success": "ok + /names"})
    },
    failOver: function (req, res, error) {
        // error = {error: e.name, message: e.details[0].message}
        res.json(error)
    },
    validation: {
        // body :{
        //   name : joi.string()
        // },
        form: {
            name: joi.any(),
            fame: joi.string().required()
        },
        // headers: {
        //     "content-type": joi.string()
        // }

    }
    //auth: "JwtAuth"
})

strictjs.get({
    path: "/names/login",
    handler: function (req, res) {
        console.log(req.query)
        res.json({"success": "ok + /names/login"})
    },
    failOver: function (req, res, error) {
        // error = {error: e.name, message: e.details[0].message}
        res.json(error)
    },
    validation: {
        query: {
            name: joi.string()
        },

        // params :{
        //
        // },
        // headers :{
        //
        // }
    },
    auth: "JwtAuth"
})
// strictjs.post({
//   path: "/names",
//   handler: function (req, res) {
//     res.json({"success": "ok"})
//   },
//   auth: "JwtAuth"
// })
// strictjs.put({
//   path: "/names",
//   handler: function (req, res) {
//     res.json({"success": "ok"})
//   },
//   auth: "JwtAuth"
// })
// strictjs.delete({
//   path: "/names",
//   handler: function (req, res) {
//     res.json({"success": "ok"})
//   },
//   auth: "JwtAuth"
// })


strictjs.start()
