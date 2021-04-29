module.exports = {
	name: 'leave',
	description: 'Leave your voice channel.',
	async execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		if (!vc) {
			return message.channel.send('You need to be in a voice channel for this!');
		}
		try {
			var connection = await vc.leave();
		} catch (error) {
			console.log(err);
		}
		
	},
};