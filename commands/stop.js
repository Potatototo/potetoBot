module.exports = {
	name: 'stop',
	description: 'Stops playing.',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};