exports.run = async (Discord, client, message, args) => {

if(message.author.id !== '261985077083242501') return message.channel.send("You don't meet the permissions required for this command: `This command is reserved for the bot developers.`")

    try {
        delete require.cache[require.resolve(`./${args[0]}.js`)];
    } catch (e) {
        return message.channel.send(`Unable to reload: ${args[0]}.js`);
    }
    message.channel.send(`**Successfully reloaded:** ${args[0]}.js`);
}