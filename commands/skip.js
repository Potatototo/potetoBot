module.exports = {
	name: 'skip',
	description: 'Skips currently playing song.',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};