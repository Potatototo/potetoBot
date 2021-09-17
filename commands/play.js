const { createAudioPlayer
			, createAudioResource
			, entersState
			, joinVoiceChannel
			, AudioPlayerStatus
			, VoiceConnectionStatus
	} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));;
const { MessageEmbed } = require('discord.js');

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
						if (queueHolder.songs.length > 0) {
							nextSong = queueHolder.song.shift();
							queueHolder.currentSong = nextSong.title;
							this.play(nextSong.video_url, queueHolder);
						} else {
							queueHolder.currentSong = null;
						}
					}
				});
				queueHolder.subscription = connection.subscribe(player);
				console.log('Connection set');
			}
			
			let songInfo;
			console.log("args: ", (args[0].indexOf('http') === -1));
			if (args[0].indexOf('http') === -1) {
				const keystring = args.join(' ');
				const search = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keystring}&key=AIzaSyBxWcgRWmI1p1ACOJsTSlIrsKwf7vn6X0A`)
        			.then(response => response.json());	
				songInfo = await ytdl.getInfo(search.items[0].id.videoId);
			} else {
				songInfo = await ytdl.getInfo(args[0]);
			}
			

			if (queueHolder.subscription.player.state.status === AudioPlayerStatus.Idle) {
				this.play(songInfo.videoDetails.video_url, queueHolder);
				queueHolder.currentSong = songInfo.videoDetails.title;
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
					.addField('\u200b', `Now playing **${songInfo.videoDetails.title}**!`, false)
					.setTimestamp()
				message.channel.send({ embeds: [e] });
			} else {
				queueHolder.songs.push(songInfo.videoDetails);
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
					.addField('\u200b', `Added **${songInfo.videoDetails.title}** to the queue!`, false)
					.setTimestamp()
				message.channel.send({ embeds: [e] });
			}

		} catch (err) {
			message.channel.send(`Oh no something went wrong :(\n${err}`);
			console.error(err);
		}
	},

	play(song, queueHolder) {
		const resource = createAudioResource(ytdl(song));
		queueHolder.subscription.player.play(resource);
	}
};
