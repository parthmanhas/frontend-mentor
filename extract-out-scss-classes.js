const fs = require('fs');

function extractClassNamesFromSCSS(filePath) {
    const scssContent = fs.readFileSync(filePath, 'utf-8');

    // Regular expression to match class names
    const regex = /\.([A-Za-z_][A-Za-z0-9_-]*)\b(?!s)/g;

    const classNames = scssContent.match(regex);
    if (classNames) {
        // Remove the dot (.) prefix from each class name
        const cleanedClassNames = classNames.map(className => className.substring(1));
        return cleanedClassNames;
    }

    return [];
}

// Example usage
// const scssFilePath = 'src/app/components/sidebar/sidebar.component.scss';
// const extractedClassNames = extractClassNamesFromSCSS(scssFilePath);
// console.log({ 'sidebar.component.scss': extractedClassNames });

module.exports = extractClassNamesFromSCSS;