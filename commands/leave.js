module.exports = {
	name: 'leave',
	description: 'Leaves voice channel of sender.',
	async execute(message, args) {
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