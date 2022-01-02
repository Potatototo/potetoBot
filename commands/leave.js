module.exports = {
	name: 'leave',
	alias: 'l',
	description: 'Leave your voice channel.',
	category: 'utility',
	async execute(message, args, queueHolder) {
		try {
			queueHolder.client.user.setActivity('Basti Songs', { type: 'PLAYING' });
			await queueHolder.subscription.connection.destroy();
			queueHolder.textChannel = null;
    		queueHolder.subscription = null;
    		queueHolder.songs = [];
    		queueHolder.currentSong = null;
		} catch (err) {
			console.log(err);
		}

	},
};
