const { MessageEmbed } = require('discord.js');
const { createAudioPlayer
			, entersState
			, joinVoiceChannel
			, AudioPlayerStatus
			, VoiceConnectionStatus
	} = require('@discordjs/voice');

const { createPlayerSub } = require('./play')

module.exports = {
	name: 'join',
	description: 'Join your voice channel.',
	category: 'utility',
	async execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
		    	.addField('Error', 'You need to be in a voice channel for this!', false);
			return message.channel.send({ embeds: [e] });
		}
		try {
			console.log(`Joining ${vc.name}`);
			queueHolder.voiceChannel = vc;
			const connection = joinVoiceChannel({
				channelId: vc.id,
				guildId: vc.guild.id,
				adapterCreator: vc.guild.voiceAdapterCreator,
				selfDeaf: false
			});

			await entersState(connection, VoiceConnectionStatus.Ready, 5000);
			queueHolder.subscription = createPlayerSub(connection, queueHolder);
		} catch (err) {
			console.log(err);
		}
	}
};
