import test from 'ava';
import {getFromEtherscan, getFromInfura} from '../lib/get-eth-block';

test.beforeEach(() => {
	process.env.TESTNET = true;
});

test.afterEach(() => {
	process.env.TESTNET = false;
});

test('Etherscan', async t => {
	const etherscan = await getFromEtherscan();
	t.true(etherscan > 6368614);
	t.true(etherscan < 50000000);
});

test('Gastracker', async t => {
	const gastracker = await getFromInfura();
	t.true(gastracker > 6368614);
	t.true(gastracker < 50000000);
});
