module.exports = {
	name: 'stop',
	description: 'Stop playing.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};