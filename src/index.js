const {
  Client,
  Permissions: {
    FLAGS: { EMBED_LINKS, SEND_MESSAGES },
  },
  Util: { cleanContent },
} = require('discord.js');
const { token, ignore } = require('../config.json');

const client = new Client({ disableMentions: 'everyone' });

client.once('ready', () => console.log(`Ready as ${client.user.tag}`));

// i am / im / i'm
const dadRegex = /i(?: a|')?m\s/i;

client.on('message', (message) => {
  if (message.author.bot) return null;
  if (ignore.includes(message.guild?.id)) return null;

  let embed = true;
  if (message.guild) {
    const perms = message.channel.permissionsFor(client.user);
    embed = perms.has(EMBED_LINKS);
    if (!perms.has(SEND_MESSAGES)) return null;
  }
  const match = message.content.match(dadRegex);
  if (!match) return false;
  const send = `Hi ${message.content.slice(match.index + match[0].length)}, I'm dad!`;
  if (send.length > 550) return false;
  if (!message.guild) {
    return message.channel.send(send);
  }
  if (embed) {
    return message.channel.send({ embed: { description: send } });
  }
  return message.channel.send(cleanContent(send, message));
});

client.login(token);
