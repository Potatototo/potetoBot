module.exports = {
	name: 'stop',
	description: 'Stop playing.',
	execute(message, args, queueHolder) {
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
		try {
			queueHolder.songs = [];
			queueHolder.dispatcher.end();
		} catch (err) {
			console.error(err);
		}
	},
};