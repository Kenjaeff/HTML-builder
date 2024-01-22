const fs = require('fs');
const readline = require('readline');

const filePath = './02-write-file/new.txt';
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Enter text. To exit, type "exit" or use ctrl + c.');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') rl.close();
  else {
    writeStream.write(`${input}\n`);
    console.log('Done. Enter text or exit, type "exit" or use ctrl + c.');
  }
});

rl.on('close', () => {
  console.log('Over');
  process.exit();
});
