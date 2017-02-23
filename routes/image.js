var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'upload/' })
var path = require('path');
var appConfig = require('./config/app.json')[process.env.NODE_ENV];

/* GET home page. */
router.get('/:name', function(req, res, next) {
    // console.log(req.params['name']);

    // console.log(__dirname + "/../upload/" + req.params['name']);
    // TODO : content type mime 읽어서 반환하거나, 업로드 받을때, content type 별로 분류해놓아야 할듯.
    res.sendFile(path.resolve(__dirname + "/../upload/" + req.params['name']), {headers: {'Content-Type': 'image/jpeg'}});
});



router.post('/add', upload.single('file'), function (req, res, next) {
    // console.log(req.file);
    res.send("http://" + appConfig.hostname + ":" + appConfig.port + "/image/" + req.file.filename);
});


module.exports = router;
