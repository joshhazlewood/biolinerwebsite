const express = require("express");
const router = express.Router();
const multer = require("multer");
const mkdirp = require("mkdirp");
const session = require('express-session');
const ncp = require('ncp').ncp;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join("-");
    const fileExtention = file.originalname.split(".").pop();
    const nameWithoutExtension = name.replace(/\.[^/.]+$/, "");
    const fileName =
      nameWithoutExtension + "-" + Date.now() + "." + fileExtention;
    cb(null, fileName);
  }
});

var fs = require("fs"),
  xml2js = require("xml2js");

router.get("/all-modules", (req, res) => {
  var parser = new xml2js.Parser({ explicitArray: false });

  const fs = require("fs"),
    path = require("path"),
    filePath = path.join(__dirname, "../modules.xml");

  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      console.log("received data: " + data);

      parser.parseString(data, (err, result) => {
        console.log();
        res.send(result);
      });
    } else {
      console.log(err);
    }
  });
});

const upload = multer({ storage: storage });
router.post("/user-module", upload.single("file"), (req, res) => {
  const {
    name,
    category,
    description,
    inputFile,
    outputFile_required,
    outputFile,
    command,
    params
  } = req.body;
  let moduleToAdd = {};


  if (outputFile_required === "true") {
    moduleToAdd = {
      name: name,
      category: category,
      description: description,
      inputFile: inputFile,
      outputFile_required: outputFile_required,
      outputFile: outputFile,
      command: command,
      params: params
    };
  } else {
    moduleToAdd = {
      name: name,
      category: category,
      description: description,
      inputFile: inputFile,
      outputFile_required: outputFile_required,
      command: command,
      params: params
    };
  }

  generateNewModulesXmlFile(moduleToAdd, res, req);
});

function generateNewModulesXmlFile(dataToAppend, res, req) {
  const js2xmlparser = require("js2xmlparser");
  const xml2js = require("xml2js").parseString;

  checkIfDirectoryExists(`./temp/${req.sessionID}`, directoryExists => {
    let modulesXmlPath = '';
    if(directoryExists) {
      modulesXmlPath = `./temp/${req.sessionID}/modules.xml`
    } else {
      modulesXmlPath = './modules.xml';
    }
    fs.readFile(modulesXmlPath, (err, data) => {
      if (!err) {
        xml2js(data, (error, editableJSON) => {
          if (error) {
            console.log(error);
          } else {
            let newJson = {
              module: editableJSON.modules.module
            };
            newJson.module.push(dataToAppend);
            const resultXML = js2xmlparser.parse("modules", newJson);

            checkIfDirectoryExists(`./temp/${req.sessionID}`, directoryExists => {
              console.log(directoryExists);
              if(directoryExists) {

                // move uploaded file into session folder
                const oldPath = req.file.path;
                const newPath = `./temp/${req.sessionID}/tools/${req.file.originalname}`;
                fs.rename(oldPath, newPath, (err) => {
                  if (err) console.log(err);
                  console.log('uploaded file moved into ' + `./temp/${req.sessionID}/tools/${req.file.originalname}`)
                });

                const filePathToSave = `./temp/${req.sessionID}/modules.xml`;
                fs.writeFile(filePathToSave, resultXML, err => {
                  if (err) {
                    console.log(err);
                    res.status(500).send();
                  } else {
                    res.status(200).send();
                    console.log("file created");
                  }
                });
              } else {
                ncp('./original_bioliner', `./temp/${req.sessionID}/`, function (err) {
                  if (err) {
                    return console.error(err);
                  } else {
                    const oldPath = req.file.path;
                    const newPath = `./temp/${req.sessionID}/tools/${req.file.originalname}`;
                    fs.rename(oldPath, newPath, (err) => {
                      if (err) console.log(err);
                      console.log('uploaded file moved into ' + `./temp/${req.sessionID}/tools/${req.file.originalname}`)
                    });

                    const filePathToSave = `./temp/${req.sessionID}/modules.xml`;
                    fs.writeFile(filePathToSave, resultXML, err => {
                      if (err) {
                        console.log(err);
                        res.status(500).send();
                      }
                      res.status(200).send();
                    });
                  }
                 });
              }
            });
          }
        });
      } else {
        console.log(err);
      }
    });
  });
}


router.get("/download/default-build", (req, res) => {
  var file = './bioliner.zip';
  res.download(file, 'bioliner.zip');
});

router.get("/download/user-build", (req, res) => {
  var archiver = require("archiver");
  const fileToDownload = `./history/bioliner_${req.sessionID}.zip`;
  var output = fs.createWriteStream(fileToDownload);
  var archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level.
  });

  output.on("close", function() {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
    res.download(fileToDownload, 'bioliner.zip');
  });

  output.on("end", function() {
    console.log("Data has been drained");
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on("warning", function(err) {
    if (err.code === "ENOENT") {
      // log warning
    } else {
      // throw error
      throw err;
    }
  });

  // good practice to catch this error explicitly
  archive.on("error", function(err) {
    throw err;
  });

  archive.pipe(output);

  archive.directory(`./temp/${req.sessionID}`, false);
  archive.finalize();
} );

router.post("/new-workflow", (req, res) => {
  const inputConfig = req.body.inputConfig;
  var js2xmlparser = require("js2xmlparser");
  console.log(inputConfig);

  checkIfDirectoryExists(`./temp/${req.sessionID}`, directoryExists => {
    console.log(directoryExists);
    if (directoryExists === true) {
      //copy input xml file into directory
      const resultXML = js2xmlparser.parse("inputConfig", inputConfig);
      const filePathToSave = `./temp/${req.sessionID}/input.xml`;
      console.log(filePathToSave);
      console.log(resultXML);
      fs.writeFile(filePathToSave, resultXML, err => {
        if (err) {
          console.log(err);
          res.status(500).send();
        }
        console.log('here');
        res.status(200).send();
      });
    } else {
      //create directory first, then place file in copy file
      ncp('./original_bioliner', `./temp/${req.sessionID}/`, function (err) {
        if (err) {
          return console.error(err);
        } else {
          const resultXML = js2xmlparser.parse("inputConfig", inputConfig);
          console.log('in the else');
          console.log(resultXML);
          const filePathToSave = `./temp/${req.sessionID}/input.xml`;
          console.log(filePathToSave);
          fs.writeFile(filePathToSave, resultXML, err => {
            if (err) {
              console.log(err);
              res.status(500).send();
            }
            res.status(200).send();
          });
        }
       });

    }
  });
});

function checkIfDirectoryExists(path, callback) {
  fs.stat(path, (err, stats) => {
    if (err) {
      console.log(`Folder doesn\'t exist: ${path}`);
      return callback(false);
    }
    if(!stats.isDirectory()) {
      console.log('not a directory');
      return callback(false);
    } else {
      console.log('does exist');
      return callback(true);
    }
  })
}

var js2xmltestObj = {
  inputConfig : {
    workflow : "M1,M2,M3",
    outputFolder : './logs',
    uniqueId: 'testRun1',
    modules : {
      module : [
        { name : "M1", input : "testinput string" },
        { name : "M2", input : "testinput2 string2" },
        { name : "M3", input : "testinput3 string3" },
        { name : "M4", input : "testinput4 string4" },
      ]
    }
  }
}

module.exports = router;
