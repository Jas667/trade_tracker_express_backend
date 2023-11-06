const fs = require('fs');

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete file.", err);
    } else {
      console.log(`Successfully deleted file ${filePath}`);
    }
  });
}

module.exports = {
  deleteFile
};
