const fs = require('fs');
const path = require('path');

const fileRoute = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileRoute);

readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

readStream.on('end', () => {
  console.log('Done');
});
