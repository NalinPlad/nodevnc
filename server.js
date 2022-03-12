const http = require('http');
const fs = require("fs");
const requestListener = function (req, res) {
  res.writeHead(200);
  fs.readFile('web/index.html', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    res.end(data)
  })
  
}

const server = http.createServer(requestListener);
server.listen(8080);