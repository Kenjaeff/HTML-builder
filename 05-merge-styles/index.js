const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  try {
    const stylesRoute = path.join(__dirname, 'styles');
    const styles = await Promise.all(
      (await fs.readdir(stylesRoute))
        .filter((file) => path.extname(file) === '.css')
        .map((file) => fs.readFile(path.join(stylesRoute, file), 'utf-8')),
    );
    await fs.writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      styles.join('\n'),
    );

    console.log('Merged!');
  } catch (error) {
    console.error(error);
  }
}

mergeStyles();
