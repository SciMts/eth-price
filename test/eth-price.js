import test from 'ava';
import {max, min} from 'lodash';
import {
	getFromCoinmarketCap,
	getFromGdax,
	getFromKraken
} from '../lib/get-price';
import {ETH} from '../lib/currencies';

test('CMC', async t => {
	const btcPrice = await getFromCoinmarketCap(ETH);
	t.true(btcPrice > 100);
	t.true(btcPrice < 10000);
});

test('GDAX', async t => {
	const btcPrice = await getFromGdax(ETH);
	t.true(btcPrice > 100);
	t.true(btcPrice < 10000);
});

test('Kraken', async t => {
	const btcPrice = await getFromKraken(ETH);
	t.true(btcPrice > 100);
	t.true(btcPrice < 10000);
});

test('Less than $150 spread', async t => {
	const prices = await Promise.all([
		getFromCoinmarketCap(ETH),
		getFromGdax(ETH),
		getFromKraken(ETH)
	]);
	t.true(max(prices) - min(prices) < 150);
});
