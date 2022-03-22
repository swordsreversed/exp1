var express = require('express');
var router = express.Router();
let fetch = require('node-fetch');

let media = [];
router.get('/', function(req, res, next) {
	(async () => {
		const tdata = await fetch('http://34.129.140.166/wp-json/wp/v2/media?per_page=100');
		const [ ...nres ] = await tdata.headers;

		const total = nres.filter((el) => el[0] == 'x-wp-totalpages');
		console.log('total', total[0][1]);

		for (let index = 1; index <= total[0][1]; index++) {
			let url = 'http://34.129.140.166/wp-json/wp/v2/media?per_page=100&page=' + index;
			let jdata = await fetch(url);
			media.push(await jdata.json());
		}

		const data = media.flat(1);
		data.sort(() => Math.random() - 0.5);

		const rData = randEl(data, 10);
		imgArry = rData.map((item) => {
			const regex = /<a.+>.+<\/a>/i;

			return {
				url: item.source_url,
				description: item.description.rendered
					.replaceAll('"', "'")
					.replace(/(?:\r\n|\r|\n)/g, '<br>')
					.replace(regex, ''),
				caption: item.caption.rendered.replace(/(?:\r\n|\r|\n)/g, '<br>'),
				alt: item.alt_text.replace(/(?:\r\n|\r|\n)/g, '<br>'),
				altShort: item.alt_text.replace(' ', ''),
				title: item.title.rendered
			};
		});
		const arrUniq = [ ...new Map(imgArry.map((v) => [ v.url, v ])).values() ];
		res.render('cursor', { title: 'Public Protocols', images: arrUniq });
	})();
});

let randEl = (array, number) => {
	let tmpAr = [];
	for (let index = 0; index < number; index++) {
		tmpAr.push(array[Math.floor(Math.random() * array.length)]);
	}
	return tmpAr;
};

module.exports = router;
