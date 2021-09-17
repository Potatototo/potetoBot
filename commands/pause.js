const { AudioPlayerStatus } = require('@discordjs/voice')

module.exports = {
  name: 'pause',
  description: 'Pauses or resumes the currently playing song.',
  async execute(message, args, queueHolder) {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to pause this song!');

    const player = queueHolder.subscription.player;

    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
    } else {
      player.pause();
    }
  }
}
