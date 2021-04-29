module.exports = {
	name: 'skip',
	alias: 's',
	description: 'Skip current song.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};