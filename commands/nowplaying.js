module.exports = {
	name: 'nowplaying',
	alias: 'np',
	description: 'Currently playing song',
	execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			return message.channel.send('You need to be in a voice channel for this!');
		}
		if (queueHolder.currentSong) {
			message.channel.send('Currently playing:\n     ' + queueHolder.currentSong);
		} else {
			message.channel.send('Nothing is playing at the moment.');
		}
	},
};