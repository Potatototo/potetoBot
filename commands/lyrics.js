const {
	prefix,
	token,
    ytkey,
	geniuskey,
} = require('../config.json');
const { MessageEmbed } = require('discord.js');
const Genius = require("genius-lyrics");
const Client = new Genius.Client(geniuskey);

module.exports = {
	name: 'lyrics',
    alias: 'l',
	description: 'Print the lyrics of current song!',
	category: 'utility',
	async execute(message, args, queueHolder) {
        const vc = message.member.voice.channel;
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		if (!vc) {
			e.addField('\u200b', 'You need to be in a voice channel for this!', false);
            return message.channel.send({ embeds: [e] });
		}
        try {
            if (queueHolder.currentSong) {
                songTitle = `${queueHolder.currentSong.title} - ${queueHolder.currentSong.ownerChannelName}`;
                const searchQuery = queueHolder.currentSong.title.replace(/\(.*\)/, '');
                console.log(searchQuery);
                const searches = await Client.songs.search(searchQuery);
                const topResult = searches[0];
                const lyrics = await topResult.lyrics();

                const l = new MessageEmbed()
                    .setColor('#E6722E')
                    .setAuthor(`${topResult.title} - ${topResult.artist.name}`, topResult.thumbnail)
                    .addField('\u200b', lyrics.substring(0, 1024));
                if (lyrics.length > 1024) l.addField('\u200b', lyrics.substring(1024, 2048));
                if (lyrics.length > 2048) l.addField('\u200b', lyrics.substring(2048, 3072));
                message.channel.send({ embeds: [l] });
            } else {
                e.addField('\u200b', 'Nothing is playing at the moment.', false);
                message.channel.send({ embeds: [e] });
            }
        } catch (err) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', `Oh no something went wrong :(\n${err}`, false);
			message.channel.send({ embeds: [e] });
			console.error(err);
		}
    },
};