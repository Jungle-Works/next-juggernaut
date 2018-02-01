var self = require("./util")

exports.responseIssue = (c) => {
  c.write('{"error" : "FormatIssue","format":{"fn" :"<function_name>","auth" :"<token>","payload" :"<json_payload>"}}')
  c.end();
}

exports.notFound = (c,m) => {
  console.log(m)
  c.write(JSON.stringify({'error' : 'FunctionNotFound','message':m }))
  c.end();
}
exports.responseTimeout = (c,m) => {
  c.write(JSON.stringify({'error' : 'Timeout','message':"Socket Timeout" }))
  c.end();
}


exports.sendReply = (c,d) => {
  c.write(JSON.stringify(d));
  c.end()
}

exports.register = (c)=> {
  c.sendReply = self.sendReply.bind(null,c)
  c.notFound = self.notFound.bind(null,c)
  c.responseIssue = self.responseIssue.bind(null,c)
  c.responseTimeout = self.responseTimeout.bind(null,c)
}