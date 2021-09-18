const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'remove',
	alias: 'r',
	usage: '<index>',
	description: 'Remove song from queue.',
	async execute(message, args, queueHolder) {
		if (!args[0]) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'Please specify a queue position!', false)
				.setTimestamp();
			return message.channel.send({ embeds: [e] });
		}

		const pos = parseInt(args[0]);
		if (isNaN(pos) || pos < 1 || pos > queueHolder.songs.length) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'Invalid queue position!', false)
				.setTimestamp();
			return message.channel.send({ embeds: [e] });
		}

		const removed = queueHolder.songs.splice(pos - 1, 1);
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    .addField('Removed from Queue', removed[0].title + ' - ' + removed[0].ownerChannelName, false)
			.setTimestamp();
		message.channel.send({ embeds: [e] });
	}
};
