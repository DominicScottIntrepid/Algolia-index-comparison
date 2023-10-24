const fs = require('fs');
const readline = require('readline');

const ndjsonFilePath = 'hayabusa1.ndjson';

const readStream = fs.createReadStream(ndjsonFilePath);
const rl = readline.createInterface({
  input: readStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const jsonObject = JSON.parse(line);
    // Process the parsed JSON object here
    console.log(jsonObject);
  } catch (error) {
    console.error(`Error parsing line: ${line}`);
    console.error(error);
  }
});

rl.on('close', () => {
  console.log('Finished parsing the NDJSON file.');
});

