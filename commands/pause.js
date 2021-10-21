const { AudioPlayerStatus } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pause',
    alias: 't',
    description: 'Pauses or resumes the currently playing song.',
    category: 'music',
    async execute(message, args, queueHolder) {
        if (!message.member.voice.channel) {
            const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		        .addField('Error', 'You have to be in a voice channel to pause this song!', false);
			return message.channel.send({ embeds: [e] });
        }
        const player = queueHolder.subscription.player;

        const e = new MessageEmbed()
            .setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png');
        if (player.state.status === AudioPlayerStatus.Paused) {
            player.unpause();
            e.addField('Unpausing', `${queueHolder.currentSong.title} - ${queueHolder.currentSong.ownerChannelName}`, false);
        } else {
            player.pause();
            e.addField('Pausing', `${queueHolder.currentSong.title} - ${queueHolder.currentSong.ownerChannelName}`, false);
        }
		message.channel.send({ embeds: [e] });
    }
}
