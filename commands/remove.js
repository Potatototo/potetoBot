module.exports = {
	name: 'remove',
    alias: 'r',
    usage: '<index>',
	description: 'Remove song from queue.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};