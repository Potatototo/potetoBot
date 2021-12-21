const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'skip',
	alias: 's',
	description: 'Skip current song.',
	category: 'music',
	execute(message, args, queueHolder) {
		if (!message.member.voice.channel) {
			const e = new MessageEmbed()
				.setColor('#E6722E')
				.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    	.addField('Error', 'You have to be in a voice channel to skip this song!', false);
				
			return message.channel.send({ embeds: [e] });
		}
		try {
			if (queueHolder.currentSong) {
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    		.addField('Skip', `${queueHolder.currentSong.title} - ${queueHolder.currentSong.ownerChannelName}`, false);
				message.channel.send({ embeds: [e] });
				
				this.dbLog(queueHolder.currentSong, queueHolder);
				queueHolder.subscription.player.stop();
			} else {
				const e = new MessageEmbed()
					.setColor('#E6722E')
					.setAuthor('potetoBot', 'https://i.imgur.com/8HzsYp9.png')
		    		.addField('Error', 'There\'s nothing to skip!', false);
				message.channel.send({ embeds: [e] });
			}
		} catch (err) {
			console.error(err);
		}
	},
	async dbLog(songInfo, queueHolder) {
		try {
			// log play in DB
			await queueHolder.mongoClient.connect();
			const collection = queueHolder.mongoClient.db("potetobot").collection("stats");
			
			// get existing DB entry
			const query = {	title: songInfo.title,
							artist: songInfo.ownerChannelName}
			const playQueryResult = await collection.distinct("playCount", query)
			const playCount = playQueryResult.length == 0 ? 0 : playQueryResult[0]
			const skipQueryResult = await collection.distinct("skipCount", query)
			const skipCount = skipQueryResult.length == 0 ? 0 : skipQueryResult[0]

			// update with new play count
			const dbSong = {
				title: songInfo.title,
				artist: songInfo.ownerChannelName,
				playCount: playCount,
				skipCount: skipCount + 1,
				songLength: songInfo.lengthSeconds
			}
			const options = { upsert: true };

			const dbResult = await collection.replaceOne(query, dbSong, options);
		} finally {
			queueHolder.mongoClient.close();
		}
	},
};
