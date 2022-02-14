var express = require('express');
var router = express.Router();

let imgArry = [
	'Person_01.png',
	'Person_02.png',
	'Photo_01.png',
	'Photo_03.png',
	'Text_01.png',
	'Photo_02.png',
	'Text_03.png',
	'Text_02.png'
];

router.get('/', function(req, res, next) {
	res.render('index', { title: 'Public Protocols', images: imgArry });
});

module.exports = router;
