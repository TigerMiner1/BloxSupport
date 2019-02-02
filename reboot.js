exports.run = async (Discord, client, message, args) => {
  if(message.author.id !== '261985077083242501') return message.channel.send("You don't meet the permissions required for this command: `This command is reserved for the bot developers.`")
    var embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(0X2355CF)
    .setDescription('Bot is Restarting...');
    await message.channel.send({ embed })
    process.exit(1);
  }