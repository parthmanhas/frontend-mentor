const fs = require('fs');
const path = require('path');

const extractClassNamesFromSCSS = require('./extract-out-scss-classes');

const directoryPath = 'src/app/components';
let allClassNames = {};
// Function to recursively read all SCSS files from the given directory
function readSCSSFiles(directory) {
    const fileNames = fs.readdirSync(directory);

    fileNames.forEach((fileName) => {
        const filePath = path.join(directory, fileName);
        const stats = fs.statSync(filePath);

        if (stats.isFile() && path.extname(fileName) === '.scss') {
            // Handle the SCSS file here (e.g., extract class names, process content)
            const classNames = extractClassNamesFromSCSS(filePath);
            allClassNames[`${filePath}`] = classNames;
        } else if (stats.isDirectory()) {
            readSCSSFiles(filePath);
        }
    });
}

// Call the function with the directory path
readSCSSFiles(directoryPath);
console.log(JSON.stringify(allClassNames))