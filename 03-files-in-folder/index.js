const fs = require('fs/promises');
const path = require('path');
const Secret = path.join(__dirname, 'secret-folder');

const info = async (route) => {
  try {
    const { name, ext } = path.parse(route);
    const stats = await fs.stat(route);
    if (stats.isFile()) {
      const sizeToKB = (stats.size / 1024).toFixed(2);
      console.log(`${name} - ${ext.slice(1)} - ${sizeToKB} KB`);
    }
  } catch (error) {
    console.error(error);
  }
};

const task = async () => {
  try {
    const files = await fs.readdir(Secret, { withFileTypes: true });
    await Promise.all(files.map((file) => info(path.join(Secret, file.name))));
  } catch (error) {
    console.error(error);
  }
};

task();
