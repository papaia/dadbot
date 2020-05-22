const {
  Client,
  Intents: {
    FLAGS: { DIRECT_MESSAGES, GUILDS, GUILD_MESSAGES },
  },
  Permissions: {
    FLAGS: { EMBED_LINKS, SEND_MESSAGES },
  },
  Util: { cleanContent },
} = require('discord.js');
const { token, ignoredGuilds } = require('../config.json');

const client = new Client({
  disableMentions: 'everyone',
  ws: { intents: [GUILDS, DIRECT_MESSAGES, GUILD_MESSAGES] },
});

client.once('ready', () => console.log(`Ready as ${client.user.tag}`));

// i be / i am / im / i'm + space
const dadRegex = /i(?:(?: a|')?m|\sbe)\s/i;

client.on('message', (message) => {
  if (message.author.bot) return null;
  if (ignoredGuilds.includes(message.guild?.id)) return null;

  let embed = true;
  if (message.guild) {
    const perms = message.channel.permissionsFor(client.user);
    embed = perms.has(EMBED_LINKS);
    if (!perms.has(SEND_MESSAGES)) return null;
  }
  const match = message.content.match(dadRegex);
  if (!match) return false;
  const reply = `Hi ${message.content.slice(match.index + match[0].length)}, I'm dad!`;
  if (reply.length > 550) return false;
  if (!message.guild) {
    return message.channel.send(reply);
  }
  if (embed) {
    return message.channel.send({ embed: { description: reply } });
  }
  return message.channel.send(cleanContent(reply, message));
});

client.login(token);
