const fs = require('fs/promises');
const path = require('path');
const mainRoute = path.join(__dirname, 'files');
const copyRoute = path.join(__dirname, 'files-copy');

const copyDir = async () => {
  try {
    await fs.mkdir(copyRoute, { recursive: true });
    const files = await fs.readdir(mainRoute);
    await Promise.all(
      files.map(async (file) => {
        const mainPath = path.join(mainRoute, file);
        const copyPath = path.join(copyRoute, file);
        const stats = await fs.stat(mainPath);

        if (stats.isFile()) await fs.copyFile(mainPath, copyPath);
        else if (stats.isDirectory())
          await copyDirRecursive(mainPath, copyPath);
      }),
    );
    console.log('Copied!');
  } catch (error) {
    console.error(error);
  }
};

const copyDirRecursive = async (main, copy) => {
  await fs.mkdir(copy, { recursive: true });
  const files = await fs.readdir(main);
  await Promise.all(
    files.map(async (file) => {
      const mainPath = path.join(main, file);
      const copyPath = path.join(copy, file);
      const stats = await fs.stat(mainPath);

      if (stats.isFile()) await fs.copyFile(mainPath, copyPath);
      else if (stats.isDirectory()) await copyDirRecursive(mainPath, copyPath);
    }),
  );
};

copyDir();
