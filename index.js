const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');
const fs = require('fs');

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

// load commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
    if (command.alias != '') {
        client.commands.set(command.alias, command);
    }
}

// setup state holder with queue, volume, voice channel, text channel
const queueHolder = {
    prefix: prefix,
    textChannel: null,
    voiceChannel: null,
    connection: null,
    dispatcher: null,
    songs: [],
    playing : false,
    volume: 0.2
};

// Connection updates
client.once('ready', () => {
    console.log('Ready!');
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

// Command handling
client.on('messageCreate', async message => {
    // no prefix
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    // not a command
    if (!client.commands.has(commandName)) return;
    const command = client.commands.get(commandName);

    // command execution
	try {
        command.execute(message, args, queueHolder);   
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

client.login(token);