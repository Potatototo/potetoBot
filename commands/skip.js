module.exports = {
	name: 'skip',
	description: 'Skips currently playing song.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};