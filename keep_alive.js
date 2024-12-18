// keep_alive.js

var http = require('http');

// Create a basic HTTP server that responds with a message to keep the bot alive
http.createServer(function (req, res) {
  res.write("I'm alive");
  res.end();
}).listen(8080, () => {
  console.log("Keep alive server running on port 8080");
});
