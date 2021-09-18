const { AudioPlayerStatus } = require('@discordjs/voice')
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'pause',
  description: 'Pauses or resumes the currently playing song.',
  async execute(message, args, queueHolder) {
    if (!message.member.voice.channel) {
      const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You have to be in a voice channel to pause this song!', false)
				.setTimestamp();
			return message.channel.send({ embeds: [e] });
    }
    const player = queueHolder.subscription.player;

    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
    } else {
      player.pause();
    }
  }
}
