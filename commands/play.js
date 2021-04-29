const ytdl = require('ytdl-core');
module.exports = {
	name: 'play',
	alias: 'p',
	usage: '<link>',
	description: 'Play song from youtube link.',
	async execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			return message.channel.send('You need to be in a voice channel for this!');
		}
		if (!args[0]) {
			return message.channel.send('You need to give me a link!');
		}

		try {
			if (!queueHolder.textChannel) {
				message.textChannel;
				console.log('Text Channel set')
			}

			if (!queueHolder.voiceChannel) {
				queueHolder.voiceChannel = vc;
				console.log('Voice Channel set')
			}

			if (!queueHolder.connection) {
				queueHolder.connection = await queueHolder.voiceChannel.join();
				console.log('Connection set')
			}
			
			if (!queueHolder.dispatcher) {

			} else {

			}
			queueHolder.dispatcher = queueHolder.connection.play(ytdl(args[0])).on('error', error => console.error(error));
			dispatcher.setVolumeLogarithmic(0.25);
		} catch (err) {
			message.channel.send(`Oh no something went wrong :(\n${err}`);
			console.error(err);
		}
	},

	play(song) {
		if (!song) {
			return;
		}
		queueHolder.dispatcher = queueHolder.connection
			.play(ytdl(song))
			.on('finish', () => {
				queueHolder.songs.shift();
				this.play(queueHolder.songs[0]);
			})
			.on('error', err => console.error(err));
		queueHolder.dispatcher.setVolumeLogarithmic(queueHolder.volume);
	},
};