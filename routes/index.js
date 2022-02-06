var express = require('express');
var router = express.Router();

let imgArry = [
	'Person_01.png',
	'Photo_01.png',
	'Shape_03.png',
	'Text_01.png',
	'Photo_02.png',
	'Shape_06.png',
	'Text_03.png',
	'Shape_04.png'
];

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Public Protocols', images: imgArry });
});

module.exports = router;
