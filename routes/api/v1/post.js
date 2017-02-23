var express = require('express');
var async = require('async');
var router = express.Router();
var Model = require('../../../models');
var multer = require('multer');
var upload = multer({ dest: 'upload/' })


router.post('/:isbn13/image', upload.single('file'), function (req, res, next) {
    console.log(req.file);
    res.send("http://jangdock.cafe24.com:3011/image/" + req.file.filename);
});

module.exports = router;
