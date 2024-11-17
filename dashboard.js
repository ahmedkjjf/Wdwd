const { Client, GatewayIntentBits, Partials } = require('discord.js');
const express = require('express'); // إضافة Express

// إعداد Express
const app = express();
const PORT = process.env.PORT || 2000;

// صفحة رئيسية بسيطة
app.get('/', (req, res) => {
    res.send(`
        <body>
        <center><h1>Bot 24H ON!</h1></center>
        </body>
    `);
});

// بدء تشغيل خادم Express
app.listen(PORT, () => {
    console.log(`🌐 Server is running on port ${PORT}`);
});

// إعدادات بوت Discord
const TOKEN = 'MTMwNTkzNzYwMjkwNTUwOTk4OA.Gu2lie.m769oxNtPt8Kw2AXxIS4rByJaggpWk4Hy8sIIA';
const LOG_CHANNEL_ID = 'your_log_channel_id_here'; // معرف قناة السجلات (Logs)

// إنشاء عميل Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// عند تسجيل الدخول
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

// حدث حذف الرسالة
client.on('messageDelete', async (message) => {
    const logChannel = message.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    const embed = {
        title: '🗑️ Message Deleted',
        description: `**Message by ${message.author} was deleted in <#${message.channel.id}>**`,
        color: 0xff0000,
        fields: [
            {
                name: 'Content',
                value: message.content || 'Message had no content.',
            },
        ],
        timestamp: new Date(),
    };

    logChannel.send({ embeds: [embed] });
});

// حدث تعديل الرسالة
client.on('messageUpdate', async (oldMessage, newMessage) => {
    const logChannel = oldMessage.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    if (oldMessage.content === newMessage.content) return;

    const embed = {
        title: '✏️ Message Edited',
        description: `**Message by ${oldMessage.author} was edited in <#${oldMessage.channel.id}>**`,
        color: 0xffa500,
        fields: [
            {
                name: 'Old Content',
                value: oldMessage.content || 'Message had no content.',
            },
            {
                name: 'New Content',
                value: newMessage.content || 'Message has no content.',
            },
        ],
        timestamp: new Date(),
    };

    logChannel.send({ embeds: [embed] });
});

// حدث دخول العضو إلى الخادم
client.on('guildMemberAdd', async (member) => {
    const logChannel = member.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    const embed = {
        title: '📥 Member Joined',
        description: `**${member} joined the server.**`,
        color: 0x00ff00,
        timestamp: new Date(),
    };

    logChannel.send({ embeds: [embed] });
});

// حدث خروج العضو من الخادم
client.on('guildMemberRemove', async (member) => {
    const logChannel = member.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    const embed = {
        title: '📤 Member Left',
        description: `**${member} left the server.**`,
        color: 0xff0000,
        timestamp: new Date(),
    };

    logChannel.send({ embeds: [embed] });
});

// حدث إنشاء قناة
client.on('channelCreate', async (channel) => {
    const logChannel = channel.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    const embed = {
        title: '📂 Channel Created',
        description: `**Channel ${channel} was created.**`,
        color: 0x00ff00,
        fields: [
            {
                name: 'Type',
                value: channel.type === 0 ? 'Text' : 'Voice',
            },
        ],
        timestamp: new Date(),
    };

    logChannel.send({ embeds: [embed] });
});

// حدث حذف القناة
client.on('channelDelete', async (channel) => {
    const logChannel = channel.guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) return;

    const embed = {
        title: '🗑️ Channel Deleted',
        description: `**Channel ${channel.name} was deleted.**`,
        color: 0xff0000,
        timestamp: new Date(),
    };

    logChannel.send({ embeds: [embed] });
});

// تسجيل الدخول
client.login(TOKEN);
