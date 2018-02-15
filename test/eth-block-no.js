import test from 'ava';
import {max, min} from 'lodash';
import {
	getFromEtherscan,
	getFromEtherchain,
	getFromInfura
} from '../lib/get-eth-block';

test('Etherscan', async t => {
	const etherscan = await getFromEtherscan();
	t.true(etherscan > 5094833);
});

test('Etherchain', async t => {
	const etherchain = await getFromEtherchain();
	t.true(etherchain > 5094833);
});

test('Gastracker', async t => {
	const gastracker = await getFromInfura();
	t.true(gastracker > 5094833);
});

test('Block numbers should be approximately the same', async t => {
	const blockNumbers = await Promise.all([
		getFromEtherchain(),
		getFromEtherscan(),
		getFromInfura()
	]);
	t.true(max(blockNumbers) - min(blockNumbers) < 5);
});
