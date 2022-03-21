var express = require('express');
var router = express.Router();
let fetch = require('node-fetch');

Array.prototype.shuffle =
	Array.prototype.shuffle ||
	function() {
		var copy = this.slice(),
			arr = [];
		while (copy.length) arr.push(copy.splice((Math.random() * copy.length) << 0));
		return arr;
	};

router.get('/', function(req, res, next) {
	fetch('http://34.129.140.166/wp-json/wp/v2/media?per_page=100').then((response) => response.json()).then((data) => {
		let rData = randEl(data, 9);

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
		// const uniqImgs = [ ...new Set(imgArry.map((item) => item[4])) ];
		const arrUniq = [ ...new Map(imgArry.map((v) => [ v.url, v ])).values() ];
		res.render('index2', { title: 'Public Protocols', images: arrUniq });
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
