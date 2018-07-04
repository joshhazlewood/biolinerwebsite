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

var jsObjToConvert = {
  "modules": [
    { "module": "M1", "params": [ { "key": "-p", "value": "asd" }, { "key": "-p", "value": "test" } ] },
    { "module": "M2", "params": [ { "key": "-test", "value": "test" } ] }
  ]
};

var js2xmltestObj = {
  inputConfig : {
    workflows : [
      { workflow : "M1,M2,M3" },
      { workflow : "M2,M4" },
    ],
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

// convertJsonToUseableJs();

function convertJsonToUseableJs() {
  const workflows = [];
  const paramStrings = [];
  // const workflow = [];

  jsObjToConvert.modules.map( element => {
    const workflow = [];
    workflow.push(element['module']);
    let inputString = "[";
    element.params.map(x => {
      let elementParams = "\"" + x['key'] + ":" + x['value'] + "\",";
      inputString = inputString + elementParams;
    });

    inputString = inputString.substring(0, inputString.length - 1);
    inputString = inputString + "]";
    paramStrings.push(inputString);
    console.log(workflow);
    const elementWorkflowString = getWorkflowString(workflow);
    console.log(elementWorkflowString);
    workflows.push(elementWorkflowString);
  })
  console.log(paramStrings);
  let finalObj = {
    inputConfig : {
      workflows : []
    }
  }
  workflows.map( x => {
    finalObj.inputConfig.workflows.push(x);
  })
  // console.log(finalObj);
}

function getWorkflowString(workflowArray) {
  let workflowString = "";
  workflowArray.map( x => {
    console.log(x);
    workflowString = workflowString + x
  });
  return workflowString;
}

testInputXmlGeneration();

function testInputXmlGeneration() {
  var js2xmlparser = require("js2xmlparser");
  console.log(js2xmlparser.parse("inputConfig", js2xmltestObj));
}

testXmlToJson();

function testXmlToJson() {
  var parser = new xml2js.Parser({ explicitArray: false });

  const fs = require("fs"),
    path = require("path"),
    filePath = path.join(__dirname, "../input.xml");

  fs.readFile(filePath, { encoding: "utf-8" }, function(err, data) {
    if (!err) {
      console.log("received data: " + data);

      parser.parseString(data, (err, result) => {
        console.log(result);
      });
    } else {
      console.log(err);
    }
  });
}

module.exports = router;
