const express = require('express');
const multer = require('multer');
const { processExcel } = require('../controllers/candidateController');

const router = express.Router();

// Use Multer to parse the incoming file directly
const upload = multer();

router.post('/upload', upload.single('file'), processExcel);

module.exports = router;
