module.exports = {
	name: 'volume',
    alias: 'v',
    usage: '<volume>',
	description: 'Set the volume from 0-100.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};