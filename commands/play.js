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
			if (!queueHolder.voiceChannel) {
				queueHolder.voiceChannel = vc;
				console.log('Voice Channel set')
			}

			if (!queueHolder.connection) {
				queueHolder.connection = await queueHolder.voiceChannel.join();
				console.log('Connection set')
			}
			
			const songInfo = await ytdl.getInfo(args[0]);

			if (!queueHolder.dispatcher || !queueHolder.playing) {
				this.play(songInfo.videoDetails.video_url, queueHolder);
				queueHolder.playing = true;
				message.channel.send(`Now playing **${songInfo.videoDetails.title}**!`);
			} else {
				queueHolder.songs.push(songInfo.videoDetails.video_url);
				message.channel.send(`Added **${songInfo.videoDetails.title}** to the queue!`);
			}
			
		} catch (err) {
			message.channel.send(`Oh no something went wrong :(\n${err}`);
			console.error(err);
		}
	},

	play(song, queueHolder) {
		if (!song) {
			queueHolder.playing = false;
			return;
		}
		queueHolder.dispatcher = queueHolder.connection.play(ytdl(song))
		queueHolder.dispatcher.on('finish', () => {
			console.log("finish");
			this.play(queueHolder.songs.shift(), queueHolder);
		});
		queueHolder.dispatcher.on('error', err => console.error(err));
		queueHolder.dispatcher.setVolumeLogarithmic(queueHolder.volume);
	},
};