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
    processCoverage(covData, '.');
});

function processCoverage(coverageJSON, name) {
    // For each entry, find if it's a file or directory
    // If a file, print the full path and the coverage percentage
    // If a directory, print the overall coverage percentage and recurse
    console.log(`${name}: ${processFile(coverageJSON)}\%`);
    if (isDirectory(coverageJSON)) {
        Object.entries(coverageJSON.children).forEach(([child, coverage]) => {
            processCoverage(coverage, `${name}/${child}`);
        })
    }
}

function isDirectory(obj) {
    return "children" in obj;
}

function processFile(coverageJSON) {
    //console.assert(!isDirectory(coverageJSON));
    return coverageJSON.coveragePercent;
}