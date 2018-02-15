const btcBlock = require('./get-btc-block');
const ethBlock = require('./get-eth-block');

setInterval(async () => {
	const btcBlockNo = await btcBlock.get();
	const ethBlockNo = await ethBlock.get();
	console.log('The current BTC block is', btcBlockNo);
	console.log('The current ETH block is', ethBlockNo);
}, 10000);
