const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  try {
    const styles = await Promise.all(
      (await fs.readdir('styles'))
        .filter((file) => path.extname(file) === '.css')
        .map((file) => fs.readFile(path.join('styles', file), 'utf-8')),
    );
    await fs.writeFile(
      path.join('project-dist', 'bundle.css'),
      styles.join('\n'),
    );

    console.log('Merged!');
  } catch (error) {
    console.error(error);
  }
}

mergeStyles();
