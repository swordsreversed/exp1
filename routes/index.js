var express = require('express');
var router = express.Router();
let fetch = require('node-fetch');

let imgArry3 = [
	// 'Person_01.png',
	// 'Person_02.png',
	// 'Photo_01.png',
	// 'Photo_03.png',
	// 'Text_01.png',
	// 'Photo_02.png',
	// 'Text_03.png',
	// 'Text_02.png'
];

router.get('/', function(req, res, next) {
	fetch('http://34.129.140.166/wp-json/wp/v2/media?per_page=100').then((response) => response.json()).then((data) => {
		let rData = randEl(data, 10);

		// imgArry = rData.map((item) => item.source_url);
		imgArry = rData.map((item) => {
			let ims = item.source_url.split('.');
			const regex = /<a.+>.+<\/a>/i;

			return {
				url: item.source_url,
				description: item.description.rendered
					.replaceAll('"', "'")
					.replace(/(?:\r\n|\r|\n)/g, '<br>')
					.replace(regex, ''),
				caption: item.caption.rendered.replace(/(?:\r\n|\r|\n)/g, '<br>'),
				alt: item.alt_text.replace(/(?:\r\n|\r|\n)/g, '<br>'),
				altShort: item.alt_text.replace(' ', '')
			};
		});
		// console.log(imgArry);
		res.render('index', { title: 'Public Protocols', images: imgArry });
	});
});

let randEl = (array, number) => {
	let tmpAr = [];
	for (let index = 0; index < number; index++) {
		tmpAr.push(array[Math.floor(Math.random() * array.length)]);
	}
	return tmpAr;
};

module.exports = router;
