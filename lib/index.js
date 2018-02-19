const {BTC, ETH} = require('./currencies');
const btcBlock = require('./get-btc-block');
const ethBlock = require('./get-eth-block');
const price = require('./get-price');

setInterval(async () => {
	const btcBlockNo = await btcBlock.get();
	const ethBlockNo = await ethBlock.get();
	const btcPrice = await price.get(BTC);
	const ethPrice = await price.get(ETH);
	console.log('The current BTC block is', btcBlockNo);
	console.log('The current ETH block is', ethBlockNo);
	console.log('The current BTC price is', btcPrice);
	console.log('The current ETH price is', ethPrice);
}, 10000);
