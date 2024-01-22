const fs = require('fs').promises;
const path = require('path');

async function mergeStyles() {
  try {
    const stylesRoute = path.join(__dirname, 'styles');
    const stylesContents = await fs.readdir(stylesRoute);
    const styles = await Promise.all(
      stylesContents
        .filter((file) => path.extname(file) === '.css')
        .map((file) => fs.readFile(path.join(stylesRoute, file), 'utf-8')),
    );
    const projectDist = path.join(__dirname, 'project-dist');
    await fs.writeFile(path.join(projectDist, 'style.css'), styles.join('\n'));

    console.log('Merged!');
  } catch (error) {
    console.error(error);
  }
}

async function copyDir(main, copy) {
  try {
    const files = await fs.readdir(main);
    for (const file of files) {
      const mainPath = path.join(main, file);
      const copyPath = path.join(copy, file);
      const stat = await fs.stat(mainPath);

      if (stat.isDirectory()) {
        await fs.mkdir(copyPath, { recursive: true });
        await copyDir(mainPath, copyPath);
      } else {
        await fs.copyFile(mainPath, copyPath);
      }
    }
    console.log('Copied!');
  } catch (error) {
    console.error(error);
  }
}

async function buildPage() {
  try {
    const projectDist = path.join(__dirname, 'project-dist');
    await fs.mkdir(projectDist, { recursive: true });
    console.log('"Project-dist" folder.');

    const templateRoute = path.join(__dirname, 'template.html');
    const templateContent = await fs.readFile(templateRoute, 'utf-8');
    console.log('Read and saved template.');

    const templateTags = templateContent.match(/\{\{(.*?)\}\}/g) || [];

    let modifiedTemplate = templateContent;
    for (const tag of templateTags) {
      const componentName = tag.slice(2, -2).trim();
      const componentRoute = path.join(
        __dirname,
        'components',
        `${componentName}.html`,
      );
      try {
        const componentContent = await fs.readFile(componentRoute, 'utf-8');
        modifiedTemplate = modifiedTemplate.replace(tag, componentContent);
      } catch (componentError) {
        console.error(
          `  - Error reading content from "${componentRoute}": ${componentError.message}`,
        );
      }
    }

    const html = path.join(projectDist, 'index.html');
    await fs.writeFile(html, modifiedTemplate);
    console.log('Modified template to "index.html".');

    await mergeStyles();
    console.log('Compiled styles.');

    const assetsMainRoute = path.join(__dirname, 'assets');
    const assetsCopyRoute = path.join(projectDist, 'assets');
    await copyDir(assetsMainRoute, assetsCopyRoute);
    console.log('Copied "assets".');

    console.log('Page built! Congratulations!');
  } catch (error) {
    console.error('Error building page:', error.message);
  }
}

buildPage();
