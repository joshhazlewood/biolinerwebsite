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

router.post('/user-module', (req, res) => {

});

router.get('/test', (req, res) => {
  res.send('hello world');
});
var unzip = require('unzip');

// fs.createReadStream('bioliner-1.0-SNAPSHOT.jar').pipe(unzip.Extract({ path: 'output/bio1' }));
// fs.createReadStream('example1.jar').pipe(unzip.Extract({ path: 'output/bio1' }));

// var zlib = require('zlib');
// zlib.unzip()
// createJarFile();

function createJarFile() {
  var archiver = require('archiver');

  // var output = fs.createWriteStream('../output/jars/example1.zip');
  var output = fs.createWriteStream('./output/jars/example1.jar');
  var archive = archiver('zip', {
    zlib: { level: 0 } // Sets the compression level.
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  output.on('end', function() {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });


  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory('./output/bio1/', false);
  archive.finalize();
}

module.exports = router;
