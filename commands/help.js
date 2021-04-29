const fs = require('fs')

module.exports = {
	name: 'help',
	description: 'List all available commands.',
	execute(message, args, queueHolder) {
		let str = 'List of commands:\n';
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
            str += line;
		}

		message.channel.send(str);
	},
};