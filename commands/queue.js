const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'queue',
    alias: 'q',
    usage: '<page>',
	description: 'Show current queue.',
	execute(message, args, queueHolder) {
		page = 1;
		songCount = queueHolder.songs.length;
		if (args[0]) page = args[0];
		if (page < 1) page = 1;
		if (page * 10 > songCount + 10) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'Page does not exist!', false)
				.setTimestamp();
			return message.channel.send({ embeds: [e] });
		}

		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot Queue', 'https://i.imgur.com/8HzsYp9.png')

		for (let i = (page - 1) * 10; i < (page - 1) * 5 + 10; i++) {
			if (i < songCount) {
				e.addField('\u200b', i + 1 + '. ' + queueHolder.songs[i].title + ' - ' + queueHolder.songs[i].ownerChannelName, false);
			}
		}
		e.setTimestamp()
			.setFooter('Page ' + page + '/' + Math.ceil(Math.max(1, songCount / 10)));

		message.channel.send({ embeds: [e] });
	},
};