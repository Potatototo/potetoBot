module.exports = {
	name: 'ping',
	description: 'Pong!',
	category: 'utility',
	execute(message, args, queueHolder) {
		message.channel.send("Pinging...").then(m =>{
            ping = m.createdTimestamp - message.createdTimestamp;
			message.channel.send(`Message Round-Trip: ${ping}ms`);
		});
		message.channel.send(`Ping: ${queueHolder.client.ws.ping}ms`);
	},
};