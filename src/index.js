const {
  Client,
  Intents: {
    FLAGS: { DIRECT_MESSAGES, GUILDS, GUILD_MESSAGES },
  },
  Permissions: {
    FLAGS: { EMBED_LINKS, SEND_MESSAGES },
  },
} = require('discord.js');
const { token } = require('../config.json');

const client = new Client({
  disableMentions: 'everyone',
  messageCacheMaxSize: 0,
  ws: { intents: [DIRECT_MESSAGES, GUILDS, GUILD_MESSAGES] },
});

client.once('ready', () => console.log(`Ready as ${client.user.tag}`));

// i be / i am / im / i'm + space(s)
const dadRegex = /\bi(?:(?:\s*a|')?m|\s*be)\s*(?=\S)/i;

client.on('message', (message) => {
  if (message.author.bot) return null;

  if (message.guild) {
    const perms = message.channel.permissionsFor(client.user);
    if (!perms.has(SEND_MESSAGES | EMBED_LINKS)) return null;
  }

  const match = message.content.match(dadRegex);
  if (!match) return false;

  const name = message.content.slice(match.index + match[0].length).trim();
  if (!name || name.length > 550) return false;

  const reply = `Hi ${name}, I'm dad!`;
  if (!message.guild) {
    return message.channel.send(reply);
  }

  return message.channel.send({ embed: { description: reply } });
});

client.login(token);
