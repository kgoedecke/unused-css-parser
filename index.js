const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv

const cssClassSet = new Set();

// Using recursion, we find every file with the desired extention,
// even if its deeply nested in subfolders.
const getFilesInDirectory = (dir, ext) => {
  if (!fs.existsSync(dir)) {
    console.log(`Specified directory: ${dir} does not exist`);
    return false;
  }

  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    // If we hit a directory, apply our function to that dir.
    // If we hit a file, add it to the array of files.
    if (stat.isDirectory()) {
      const nestedFiles = getFilesInDirectory(filePath, ext);
      files = files.concat(nestedFiles);
    } else if (path.extname(file) === ext) {
      files.push(filePath);
    }
  });
  return files;
};

const searchFilesInDirectory = (dir, filter, ext) => {
  if (!fs.existsSync(dir)) {
    console.log(`Specified directory: ${dir} does not exist`);
    return;
  }

  const found = getFilesInDirectory(dir, ext);
  found.forEach((file) => {
    const fileContent = fs.readFileSync(file);
    // We want full words, so we use full word boundary in regex.
    const regex = new RegExp(`\\b${filter}\\b`);
    if (regex.test(fileContent)) {
      console.log(`Your class was found in file: ${file}`);
    }
  });
};

const readLines = (input, func) => {
  let remaining = '';

  input.on('data', (data) => {
    remaining += data;
    let index = remaining.indexOf('\n');
    while (index > -1) {
      const line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      func(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', () => {
    if (remaining.length > 0) {
      func(remaining);
    } else {
      cssClassSet.forEach((cssClass) => {
        console.log(`Scanning for ${cssClass}`);
        searchFilesInDirectory(fileDirectory, cssClass.substring(1), '.php');
      });
    }
  });
};

const func = (data) => {
  const re = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/i;
  const found = re.exec(data);
  if (found != null) {
    cssClassSet.add(...found);
  }
};

const cssFile = argv.cssfile;
const fileDirectory = argv.directory;

const input = fs.createReadStream(cssFile);
readLines(input, func);
