const {
	prefix,
	token,
    ytkey,
	geniuskey,
	mongopw,
} = require('../config.json');

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
			// connect
			if (!queueHolder.subscription) {
				connection = joinVoiceChannel({
					channelId: vc.id,
					guildId: vc.guild.id,
					adapterCreator: vc.guild.voiceAdapterCreator,
					selfDeaf: false
				});
				await entersState(connection, VoiceConnectionStatus.Ready, 5000);

				queueHolder.subscription = this.createPlayerSub(connection, queueHolder);
				console.log('Connection set');
			}

			// get song info
			let songInfo;
			if (args[0].indexOf('http') === -1) {
				const keystring = args.join(' ');
				const search = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keystring}&key=${ytkey}`)
        			.then(response => response.json());
				songInfo = await ytdl.getInfo(search.items[0].id.videoId);
			} else {
				songInfo = await ytdl.getInfo(args[0]);
			}

			// log play in DB
			await queueHolder.mongoClient.connect();
			const collection = queueHolder.mongoClient.db("potetobot").collection("stats");
			
			const query = {	title: songInfo.videoDetails.title,
							artist: songInfo.videoDetails.ownerChannelName}
			const queryResult = await collection.distinct("count", query)
			songCount = queryResult.length == 0 ? 0 : queryResult[0]
			
			// insert new entry or update if already
			const dbSong = {
				title: songInfo.videoDetails.title,
				artist: songInfo.videoDetails.ownerChannelName,
				count: songCount + 1
			}
			const options = { upsert: true };

			const dbResult = await collection.replaceOne(query, dbSong, options);
			
			queueHolder.mongoClient.close();

			// add song to queue or play
			const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png');
			if (queueHolder.subscription.player.state.status === AudioPlayerStatus.Idle) {
				this.play(songInfo.videoDetails.video_url, queueHolder);
				queueHolder.currentSong = songInfo.videoDetails;
				e.addField('Now playing', songInfo.videoDetails.title + ' - ' + songInfo.videoDetails.ownerChannelName, false);
				queueHolder.client.user.setActivity(queueHolder.currentSong.title, { type: 'PLAYING' });
			} else {
				queueHolder.songs.push(songInfo.videoDetails);
				e.addField('Added to Queue', songInfo.videoDetails.title + ' - ' + songInfo.videoDetails.ownerChannelName, false);
			}
			message.channel.send({ embeds: [e] });

		} catch (err) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', `Oh no something went wrong :(\n${err}`, false);
			message.channel.send({ embeds: [e] });
			console.error(err);
		}
	},

	createPlayerSub(connection, queueHolder) {
		player = createAudioPlayer();
		player.on('stateChange', (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle) {
				console.log("Song finished");
				if (queueHolder.songs.length > 0) {
					nextSong = queueHolder.songs.shift();
					queueHolder.currentSong = nextSong;
					queueHolder.client.user.setActivity(nextSong.title, { type: 'PLAYING' });
					this.play(nextSong.video_url, queueHolder);
				} else {
					queueHolder.currentSong = null;
					queueHolder.client.user.setActivity('you', { type: 'WATCHING' });
				}
			}
		});
		player.on ('error', (error) => {
			console.log('Audio player error: ', error.message);
		});
		return connection.subscribe(player);
	},

	play(song, queueHolder) {
		const resource = createAudioResource(ytdl(song, {
			filter: 'audioonly',
			quality: 'highestaudio',
			highWaterMark: 1<<25
		} ));
		queueHolder.subscription.player.play(resource);
	}
};
