const got = require('got');
const cheerio = require('cheerio');
const reflect = require('p-reflect');
const lodash = require('lodash');
const median = require('median');
const bot = require('./slackbot');

exports.getFromEtherscan = async () => {
	const {body} = await got('https://etherscan.io/');
	return parseInt(
		cheerio
			.load(body)('#ContentPlaceHolder1_Label1 font')
			.text(),
		10
	);
};

exports.getFromEtherchain = async () => {
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
		'https://api.infura.io/v1/jsonrpc/mainnet/eth_blockNumber',
		{json: true}
	);
	return parseInt(body.result, 16);
};

exports.get = async () => {
	const blockNumbers = await Promise.all(
		[
			exports.getFromInfura(),
			exports.getFromEtherchain(),
			exports.getFromEtherscan()
		].map(reflect)
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
