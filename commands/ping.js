module.exports = {
	name: 'ping',
	description: 'Pong!',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};