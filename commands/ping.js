module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};