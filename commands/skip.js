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
			const query = {
				title: songInfo.videoDetails.title,
				artist: songInfo.videoDetails.ownerChannelName
			};
			const findResult = await collection.findOne(query);

			// update with new play count
			const dbSong = {
				title: songInfo.videoDetails.title,
				artist: songInfo.videoDetails.ownerChannelName,
				playCount: findResult == null ? 1 : findResult.playCount,
				skipCount: findResult == null ? 0 :findResult.skipCount + 1,
				songLength: songInfo.videoDetails.lengthSeconds
			}
			const options = { upsert: true };

			const dbResult = await collection.replaceOne(query, dbSong, options);
		} finally {
			queueHolder.mongoClient.close();
		}
	},
};
