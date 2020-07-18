const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");

// Read the file
let inputFile = 'covdir.json'; //core.getInput('input-file');
let covData;
fs.readFile(inputFile, 'utf8', function(err, data) {
    if (err) {
        // Mark the action as failed and also show the error message
        core.setFailed(err.message);
        return console.log("ERROR!");
    }
    covData = JSON.parse(data);
    let result = processCoverage(covData, '.');
    result.forEach((coverageValue, path) => {
        console.log(`${path}: ${coverageValue}%`)
    })
});

function processCoverage(coverageJSON, name) {
    // For each entry, find if it's a file or directory
    // If a file, note the full path and the coverage percentage
    // If a directory, get the overall coverage percentage and recurse
    let fileCoverage = new Map();
    fileCoverage.set(name, processFile(coverageJSON));
    if (isDirectory(coverageJSON)) {
        Object.entries(coverageJSON.children).forEach(([child, coverage]) => {
            let directoryResults = processCoverage(coverage, `${name}/${child}`);
            directoryResults.forEach((result, path) => {
                fileCoverage.set(path, result);
            })
        })
    }
    return fileCoverage;
}

function isDirectory(obj) {
    return "children" in obj;
}

function processFile(coverageJSON) {
    //console.assert(!isDirectory(coverageJSON));
    return coverageJSON.coveragePercent;
}