const got = require('got');
const cheerio = require('cheerio');
const reflect = require('p-reflect');
const lodash = require('lodash');
const median = require('median');
const bot = require('./slackbot');

exports.getFromEtherscan = async () => {
	const url = process.env.TESTNET
		? 'https://kovan.etherscan.io/'
		: 'https://etherscan.io/';
	const {body} = await got(url);
	const html = cheerio.load(body);
	return parseInt(
		html('.date-formats')
			.text()
			.match(/(\d)+/)[0],
		10
	);
};

exports.getFromEtherchain = async () => {
	if (process.env.TESTNET) {
		throw new Error('Etherchain does not support testnet');
	}
	const {body} = await got('https://www.etherchain.org/');
	return parseInt(
		cheerio
			.load(body)('.media:first-of-type a[href*=block]')
			.text(),
		10
	);
};

exports.getFromInfura = async () => {
	const {body} = await got(
		`https://api.infura.io/v1/jsonrpc/${
			process.env.TESTNET ? 'kovan' : 'mainnet'
		}/eth_blockNumber`,
		{json: true}
	);
	return parseInt(body.result, 16);
};

exports.get = async () => {
	const blockNumbers = await Promise.all(
		[
			exports.getFromInfura(),
			process.env.TESTNET ? null : exports.getFromEtherchain(),
			exports.getFromEtherscan()
		]
			.filter(Boolean)
			.map(reflect)
	);
	const [fulfilled, failed] = lodash.partition(
		blockNumbers,
		p => p.isFulfilled
	);
	failed.forEach(p => {
		bot.send(
			'#icoexceptions',
			['Error fetching ETH block no:', p.reason.message, p.reason.stack].join(
				'\n'
			)
		);
	});
	return Math.round(median(fulfilled.map(p => p.value)));
};
