const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'volume',
    alias: 'v',
    usage: '<0-100>',
	description: 'Set volume.',
	category: 'music',
	execute(message, args, queueHolder) {
		const volume = args[0] / 100;
		queueHolder.dispatcher.setVolumeLogarithmic(volume);
		queueHolder.volume = volume;
		console.log(`Set volume to ${volume}`);
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		  	.addField('Volume', `Set to ${args[0]}!`, false);
		message.channel.send({ embeds: [e] });
	},
};