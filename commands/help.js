const fs = require('fs')
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	execute(message, args, queueHolder) {
		let str = '';
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./${file}`);
            let line = '';
			line += `${queueHolder.prefix}${command.name}`;
            if (command.alias != undefined) {
                line += ` | ${queueHolder.prefix}${command.alias}`;
            }

            if (command.usage != undefined) {
                line += ` ${command.usage}`;
            }

            line += `\n        ${command.description}\n`;
            str += line + '\n';
		}

		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		   	.addField('List of commands', str, false)
			.setTimestamp();
		message.channel.send({ embeds: [e] });
	},
};