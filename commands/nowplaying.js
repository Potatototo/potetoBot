const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nowplaying',
	alias: 'np',
	description: 'Currently playing song',
	category: 'queue',
	execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		if (!vc) {
			e.addField('\u200b', 'You need to be in a voice channel for this!', false)
		}
		if (queueHolder.currentSong) {
			e.addField('Currently playing', queueHolder.currentSong, false);
		} else {
			e.addField('\u200b', 'Nothing is playing at the moment.', false);
		}
		message.channel.send({ embeds: [e] });
	},
};