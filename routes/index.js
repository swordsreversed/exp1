var express = require('express');
var router = express.Router();
let fetch = require('node-fetch');
const NodeCache = require('node-cache');
let regxw = /Week-0(\d*)_/;
let media = [];
let rData;
let nev;
let dataPromise;
const myCache = new NodeCache({ stdTTL: 604800 });

router.get('/', async (req, res, next) => {
	let posts = myCache.get('allPosts');

	if (posts == null) {
		console.log('no cache');
		posts = await getMedia(req.params);
		myCache.set('allPosts', posts, 604800);
	}

	let renderArray = createRender(posts, req.params);
	res.render('main', { title: 'Public Protocols', images: renderArray });
});

router.get('/search/:key', async (req, res, next) => {
	let posts = myCache.get('allPosts');

	if (posts == null) {
		console.log('no cache');
		posts = await getMedia(req.params);
		myCache.set('allPosts', posts, 300);
	}

	let renderArray = createRender(posts, req.params);
	res.render('main', { title: 'Public Protocols', images: renderArray, key: req.params.key });
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
	// fix media data shape
	let dataFix = data.map((d) => {
		if (d.media_type === 'file') {
			d.alt_text = d.title.rendered;

			return d;
		} else {
			return d;
		}
	});

	dataFix.sort(() => Math.random() - 0.5);
	let quicksort = dataFix.filter((d) => d.alt_text.length > 0);
	if (params.key) {
		var re = new RegExp(params.key, 'i');
		nev = quicksort.filter((e) => {
			let m = e.caption.rendered.match(re);
			if (m && m.length > 0) {
				return m[0];
			}
		});
		rData = randEl(nev, 10);
	} else {
		rData = randEl(quicksort, 10);
	}

	imgArry = rData.map((item) => {
		const regex = /<a.+>.+<\/a>/i;
		const regexRep = /\W*/gi;

		return {
			url: item.source_url,
			description: item.description.rendered
				.replaceAll('"', "'")
				.replace(/(?:\r\n|\r|\n)/g, '<br>')
				.replace(regex, ''),
			caption: item.caption.rendered.replace(/(?:\r\n|\r|\n)/g, '<br>'),
			altShort: item.alt_text.replace(regexRep, ''),
			alt: item.alt_text.replace(/(?:\r\n|\r|\n)/g, '<br>'),
			title: item.title.rendered
		};
	});

	const arrUniq = [ ...new Map(imgArry.map((v) => [ v.url, v ])).values() ];
	return arrUniq;
}

module.exports = router;
