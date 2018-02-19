const got = require('got');
const lodash = require('lodash');
const reflect = require('p-reflect');
const {ETH} = require('./currencies');
const bot = require('./slackbot');

exports.getFromCoinmarketCap = async currency => {
	const string = currency === ETH ? 'ethereum' : 'bitcoin';
	const {body} = await got(
		`https://api.coinmarketcap.com/v1/ticker/${string}/`,
		{
			json: true
		}
	);
	return parseFloat(body[0].price_usd);
};

exports.getFromGdax = async currency => {
	const string = currency === ETH ? 'ETH' : 'BTC';
	const {body} = await got(
		`https://api.gdax.com/products/${string}-USD/ticker`,
		{
			json: true
		}
	);
	return parseFloat(body.price);
};

exports.getFromKraken = async currency => {
	const string = currency === ETH ? 'ETH' : 'XBT';
	const {body} = await got(
		`https://api.kraken.com/0/public/Ticker?pair=${string}USD`,
		{
			json: true
		}
	);
	return parseFloat(
		body.result[currency === ETH ? 'XETHZUSD' : 'XXBTZUSD'].c[0]
	);
};

exports.get = async currency => {
	const prices = await Promise.all(
		[
			exports.getFromCoinmarketCap(currency),
			exports.getFromKraken(currency),
			exports.getFromGdax(currency)
		].map(reflect)
	);
	const [fulfilled, failed] = lodash.partition(prices, p => p.isFulfilled);
	failed.forEach(p => {
		bot.send(
			'#icoexceptions',
			['Error fetching BTC block no:', p.reason.message, p.reason.stack].join(
				'\n'
			)
		);
	});
	return (
		fulfilled.map(p => p.value).reduce((a, b) => a + b, 0) / fulfilled.length
	).toFixed(2);
};
