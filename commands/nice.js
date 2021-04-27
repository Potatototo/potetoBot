module.exports = {
	name: 'nice',
	description: 'fu paul.',
	execute(message, args) {
		message.channel.send(`no fuck you ${message.author.username}\nnever do this`);
	},
};