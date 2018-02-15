const got = require('got');
const {ETH} = require('./currencies');

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
