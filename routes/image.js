var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'upload/' })
var path = require('path');

/* GET home page. */
router.get('/:name', function(req, res, next) {
    console.log(req.params['name']);

    console.log(__dirname + "/../upload/" + req.params['name']);
    res.sendFile(path.resolve(__dirname + "/../upload/" + req.params['name']), {headers: {'Content-Type': 'image/jpeg'}});
});



router.post('/add', upload.single('file'), function (req, res, next) {
    console.log(req.file);
    res.send("http://jangdock.cafe24.com:3011/image/" + req.file.filename);
});


module.exports = router;
