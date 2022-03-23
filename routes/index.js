var express = require('express');
var router = express.Router();
let fetch = require('node-fetch');
let regxw = /Week-0(\d*)_/;
let media = [];
let rData;
let nev;
let dataPromise;

router.get('/', function(req, res, next) {
	dataPromise = getMedia(req.params);
	dataPromise.then((data) => {
		let renderArray = createRender(data, req.params);
		console.log(renderArray[0]);
		res.render('main', { title: 'Public Protocols', images: renderArray });
	});
});

router.get('/search/:key', function(req, res, next) {
	dataPromise = getMedia(req.params);
	dataPromise.then((data) => {
		let renderArray = createRender(data, req.params);
		res.render('main', { title: 'Public Protocols', images: renderArray, key: req.params.key });
	});
});

let randEl = (array, number) => {
	let tmpAr = [];
	for (let index = 0; index < number; index++) {
		tmpAr.push(array[Math.floor(Math.random() * array.length)]);
	}
	return tmpAr;
};

async function getMedia() {
	const tdata = await fetch('http://34.129.140.166/wp-json/wp/v2/media?per_page=100');
	const [ ...nres ] = await tdata.headers;
	const total = nres.filter((el) => el[0] == 'x-wp-totalpages');

	for (let index = 1; index <= total[0][1]; index++) {
		let url = 'http://34.129.140.166/wp-json/wp/v2/media?per_page=100&page=' + index;
		let jdata = await fetch(url);
		media.push(await jdata.json());
	}
	return media.flat(1);
}

function createRender(data, params) {
	data.sort(() => Math.random() - 0.5);
	if (params.key) {
		nev = data.filter((e) => {
			let m = e.title.rendered.match(params.key);
			if (m && m.length > 0) {
				return m[0];
			}
		});
		rData = randEl(nev, 10);
	} else {
		rData = randEl(data, 10);
	}

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

	// filter key here

	const arrUniq = [ ...new Map(imgArry.map((v) => [ v.url, v ])).values() ];
	return arrUniq;
}

module.exports = router;
