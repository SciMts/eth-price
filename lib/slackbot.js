const Slackbot = require('slackbot');

if (!process.env.SLACK_NAME) {
	throw new Error('Specify SLACK_NAME');
}
if (!process.env.SLACK_API_KEY) {
	throw new Error('Specify SLACK_API_KEY');
}

const bot = new Slackbot(process.env.SLACK_NAME, process.env.SLACK_API_KEY);

module.exports = bot;
