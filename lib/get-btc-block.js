const got = require('got');
const cheerio = require('cheerio');

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
