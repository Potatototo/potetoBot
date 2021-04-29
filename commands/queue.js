module.exports = {
	name: 'queue',
    alias: 'q',
    usage: '<page>',
	description: 'Show current queue.',
	execute(message, args, queueHolder) {
		message.channel.send('Pong.');
	},
};