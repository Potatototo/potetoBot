const { createAudioPlayer
			, createAudioResource
			, entersState
			, joinVoiceChannel
			, AudioPlayerStatus
			, VoiceConnectionStatus
	} = require('@discordjs/voice')

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

			if (!queueHolder.subscription) {
				connection = joinVoiceChannel({
					channelId: vc.id,
					guildId: vc.guild.id,
					adapterCreator: vc.guild.voiceAdapterCreator
				});
				await entersState(connection, VoiceConnectionStatus.Ready, 5000);
				player = createAudioPlayer();
				player.on('stateChange', (oldState, newState) => {
					if (newState.status === AudioPlayerStatus.Idle) {
						console.log("Song finished");
						this.play(queueHolder.songs.shift(), queueHolder);
					}
				});
				queueHolder.subscription = connection.subscribe(player);
				console.log('Connection set');
			}

			const songInfo = await ytdl.getInfo(args[0]);

			if (queueHolder.subscription.player.state.status === AudioPlayerStatus.Idle) {
				this.play(songInfo.videoDetails.video_url, queueHolder);
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
		if (song) {
			const resource = createAudioResource(ytdl(song));
			queueHolder.subscription.player.play(resource);
		}
	}
};
