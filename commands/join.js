const { createAudioPlayer
			, entersState
			, joinVoiceChannel
			, AudioPlayerStatus
			, VoiceConnectionStatus
	} = require('@discordjs/voice')

module.exports = {
	name: 'join',
	description: 'Join your voice channel.',
	async execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			return message.channel.send('You need to be in a voice channel for this!');
		}
		try {
			console.log(`Joining ${vc.name}`);
			queueHolder.voiceChannel = vc;
			const connection = joinVoiceChannel({
				channelId: vc.id,
				guildId: vc.guild.id,
				adapterCreator: vc.guild.voiceAdapterCreator
			});
			await entersState(connection, VoiceConnectionStatus.Ready, 5000);
			player = createAudioPlayer();
			player.on('stateChange', (oldState, newState) => {
				if (newState.status === AudioPlayerStatus.Idle) {
					console.log("finish");
					this.play(queueHolder.songs.shift(), queueHolder);
				}
			});
			queueHolder.subscription = connection.subscribe(player);
		} catch (err) {
			console.log(err);
		}
	}
};
