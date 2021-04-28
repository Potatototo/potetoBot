module.exports = {
	name: 'stop',
	description: 'Stops playing.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};