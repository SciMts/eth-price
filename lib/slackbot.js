const Slackbot = require('slackbot');

if (!process.env.SLACK_NAME && !process.env.CI) {
	throw new Error('Specify SLACK_NAME');
}
if (!process.env.SLACK_API_KEY && !process.env.CI) {
	throw new Error('Specify SLACK_API_KEY');
}

const bot = new Slackbot(process.env.SLACK_NAME, process.env.SLACK_API_KEY);

module.exports = bot;
