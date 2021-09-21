const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'skip',
	alias: 's',
	description: 'Skip current song.',
	category: 'music',
	execute(message, args, queueHolder) {
		if (!message.member.voice.channel) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You have to be in a voice channel to skip this song!', false);
				
			return message.channel.send({ embeds: [e] });
		}
		try {
			if (queueHolder.currentSong) {
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    		.addField('Skip', `${queueHolder.currentSong.title} - ${queueHolder.currentSong.ownerChannelName}`, false);
				message.channel.send({ embeds: [e] });
				queueHolder.subscription.player.stop();
			} else {
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    		.addField('Error', 'There\'s nothing to skip!', false);
				message.channel.send({ embeds: [e] });
			}
		} catch (err) {
			console.error(err);
		}
	},
};
