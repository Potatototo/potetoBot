const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'stop',
	description: 'Stop playing.',
	execute(message, args, queueHolder) {
		if (!message.member.voice.channel) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You have to be in a voice channel to stop the music!', false)
				.setTimestamp();
			return message.channel.send({ embeds: [e] });
		}
		try {
			queueHolder.songs = [];
			queueHolder.subscription.player.stop();
		} catch (err) {
			console.error(err);
		}
	},
};
