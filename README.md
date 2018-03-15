# rates

Fail-resistant BTC and ETH price fetching

## Running the server

Need to install [the newest version of node](https://nodejs.org). Then then npm binary is also included. No need to use tools such as `nvm`.

```sh
npm install
npm start
```

## Environment variables

* `SLACK_NAME` = Slack channel name for error reporting
* `SLACK_API_KEY` = Slack API key for error reporting
* `TESTNET` = if you want to fetch ETH block numbers from Kovan. Default `false`
* `INTERVAL` = Fetching interval `10000`

## Testing

Run `npm test` for the test suite.
