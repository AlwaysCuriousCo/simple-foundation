const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

module.exports = (req, res, next) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadPath = path.join(__dirname, 'uploads', 'temp', req.file.filename);
  const extractPath = path.join(__dirname, 'uploads', 'temp', req.file.filename.replace(path.extname(req.file.filename), ''));

  try {
    const zip = new AdmZip(uploadPath);
    zip.extractAllTo(extractPath, true);
    req.pluginPath = extractPath;
    next();
  } catch (err) {
    res.status(500).send('Error extracting the plugin.');
  }
};
