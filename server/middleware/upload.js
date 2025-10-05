const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(12, (err, bytes) => {
      if (err) return cb(err);
      const fn = bytes.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const ext = allowed.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only images are allowed"));
  },
});

module.exports = upload;
