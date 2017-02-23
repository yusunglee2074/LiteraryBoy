var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/:name', function(req, res, next) {
    console.log(req.params['name']);

    console.log(__dirname + "/../upload/" + req.params['name']);
    res.sendFile(path.resolve(__dirname + "/../upload/" + req.params['name']), {headers: {'Content-Type': 'image/jpeg'}});
});

module.exports = router;
