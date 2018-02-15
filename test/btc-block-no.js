import test from 'ava';
import {max, min} from 'lodash';
import {
	getFromBlockchainInfo,
	getFromBlockCypher,
	getFromBlocktrail
} from '../lib/get-btc-block';

test('Blockchain.info', async t => {
	const blockchainInfo = await getFromBlockchainInfo();
	t.true(blockchainInfo > 509304);
});

test('Blockcypher', async t => {
	const blockCypher = await getFromBlockCypher();
	t.true(blockCypher > 509304);
});

test('Blocktrail', async t => {
	const blocktrail = await getFromBlocktrail();
	t.true(blocktrail > 509304);
});

test('Blocknumbers should be the same', async t => {
	const blockNumbers = await Promise.all([
		getFromBlocktrail(),
		getFromBlockCypher(),
		getFromBlockchainInfo()
	]);
	t.true(max(blockNumbers) - min(blockNumbers) < 5);
});
