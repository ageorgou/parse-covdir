const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs").promises;

async function work() {
    // Read the file
    let inputFile = core.getInput('input-file');
    let outputText;
    try {
        await fs.readFile(inputFile).then(data => {
            let covData = JSON.parse(data);
            let result = processCoverage(covData, '.');
            outputText = formatPlain(result);
            core.setOutput('text', outputText);
            console.log(outputText);
        });
        return outputText;
    } catch (err) {
        // Mark the action as failed and also show the error message
        core.setFailed(err.message);
        return console.log("ERROR!");
    }
}
// Only run the above if directly running this file (otherwise jest gets
// annoyed when running the tests because of the logging in work())
if (require.main === module) {
    work();
}

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

function formatPlain(coverageMap) {
    return Array.from(coverageMap.entries()).map(
        ([path, value]) => `${path}: ${value} %`).join('\n');
}

module.exports = {work, processCoverage};
