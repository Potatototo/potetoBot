const { MessageEmbed } = require('discord.js');
const { createAudioPlayer
			, entersState
			, joinVoiceChannel
			, AudioPlayerStatus
			, VoiceConnectionStatus
	} = require('@discordjs/voice')

module.exports = {
	name: 'join',
	description: 'Join your voice channel.',
	async execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You need to be in a voice channel for this!', false)
				.setTimestamp();
			return message.channel.send({ embeds: [e] });
		}
		try {
			console.log(`Joining ${vc.name}`);
			queueHolder.voiceChannel = vc;
			const connection = joinVoiceChannel({
				channelId: vc.id,
				guildId: vc.guild.id,
				adapterCreator: vc.guild.voiceAdapterCreator
			});
			await entersState(connection, VoiceConnectionStatus.Ready, 5000);
			player = createAudioPlayer();
			player.on('stateChange', (oldState, newState) => {
				if (newState.status === AudioPlayerStatus.Idle) {
					console.log("finish");
					if (queueHolder.songs.length > 0) {
						nextSong = queueHolder.songs.shift();
						queueHolder.currentSong = nextSong.title + ' - ' + nextSong.ownerChannelName;
						this.play(nextSong.video_url, queueHolder);
					}		
				}
			});
			queueHolder.subscription = connection.subscribe(player);
		} catch (err) {
			console.log(err);
		}
	}
};
