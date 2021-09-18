const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'volume',
    alias: 'v',
    usage: '<volume>',
	description: 'Set the volume from 0-100.',
	execute(message, args, queueHolder) {
		const volume = args[0] / 100;
		queueHolder.dispatcher.setVolumeLogarithmic(volume);
		queueHolder.volume = volume;
		console.log(`Set volume to ${volume}`);
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		  	.addField('Volume', `Set to ${args[0]}!`, false)
			.setTimestamp();
		message.channel.send({ embeds: [e] });
	},
};