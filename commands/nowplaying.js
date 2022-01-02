const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'nowplaying',
	alias: 'np',
	description: 'Currently playing song',
	category: 'queue',
	execute(message, args, queueHolder) {
		const vc = message.member.voice.channel;
		const e = new MessageEmbed()
			.setColor('#E6722E')
			.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		if (!vc) {
			e.addField('\u200b', 'You need to be in a voice channel for this!', false);
			return message.channel.send({ embeds: [e] });
		}
		if (queueHolder.currentSong) {
			songTitle = `${queueHolder.currentSong.title} - ${queueHolder.currentSong.ownerChannelName}`;
			songLength = parseInt(queueHolder.currentSong.lengthSeconds)
			pbDuration = ~~(queueHolder.subscription.player.state.playbackDuration / 1000);
			durationString = generateDurationDisplay(songTitle, songLength, pbDuration)

			e.addField('Currently playing', songTitle + "\n" + durationString, false);
		} else {
			e.addField('\u200b', 'Nothing is playing at the moment.', false);
		}
		message.channel.send({ embeds: [e] });
	},
};

function fancyTimeFormat(duration) {   
    // Output like "1:01" or "4:03:59" or "123:03:59"
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function generateDurationDisplay(songTitle, songLength, pbDuration) {
	const barCount = 25
	durationString = `${fancyTimeFormat(pbDuration)}\/${fancyTimeFormat(songLength)}`
	const filled = ~~(pbDuration / songLength * barCount)
	let bars = ""
	for (let i = 0; i < barCount; i++) {
		bars += i < filled ? "█" : "░"
	}
	return `${bars} ${durationString}`
}