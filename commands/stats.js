const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'stats',
	description: 'Show stats website.',
	category: 'utility',
	execute(message, args, queueHolder) {
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		   	.addField('Stats', 'https://stoske.eu/potetobotstats', false)
		message.channel.send({ embeds: [e] });
	},
};
