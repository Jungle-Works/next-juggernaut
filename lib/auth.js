function auth() {
    var authStrategyTable = {};
    var strategy = function (name, handler) {
        authStrategyTable[name] = handler
    }
    //   var authenticate = function (match, req, res) {
    //       status = false
    //     authStrategyTable[match.auth](req, res,function (err,user) {
    //         console.log(user)
    //         if (user != null) {
    //             req.user = user
    //             status = true
    //         }
    //         else {
    //             // res.end('{"status": 401}')
    //             // util.sendUnauthorize() //TODO later
    //             match.fail(req,res,err)
    //             return false
    //         }
    //    })
    //       return status

    //   }

    var authenticate = async function (match, req, res) {
        var status;
        await new Promise(function (resolve, reject) {
            authStrategyTable[match.auth](req, res, function (err, user) {
                console.log(user)
                if (user != null) {
                    req.user = user
                    status = true
                }
                else {
                    // res.end('{"status": 401}')
                    // util.sendUnauthorize() //TODO later
                    match.fail(req, res, err)
                    status = false
                    // return false
                }
                resolve();
            })
        })
        return status;
    }

    return { strategy: strategy, authenticate: authenticate }
}


module.exports = auth()