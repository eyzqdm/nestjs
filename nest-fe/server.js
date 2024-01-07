/* 本地服务器运行web worker。 */
const http = require('http');
const fs = require('fs');
const path = require('path');

http
  .createServer((req, res) => {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        if (path.extname(filePath) === '.js') {
          res.writeHead(200, { 'Content-Type': 'application/javascript' });
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
        }
        res.end(data);
      }
    });
  })
  .listen(3003, () => {
    console.log('Server is running on port 3000');
  });
