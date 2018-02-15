import test from 'ava';
import {max, min} from 'lodash';
import {
	getFromCoinmarketCap,
	getFromGdax,
	getFromKraken
} from '../lib/get-price';
import {BTC} from '../lib/currencies';

test('CMC', async t => {
	const btcPrice = await getFromCoinmarketCap(BTC);
	t.true(btcPrice > 1000);
	t.true(btcPrice < 1000000);
});

test('GDAX', async t => {
	const btcPrice = await getFromGdax(BTC);
	t.true(btcPrice > 1000);
	t.true(btcPrice < 1000000);
});

test('Kraken', async t => {
	const btcPrice = await getFromKraken(BTC);
	t.true(btcPrice > 1000);
	t.true(btcPrice < 1000000);
});

test('Less than $1000 spread', async t => {
	const prices = await Promise.all([
		getFromCoinmarketCap(),
		getFromGdax(),
		getFromKraken()
	]);
	t.true(max(prices) - min(prices) < 1000);
});
