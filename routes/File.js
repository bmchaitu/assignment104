const mongoose = require("mongoose");
const config = require('config');
const Grid = require("gridfs-stream");
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const express = require('express');
const route = express.Router();

const conn = mongoose.createConnection(config.get('DB_STRING'), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

route.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
  // res.redirect('/');
});

  route.get('/api/getfiles', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }

      // Files exist
      return res.json(files);
    });
  },

  getIndividualFile: (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: "No file exists",
        });
      }
      res.set({
        "Content-Type": file.contentType,
        "Content-Disposition": "attachment; filename=" + file.aliases,
      });
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    });
  },
};
