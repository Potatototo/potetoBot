const ytdl = require('ytdl-core');
module.exports = {
	name: 'play',
	description: 'Plays song from youtube link.',
	async execute(message, args) {
		const vc = message.member.voice.channel;
			if (!vc) {
				return message.channel.send('You need to be in a voice channel for this!');
		}

		try {
			var connection = await vc.join();
			const dispatcher = connection.play(ytdl(args[0])).on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(0.25);
		} catch (err) {
			console.error(err);
		}
	},
};