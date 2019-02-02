const Discord = require('discord.js');
const client = new Discord.Client();
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

client.db = new Enmap({provider: new EnmapLevel({name: 'support'})});

client.on("ready", () => {
    console.log(`[READY] ${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`); 
});

client.on('message', async message => {
    let prefix = "-";
    if(message.author.bot) return;

    if(message.channel.type !== 'text') {
        let active = await client.db.get(`support_${message.author.id}`);
        let guild = client.guilds.get('537969469880926210');
        let channel, found = true;

        try {
            if(active) client.channels.get(active.channelID).guild;
        } catch(e) {
            found = false;
        }

        if(!active || !found) {
            active = {};
            channel = await guild.channels.create(`${message.author.username}-${message.author.discriminator}`, {
                parent: '539828801383694346',
                topic: `!complete to close this ticket | Support for ${message.author.tag} | ID: ${message.author.id}`
            });
            let author = message.author;
            const newChannel = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(author.tag, author.displayAvatarURL())
            .setFooter('Support Ticket Created')
            .addField('User', author)
            .addField('ID', author.id)
            await channel.send(newChannel);

            const newTicket = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(`Hello, ${author.tag}`, author.displayAvatarURL())
            .setDescription('Please tell us your problem in full detail. If your problem is related to BloxMe, please give more detailed explanation of what is happening.')
            .setFooter('Support Ticket Created!')
            await author.send(newTicket);

            active.channelID = channel.id;
            active.targetID = author.id;
        }
        channel = client.channels.get(active.channelID);
        const dm = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`Thank you, ${message.author.tag}`, message.author.displayAvatarURL())
        .setFooter(`Your message has been sent - A staff member will contact you soon.`)
        await message.author.send(dm)

        const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setDescription(message.content)
        .setFooter(`Message Recieved - ${message.author.tag}`)
        await channel.send(embed);

        client.db.set(`support_${message.author.id}`, active)
        client.db.set(`supportChannel_${channel.id}`, message.author.id);
        return;
    }
    let support = await client.db.get(`supportChannel_${message.channel.id}`);
    if (support) {
        support = await client.db.get(`support_${support}`)
        
        let supportUser = client.users.get(support.targetID);
        if(!supportUser) return message.channel.delete();

        if(message.content.toLowerCase() === prefix + 'complete') {
            const complete = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setAuthor(`Hey, ${supportUser.tag}`, supportUser.displayAvatarURL())
            .setFooter('Ticket Closed ✓ BloxMe Support')
            .setDescription('*Your ticket has been marked as complete. If you wish to reopen it, or create a new one, please send a message to the bot.*')
            supportUser.send(complete);

            message.channel.delete();

            client.db.delete(`support_${support.targetID}`);


        }
        const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setFooter(`Message Recieved - BloxMe Support`)
        .setDescription(message.content)
        client.users.get(support.targetID).send(embed);

        message.delete({timeout: 1000});

        embed.setFooter(`Message Sent - ${supportUser.tag}`).setDescription(message.content);
        return message.channel.send(embed)

    }
    






    let msg = message.content.toLowerCase();
    let args = message.content.slice(prefix.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();




    if (!message.content.startsWith(prefix)) return;

    try {
        let commandFile = require(`./commands/${cmd}.js`);
 
        commandFile.run(Discord, client, message, args);   
        
     } catch(e) {
console.log(e)
     }
}
)

client.login("NTM5ODI0MTE3OTg2MjMwMjcy.Dza2zg.O_HJStDukZXoydzxCTu_usk398E")