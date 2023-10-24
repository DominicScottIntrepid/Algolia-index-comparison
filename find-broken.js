var fs = require('fs');
var readline = require('readline');
var ndjsonFilePath = 'hayabusa1.ndjson';
var readStream = fs.createReadStream(ndjsonFilePath);
var rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
});
rl.on('line', function (line) {
    try {
        var jsonObject = JSON.parse(line);
        // Process the parsed JSON object here
        console.log(jsonObject);
    }
    catch (error) {
        console.error("Error parsing line: ".concat(line));
        console.error(error);
    }
});
rl.on('close', function () {
    console.log('Finished parsing the NDJSON file.');
});
