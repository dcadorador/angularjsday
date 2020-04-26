
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'Express'
    });
});

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;
