const got = require('got');
const cheerio = require('cheerio');

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
