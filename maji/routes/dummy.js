var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    //console.log(req.session);
    res.render('index');
});

module.exports = router;

