const fs = require('fs')
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	category: 'utility',
	execute(message, args, queueHolder) {
		let m = '';
		let q = '';
		let u = '';
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
            line += ` - ${command.description}`;

			if (command.category == 'music') m += line + '\n';
            else if (command.category == 'queue') q += line + '\n';
			else if (command.category == 'utility') u += line + '\n';
		}

		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		   	.addField('Music', m, false)
			.addField('Queue', q, false)
			.addField('Utility', u, false);
		message.channel.send({ embeds: [e] });
	},
};