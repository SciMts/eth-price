const {Client} = require('pg');
const {BTC, ETH} = require('./currencies');
const btcBlock = require('./get-btc-block');
const ethBlock = require('./get-eth-block');
const price = require('./get-price');
const bot = require('./slackbot');

const interval = process.env.INTERVAL || 10000;

const client = new Client();

const fetch = async () => {
	const btcBlockNo = await btcBlock.get();
	const ethBlockNo = await ethBlock.get();
	const btcPrice = await price.get(BTC);
	const ethPrice = await price.get(ETH);
	await client.query(
		`INSERT INTO exchange_rate (
			block_nr_btc,
			block_nr_eth,
			rate_btc,
			rate_eth,
			rate_btc_bitfinex,
			rate_eth_bitfinex,
			rate_iota_bitfinex,
			creation_date
		)
		VALUES($1::bigint , $2::bigint, $3::numeric, $4::numeric, $5::numeric, $6::numeric, $7::numeric, $8::timestamp)
		`,
		[
			btcBlockNo,
			ethBlockNo,
			btcPrice,
			ethPrice,
			btcPrice,
			ethPrice,
			0,
			new Date()
		]
	);
	console.log('Inserted into database', {
		btcBlockNo,
		ethBlockNo,
		ethPrice,
		btcPrice
	});
};

const start = async () => {
	try {
		await client.connect();
		console.log(`Connected to database, fetching every ${interval} ms.`);
		setInterval(fetch, 10000);
	} catch (err) {
		bot.send(
			'#icoexceptions',
			['Error connecting to datbase:', err.message, err.stack].join('\n')
		);
	}
};

start()
	.then(() => {
		console.log('Rates application started');
	})
	.catch(err => {
		console.log('Error in rates application', err);
	});
