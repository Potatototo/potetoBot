module.exports = {
	name: 'leave',
	description: 'Leave your voice channel.',
	category: 'utility',
	async execute(message, args, queueHolder) {
		try {
			await queueHolder.subscription.connection.destroy();
		} catch (err) {
			console.log(err);
		}

	},
};
