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
			queueHolder.textChannel = message.textChannel;
			queueHolder.voiceChannel = vc;
			queueHolder.connection = await vc.join();
		} catch (err) {
			console.log(err);
		}
		
	},
};