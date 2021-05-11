const multer = require("multer");
const path = require("path");
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const config  = require("config");

var storage = new GridFsStorage({
  url: config.get('DB_STRING'),
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const originalname = file.originalname;
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
          aliases: originalname,
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

module.exports = upload;
