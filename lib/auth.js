function auth() {
  var authStrategyTable = {};
  var strategy = function (name, handler) {
    authStrategyTable[name] = handler
  }
  var authenticate = function (match, req, res) {
      status = false
    authStrategyTable[match.auth](req, res,function (err,user) {
        console.log(user)
        if (user != null) {
            req.user = user
            status = true
        }
        else {
            // res.end('{"status": 401}')
            // util.sendUnauthorize() //TODO later
            match.fail(req,res,err)
            return false
        }
   })
      return status

  }

  return {strategy: strategy, authenticate: authenticate}
}


module.exports = auth()