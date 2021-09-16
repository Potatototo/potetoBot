module.exports = {
	name: 'skip',
	alias: 's',
	description: 'Skip current song.',
	execute(message, args, queueHolder) {
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to skip this song!');
		try {
			queueHolder.dispatcher.end();
		} catch (err) {
			console.error(err);
		}
	},
};