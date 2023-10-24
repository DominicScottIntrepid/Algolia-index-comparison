const fs = require('fs');
const _ = require('lodash');

// Define a function to read a file and return a Promise
function readFilePromise(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      let productIds = [];

      // Split the file content into lines
      const lines = data.split('\n');

      // Extract the productId from each line and push it into the productIds array
      lines.forEach(line => {
        try {
          const json = JSON.parse(line);
          productIds.push(json.productId);
        } catch (error) {
          console.error('Invalid JSON:', error);
        }
      });

      console.log(`Length of productIds from ${filename}:`, productIds.length);

      resolve(productIds);
    });
  });
}

// Read the files and filter unique productIds
Promise.all([readFilePromise('test-prod.ndjson'), readFilePromise('test-sys.ndjson')])
  .then(([prodIds, sysIds]) => {
    filterUniqueProductIds(prodIds, sysIds, 'unique-prod-diff.ndjson', 'unique-sys-diff.ndjson');
  })
  .catch(err => {
    console.error('Error reading files:', err);
  });

function filterUniqueProductIds(prodIds: unknown, sysIds: unknown, prodOutputFile: string, sysOutputFile: string) {
  const uniqueProdIds = _.uniq(prodIds);
  const uniqueSysIds = _.uniq(sysIds);

  console.log(`Number of unique products in prod file: ${uniqueProdIds.length}`);
  console.log(`Number of unique products in sys file: ${uniqueSysIds.length}`);

  // Find unique productIds in prod that are not in sys
  const prodDiff = uniqueProdIds.filter(productId => !uniqueSysIds.includes(productId));
  console.log(`Number of unique products in prod file not in sys file: ${prodDiff.length}`);
  
  // Find unique productIds in sys that are not in prod
  const sysDiff = uniqueSysIds.filter(productId => !uniqueProdIds.includes(productId));
  console.log(`Number of unique products in sys file not in prod file: ${sysDiff.length}`);

  // Create a string representation of the unique productIds
  const prodOutputData = JSON.stringify(prodDiff);
  const sysOutputData = JSON.stringify(sysDiff);

  // Write the output data to new files
  fs.writeFile(prodOutputFile, prodOutputData, 'utf8', err => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log(`Unique productIds from prod file not in sys file written to ${prodOutputFile}`);
  });

  fs.writeFile(sysOutputFile, sysOutputData, 'utf8', err => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log(`Unique productIds from sys file not in prod file written to ${sysOutputFile}`);
  });
}
