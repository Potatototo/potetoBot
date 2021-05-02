module.exports = {
	name: 'volume',
    alias: 'v',
    usage: '<volume>',
	description: 'Set the volume from 0-100.',
	execute(message, args, queueHolder) {
		const volume = args[0] / 100;
		queueHolder.dispatcher.setVolumeLogarithmic(volume);
		queueHolder.volume = volume;
		console.log(`Set volume to ${volume}`);
		message.channel.send(`Set volume to ${args[0]}!`);
	},
};