const got = require('got');
const cheerio = require('cheerio');
const lodash = require('lodash');
const median = require('median');
const reflect = require('p-reflect');
const bot = require('./slackbot');

exports.getFromBlockchainInfo = async () => {
	const {body} = await got('https://blockchain.info/');
	return parseInt(
		cheerio
			.load(body)('#blocks tr:nth-child(2) td:nth-child(1)')
			.text(),
		10
	);
};

exports.getFromBlockCypher = async () => {
	const {body} = await got('https://live.blockcypher.com/btc/');
	return parseInt(
		cheerio
			.load(body)('table tr:nth-child(2) td:nth-child(1)')
			.text(),
		10
	);
};

exports.getFromBlocktrail = async () => {
	const {body} = await got(
		'https://www.blocktrail.com/BTC/json/blockchain/homeStats',
		{
			json: true
		}
	);
	return parseInt(body.last_blocks[0].height, 10);
};

exports.get = async () => {
	const blockNumbers = await Promise.all(
		[
			exports.getFromBlocktrail(),
			exports.getFromBlockCypher(),
			exports.getFromBlockchainInfo()
		].map(reflect)
	);
	const [fulfilled, failed] = lodash.partition(
		blockNumbers,
		p => p.isFulfilled
	);
	failed.forEach(p => {
		bot.send(
			'#icoexceptions',
			['Error fetching BTC block no:', p.reason.message, p.reason.stack].join(
				'\n'
			)
		);
	});
	return Math.round(median(fulfilled.map(p => p.value)));
};
