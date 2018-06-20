const express = require('express');
const router = express.Router();

var fs = require('fs'),
    xml2js = require('xml2js');

router.get('/all-modules', (req, res) => {
  var parser = new xml2js.Parser({explicitArray : false});

  const fs = require('fs'),
    path = require('path'),
    filePath = path.join(__dirname, '../modules.xml');

  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
      if (!err) {
          console.log('received data: ' + data);

          parser.parseString(data, (err, result) => {
            res.send(result);
          })
          // res.writeHead(200, {'Content-Type': 'text/xml'});
          // res.write(data);
          // res.end();
      } else {
          console.log(err);
      }
  });
});

router.get('/test', (req, res) => {
  res.send('hello world');
})

module.exports = router;
