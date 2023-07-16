const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../Images"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// Custom function to set the maximum file size to 100 MB (100 * 1024 KB).
const fileSizeLimit = 20 * 1024 * 1024;

const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileSizeLimit,
  },
});

module.exports = upload;
