const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { verifyAdmin } = require('../utils/auth');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

function ensureUploadsDir() {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureUploadsDir();
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeBase = (file.originalname || 'image')
      .toLowerCase()
      .replace(/[^a-z0-9.\-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^\-+|\-+$/g, '');
    const ext = path.extname(safeBase) || '';
    const baseNoExt = safeBase.replace(new RegExp(`${ext}$`), '') || 'image';
    cb(null, `${Date.now()}-${baseNoExt}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype || '');
    if (!ok) return cb(new Error('Only image files are allowed (png, jpg, jpeg, webp, gif)'));
    cb(null, true);
  }
});

router.post('/image', verifyAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
