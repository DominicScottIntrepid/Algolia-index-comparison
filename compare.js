var fs = require('fs');
var _ = require('lodash');
// Define a function to read a file and return a Promise
function readFilePromise(filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            var productIds = [];
            // Split the file content into lines
            var lines = data.split('\n');
            // Extract the productId from each line and push it into the productIds array
            lines.forEach(function (line) {
                //console.log(line.slice(0, 10));
                try {
                    var json = JSON.parse(line);
                    productIds.push(json.productId);
                }
                catch (error) {
                    console.error('Invalid JSON:', error);
                }
            });
            console.log("Length of productIds from ".concat(filename, ":"), productIds.length);
            resolve(productIds);
        });
    });
}
// Read the files and filter unique productIds
Promise.all([readFilePromise('test-prod.ndjson'), readFilePromise('test-sys.ndjson')])
    .then(function (_a) {
    var prodIds = _a[0], sysIds = _a[1];
    filterUniqueProductIds(prodIds, sysIds, 'unique-prod-diff.ndjson', 'unique-sys-diff.ndjson');
})
    .catch(function (err) {
    console.error('Error reading files:', err);
});




function filterUniqueProductIds(prodIds, sysIds, prodOutputFile, sysOutputFile) {
    var uniqueProdIds = _.uniq(prodIds);
    var uniqueSysIds = _.uniq(sysIds);
    console.log("Number of unique products in prod file: ".concat(uniqueProdIds.length));
    console.log("Number of unique products in sys file: ".concat(uniqueSysIds.length));
    // Find unique productIds in prod that are not in sys
    var prodDiff = uniqueProdIds.filter(function (productId) { return !uniqueSysIds.includes(productId); });
    console.log("Number of unique products in prod file not in sys file: ".concat(prodDiff.length));
    // Find unique productIds in sys that are not in prod
    var sysDiff = uniqueSysIds.filter(function (productId) { return !uniqueProdIds.includes(productId); });
    console.log("Number of unique products in sys file not in prod file: ".concat(sysDiff.length));
    // Create a string representation of the unique productIds
    var prodOutputData = JSON.stringify(prodDiff);
    var sysOutputData = JSON.stringify(sysDiff);
    // Write the output data to new files
    fs.writeFile(prodOutputFile, prodOutputData, 'utf8', function (err) {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log("Unique productIds from prod file not in sys file written to ".concat(prodOutputFile));
    });
    fs.writeFile(sysOutputFile, sysOutputData, 'utf8', function (err) {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log("Unique productIds from sys file not in prod file written to ".concat(sysOutputFile));
    });
}
