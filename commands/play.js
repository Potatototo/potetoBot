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
	usage: '<title/link>',
	description: 'Play given song.',
	category: 'music',
	async execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You need to be in a voice channel for this!', false);
			return message.channel.send({ embeds: [e] });
		}
		if (!args[0]) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You need to give me a link!', false);
			return message.channel.send({ embeds: [e] });
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
							queueHolder.currentSong = nextSong.title + ' - ' + nextSong.ownerChannelName;
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
				queueHolder.currentSong = songInfo.videoDetails.title + ' - ' + songInfo.videoDetails.ownerChannelName;
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
					.addField('Now playing', songInfo.videoDetails.title + ' - ' + songInfo.videoDetails.ownerChannelName, false)
					.setTimestamp()
				message.channel.send({ embeds: [e] });
			} else {
				queueHolder.songs.push(songInfo.videoDetails);
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
					.addField('Added to Queue', songInfo.videoDetails.title + ' - ' + songInfo.videoDetails.ownerChannelName, false)
					.setTimestamp()
				message.channel.send({ embeds: [e] });
			}

		} catch (err) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', `Oh no something went wrong :(\n${err}`, false);
			message.channel.send({ embeds: [e] });
			console.error(err);
		}
	},

	play(song, queueHolder) {
		const resource = createAudioResource(ytdl(song));
		queueHolder.subscription.player.play(resource);
	}
};
