const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nowplaying',
	alias: 'np',
	description: 'Currently playing song',
	execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
				.addField('\u200b', 'You need to be in a voice channel for this!', false)
				.setTimestamp()
			message.channel.send({ embeds: [e] });
		}
		if (queueHolder.currentSong) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
				.addField('Currently playing', queueHolder.currentSong, false)
				.setTimestamp()
			message.channel.send({ embeds: [e] });
		} else {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
				.addField('\u200b', 'Nothing is playing at the moment.', false)
				.setTimestamp()
			message.channel.send({ embeds: [e] });
		}
	},
};