/**
 * Created by Administrator on 2014/7/17.
 */
var express = require('express');
var router = express.Router();


router.get('/:username', function(req, res) {
    res.render('nexus', { user: req.params.username});
});

router.get('/', function(req, res) {
    res.render('nexus', { user: 'req.params.username'});
});
module.exports = router;
