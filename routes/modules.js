const express = require("express");
const router = express.Router();
const multer = require("multer");
const mkdirp = require("mkdirp");

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
  const uniquePathToSave = "./temp/modules_" + Date.now() + ".xml";

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

  generateNewXmlFile(moduleToAdd, uniquePathToSave, res);
});

router.post("/test", (req, res) => {
  console.log("testing");
});

router.get("/test", (req, res) => {
  res.send("hello world");
});

function generateNewXmlFile(dataToAppend, filePathToSave, res) {
  const js2xmlparser = require("js2xmlparser");
  const xml2js = require("xml2js").parseString;

  fs.readFile("./modules.xml", (err, data) => {
    if (!err) {
      xml2js(data, (error, editableJSON) => {
        if (error) {
          console.log(error);
        } else {
          console.log(JSON.stringify(editableJSON));
          let newJson = {
            module: editableJSON.modules.module
          };
          newJson.module.push(dataToAppend);
          const resultXML = js2xmlparser.parse("modules", newJson);
          fs.writeFile(filePathToSave, resultXML, err => {
            if (err) {
              console.log(err);
              res.status(500).send();
            } else {
              res.status(200).send();
              console.log("file created");
            }
          });
        }
      });
    } else {
      console.log(err);
    }
  });
}

// zipDirectory();

function zipDirectory() {
  var archiver = require("archiver");

  var output = fs.createWriteStream("./bioliner.zip");
  var archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level.
  });

  output.on("close", function() {
    console.log(archive.pointer() + " total bytes");
    console.log(
      "archiver has been finalized and the output file descriptor has closed."
    );
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

  archive.directory("./original_bioliner/", false);
  archive.finalize();
}

function addNewModuleToDirectory() {
  fs.copyFile("./temp/modules.xml", "./output/bio1/config/modules.xml", err => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = router;
