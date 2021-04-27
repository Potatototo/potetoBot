module.exports = {
	name: 'join',
	description: 'Joins voice channel of sender.',
	async execute(message, args) {
		const vc = message.member.voice.channel;
		if (!vc) {
			return message.channel.send('You need to be in a voice channel for this!');
		}
		try {
			console.log(`Joining ${vc.name}`);
			var connection = await vc.join();
		} catch (err) {
			console.log(err);
		}
		
	},
};