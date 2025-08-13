// SKIDDERS LODE PE

process.stdout.write('\x1Bc');

const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, Partials, REST, Routes, Events, Collection, SlashCommandBuilder } = require('discord.js');
const { createWorker } = require('tesseract.js');
const axios = require('axios');
const express = require('express');
const fs = require('fs');
const chalk = require('chalk');

const config = {
    token: "YOUR_BOT_TOKEN",
    client: "YOUR_BOT_ID",
    ownids: ["YOUR_ID"],
    
    channel_name: "@your_channel_name",
    channel_url: "https://youtube.com/@your_channel",
    role_id: "VERIFICATION_ROLE_ID",
    remove_role_id: "REMOVE_ROLE_ID",
    verification_channel_id: "VERIFICATION_CHANNEL_ID",
    logs_channel_id: "LOGS_CHANNEL_ID",
    
    remove_channel_access: true,  // false if don't want to remove role after verification
    
    emojis: {
        processing: "⏳",
        success: "✅",  // you can use custom emojis if want to
        failed: "❌"
    }
};

const subscriptionKeywords = {
    en: ["subscribed", "unsubscribe", "subscription", "notifications", "bell", "manage subscription", "your subscriptions"],
    es: ["suscrito", "desuscribirse", "suscripción", "notificaciones", "campana", "gestionar suscripción", "tus suscripciones"],
    fr: ["abonné", "se désabonner", "abonnement", "notifications", "cloche", "gérer l'abonnement", "vos abonnements"],
    de: ["abonniert", "abonnement kündigen", "abonnement", "benachrichtigungen", "glocke", "abonnement verwalten", "ihre abonnements"],
    pt: ["inscrito", "cancelar inscrição", "inscrição", "notificações", "sino", "gerenciar inscrição", "suas inscrições"],
    it: ["iscritto", "annulla iscrizione", "iscrizione", "notifiche", "campana", "gestisci iscrizione", "le tue iscrizioni"],
    ru: ["подписан", "отписаться", "подписка", "уведомления", "колокольчик", "управлять подпиской", "ваши подписки"],
    ja: ["登録済み", "登録解除", "チャンネル登録", "通知", "ベル", "登録チャンネルを管理", "登録チャンネル"],
    ko: ["구독중", "구독취소", "구독", "알림", "벨", "구독 관리", "구독한 채널"],
    zh: ["已订阅", "取消订阅", "订阅", "通知", "铃铛", "管理订阅", "您的订阅"],
    ar: ["مشترك", "إلغاء الاشتراك", "اشتراك", "إشعارات", "جرس", "إدارة الاشتراك", "اشتراكاتك"],
    hi: ["सब्सक्राइब किया गया", "अनसब्सक्राइब करें", "सब्सक्रिप्शन", "नोटिफिकेशन", "घंटी", "सब्सक्रिप्शन प्रबंधित करें", "आपकी सब्सक्रिप्शन"],
    nl: ["geabonneerd", "abonnement opzeggen", "abonnement", "meldingen", "bel", "abonnement beheren", "je abonnementen"],
    tr: ["abone olundu", "aboneliği iptal et", "abonelik", "bildirimler", "zil", "aboneliği yönet", "abonelikleriniz"],
    pl: ["zasubskrybowano", "anuluj subskrypcję", "subskrypcja", "powiadomienia", "dzwonek", "zarządzaj subskrypcją", "twoje subskrypcje"],
    sv: ["prenumererar", "avsluta prenumeration", "prenumeration", "aviseringar", "klocka", "hantera prenumeration", "dina prenumerationer"],
    no: ["abonnerer", "avslutt abonnement", "abonnement", "varsler", "bjelle", "administrer abonnement", "dine abonnementer"]
};

const nonSubscriptionKeywords = {
    en: ["subscribe", "join", "click subscribe", "subscribe now", "hit subscribe", "subscribe button"],
    es: ["suscribirse", "unirse", "haga clic en suscribirse", "suscríbete ahora", "presiona suscribirse", "botón de suscripción"],
    fr: ["s'abonner", "rejoindre", "cliquez sur s'abonner", "abonnez-vous maintenant", "appuyez sur s'abonner", "bouton s'abonner"],
    de: ["abonnieren", "beitreten", "auf abonnieren klicken", "jetzt abonnieren", "abonnieren drücken", "abonnieren-taste"],
    pt: ["inscrever-se", "participar", "clique em inscrever-se", "inscreva-se agora", "aperte inscrever-se", "botão de inscrição"],
    it: ["iscriversi", "unisciti", "clicca iscriviti", "iscriviti ora", "premi iscriviti", "pulsante iscriviti"],
    ru: ["подписаться", "присоединиться", "нажмите подписаться", "подпишись сейчас", "нажми подписаться", "кнопка подписки"],
    ja: ["チャンネル登録", "参加", "登録をクリック", "今すぐ登録", "登録を押す", "登録ボタン"],
    ko: ["구독", "가입", "구독 클릭", "지금 구독", "구독 누르기", "구독 버튼"],
    zh: ["订阅", "加入", "点击订阅", "立即订阅", "按订阅", "订阅按钮"],
    ar: ["اشتراك", "انضمام", "انقر على اشتراك", "اشترك الآن", "اضغط اشتراك", "زر الاشتراك"],
    hi: ["सब्सक्राइब करें", "शामिल हों", "सब्सक्राइब पर क्लिक करें", "अभी सब्सक्राइब करें", "सब्सक्राइब दबाएं", "सब्सक्राइब बटन"],
    nl: ["abonneren", "lid worden", "klik op abonneren", "abonneer nu", "druk op abonneren", "abonneerknop"],
    tr: ["abone ol", "katıl", "abone ol'a tıklayın", "şimdi abone ol", "abone ol'a basın", "abone ol düğmesi"],
    pl: ["subskrybuj", "dołącz", "kliknij subskrybuj", "subskrybuj teraz", "naciśnij subskrybuj", "przycisk subskrypcji"],
    sv: ["prenumerera", "gå med", "klicka på prenumerera", "prenumerera nu", "tryck prenumerera", "prenumerera-knappen"],
    no: ["abonner", "bli med", "klikk på abonner", "abonner nå", "trykk abonner", "abonner-knappen"]
};

const eyeZFrames = [
  [
    '⣀⣀⡀⡀⢀⠀⠀⠀⠤⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠠⠤⠄⣐⣀⣀⣀⣀⣠⣤⣤⣤⣤⠄',
    '⠈⢻⣿⣟⠛⠛⠛⠛⠛⠓⠒⣶⣦⣬⣭⣃⣒⠒⠤⢤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⢒⣚⣫⣭⣧⣶⣶⣿⣿⡛⠉⠉⠉⠉⠉⠉⣽⣿⠟⠁⠀',
    '⠀⠀⠙⢿⡄⠀⠀⠀⠀⠀⣼⣿⣿⣿⣿⣧⠉⠛⠻⢷⣬⡙⠣⡄⠀⠀⠀⠀⠀⠀⠀⡠⠚⣡⡾⠟⠋⠁⠀⣾⡿⠉⣿⣷⣶⠀⠀⠀⠀⠀⣰⠟⠁⠀⠀⠀',
    '⠀⠀⠀⠀⠻⣄⠀⠀⠀⠀⣿⣿⠀⣿⣿⣿⠀⠀⠀⠀⠈⠑⢄⠀⠀⠀⠀⠀⠀⠀⠀⢀⠔⠁⠀⠀⠀⠀⠀⢿⣿⣏⣀⣾⣿⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠈⠀⢛⣷⣤⣄⣀⣙⣿⣿⣿⣿⡃⠀⠀⠀⠀⠀⠀⡀⠀⠀⡀⠀⠀⠀⡠⠀⠀⠀⠀⠀⠀⠀⠄⠠⠈⠿⠿⠿⠿⠥⠤⠶⠶⠿⠁⠀⠀⠀⠀⠀⠀',
    '⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠁⠀⠀⠃⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀'
  ]
];

let frameIndex = 0;

function colorText(text, colorCode) {
  return `\x1b[${colorCode}m${text}\x1b[0m`;
}

function printFrame(frame, index) {
  for (let i = 0; i < frame.length; i++) {
    const line = frame[i];
    const colorCode = ((index + i) % 2 === 0) ? 97 : 90;
    console.log(colorText(line, colorCode));
  }
}

function startAnimation() {
  const interval = setInterval(() => {
    process.stdout.write('\x1Bc');
    printFrame(eyeZFrames[frameIndex % eyeZFrames.length], frameIndex);
    frameIndex++;
  }, 500);
  return interval;
}

const animationInterval = startAnimation();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel]
});

client.commands = new Collection();

const supportCommand = new SlashCommandBuilder()
    .setName('support')
    .setDescription('Send a support message to the bot owners')
    .addStringOption(option =>
        option.setName('message')
            .setDescription('Your support message')
            .setRequired(true)
    );

        client.commands.set('support', {
    data: supportCommand,
    async execute(interaction) {
        const message = interaction.options.getString('message');
        
        const supportEmbed = new EmbedBuilder()
            .setTitle('🆘 New Support Request')
            .setDescription(`**User:** ${interaction.user.username} (${interaction.user.id})`)
            .addFields(
                { name: '📝 Message', value: message, inline: false },
                { name: '🌐 Server', value: interaction.guild ? interaction.guild.name : 'DM', inline: true },
                { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setColor('#FF6B6B')
            .setTimestamp()
            .setFooter({ text: 'Support Request' });

        for (const ownerId of config.ownids) {
            try {
                await client.users.send(ownerId, { embeds: [supportEmbed] });
            } catch (error) {
                console.log(`Failed to send support message to owner ${ownerId}`);
            }
        }

        const confirmEmbed = new EmbedBuilder()
            .setTitle('✅ Support Request Sent')
            .setDescription('Your support request has been sent to the bot owners. They will get back to you soon!')
            .setColor('#4CAF50')
            .setTimestamp();

        await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
    }
});

async function loadCommands() {
}

async function removeChannelAccess(member, channel) {
    try {
        const removeRole = member.guild.roles.cache.get(config.remove_role_id);
        if (removeRole && member.roles.cache.has(config.remove_role_id)) {
            await member.roles.remove(removeRole);
        }
        return true;
    } catch (error) {
        return false;
    }
}

async function extractTextFromImage(imageBuffer) {
    try {
        const worker = await createWorker(['eng', 'spa', 'fra', 'deu', 'por', 'ita', 'rus', 'jpn', 'kor', 'chi_sim', 'ara', 'hin', 'nld', 'tur', 'pol', 'swe', 'nor']);
        await worker.setParameters({
            tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*()_+-=[]{}|;:,.<>?/ àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ',
            tessedit_pageseg_mode: '6',
        });
        const { data: { text } } = await worker.recognize(imageBuffer);
        await worker.terminate();
        return text;
    } catch (error) {
        throw new Error('Failed to process image');
    }
}

function isYouTubeSubscribed(text, channelName) {
    const lowerText = text.toLowerCase();
    const lowerChannelName = channelName.toLowerCase();
    const channelNameClean = lowerChannelName.replace('@', '');
    
    const hasChannelName = lowerText.includes(lowerChannelName) || lowerText.includes(channelNameClean);
    if (!hasChannelName) {
        return false;
    }
    
    let hasSubscriptionProof = false;
    let hasNonSubscriptionProof = false;
    
    for (const lang in subscriptionKeywords) {
        const keywords = subscriptionKeywords[lang];
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                hasSubscriptionProof = true;
                break;
            }
        }
        if (hasSubscriptionProof) break;
    }
    
    for (const lang in nonSubscriptionKeywords) {
        const keywords = nonSubscriptionKeywords[lang];
        for (const keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                hasNonSubscriptionProof = true;
                break;
            }
        }
        if (hasNonSubscriptionProof) break;
    }
    
    if (hasNonSubscriptionProof && !hasSubscriptionProof) {
        return false;
    }
    
    if (hasSubscriptionProof) {
        return true;
    }
    
    const subscriptionPageContext = [
        'home', 'subscriptions', 'library', 'history',
        'inicio', 'suscripciones', 'biblioteca', 'historial',
        'accueil', 'abonnements', 'bibliothèque', 'historique',
        'startseite', 'abonnements', 'mediathek', 'verlauf',
        'página inicial', 'inscrições', 'biblioteca', 'histórico',
        'главная', 'подписки', 'библиотека', 'история',
        'ホーム', '登録チャンネル', 'ライブラリ', '履歴',
        '홈', '구독', '보관함', '시청기록',
        '首页', '订阅内容', '媒体库', '历史记录'
    ];
    
    const isOnSubscriptionPage = subscriptionPageContext.some(context =>
        lowerText.includes(context.toLowerCase())
    );
    
    if (isOnSubscriptionPage && hasChannelName) {
        return true;
    }
    
    return false;
}

async function sendLogMessage(type, user, reason = null) {
    try {
        const logsChannel = client.channels.cache.get(config.logs_channel_id);
        if (!logsChannel) return;

        let embed;
        
        if (type === 'success') {
            embed = new EmbedBuilder()
                .setTitle('✅ Verification Successful')
                .setDescription(`**${user.username}** has been successfully verified!`)
                .addFields(
                    { name: '👤 User', value: `${user.username} (${user.id})`, inline: true },
                    { name: '📺 Channel', value: `[${config.channel_name}](${config.channel_url})`, inline: true },
                    { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setThumbnail(user.displayAvatarURL())
                .setColor('#4CAF50')
                .setTimestamp();
        } else if (type === 'failed') {
            embed = new EmbedBuilder()
                .setTitle('❌ Verification Failed')
                .setDescription(`**${user.username}** failed verification`)
                .addFields(
                    { name: '👤 User', value: `${user.username} (${user.id})`, inline: true },
                    { name: '📺 Channel', value: `[${config.channel_name}](${config.channel_url})`, inline: true },
                    { name: '⏰ Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setThumbnail(user.displayAvatarURL())
                .setColor('#F44336')
                .setTimestamp();
                
            if (reason) {
                embed.addFields({ name: '📝 Reason', value: reason, inline: false });
            }
        }

        await logsChannel.send({ embeds: [embed] });
    } catch (error) {
        console.log('Failed to send log message:', error.message);
    }
}

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Cheques Bot is running!',
        features: ['Multi-Language YouTube Verification'],
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/status', (req, res) => {
    res.status(200).json({
        bot_status: client.user ? 'Online' : 'Offline',
        guilds: client.guilds.cache.size,
        users: client.users.cache.size,
        ping: client.ws.ping,
        features: {
            multilanguage_verification: true,
            support_system: true,
            logging: true
        }
    });
});

app.listen()

client.once('ready', async () => {
    clearInterval(animationInterval);
    
    console.log(chalk.grey('　　[+]'), chalk.white(client.user.username), chalk.white('—'), chalk.red('Rised'));
    
    try {
        const ownerNames = [];
        for (const ownerId of config.ownids) {
            try {
                const owner = await client.users.fetch(ownerId);
                ownerNames.push(owner.username);
            } catch (e) {
                ownerNames.push('Unknown');
            }
        }
        
        if (ownerNames.length === 1) {
            console.log(chalk.grey('　　[+]'), chalk.white('Owner —'), chalk.red(ownerNames[0]));
        } else if (ownerNames.length > 1) {
            console.log(chalk.grey('　　[+]'), chalk.white('Owners —'), chalk.red(ownerNames.join(', ')));
        }
    } catch (e) {
    }
    
    client.user.setPresence({
        activities: [{ name: 'Cheques | dsc.gg/tejv', type: 3 }],
        status: 'online'
    });

    await loadCommands();
    
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        const commands = [supportCommand.toJSON()];
        await rest.put(Routes.applicationCommands(config.client), { body: commands });
        console.log(chalk.green('　　[+]'), chalk.white('Commads —'), chalk.red('Loaded'));
    } catch (e) {
        console.log(chalk.red('　　[!]'), chalk.white('Failed to register commands'));
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.log('Command execution error:', error.message);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: 'There was an error executing this command!',
                        flags: 64
                    });
                }
            }
        }
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const content = message.content.trim();
    
    if (content === '>support') {
        message.reply('**Join Our Discord Server Now!!**\nhttps://discord.gg/PYfeSaDGPJ');
        return;
    }
    
    if (message.channel.id !== config.verification_channel_id) return;
    
    if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        
        if (attachment.contentType && attachment.contentType.startsWith('image/')) {
            try {
                const role = message.guild.roles.cache.get(config.role_id);
                if (!role) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('⚠️ Configuration Error')
                        .setDescription('Verification role not found. Please contact an administrator.')
                        .setTimestamp()
                        .setFooter({ text: 'Error Code: ROLE_NOT_FOUND' });
                    
                    await message.reply({ embeds: [errorEmbed] });
                    return;
                }

                if (message.member.roles.cache.has(config.role_id)) {
                    try {
                        await message.delete();
                    } catch (deleteError) {}
                    
                    const alreadyVerifiedEmbed = new EmbedBuilder()
                        .setColor(0x00FF00)
                        .setTitle('✅ Already Verified')
                        .setDescription(`${message.author}, you are already verified with the **${role.name}** role!`)
                        .addFields(
                            { name: '🎯 Status', value: 'Already subscribed and verified', inline: true },
                            { name: '🎭 Role', value: role.name, inline: true },
                            { name: '💡 Note', value: 'No need to send verification screenshots anymore!', inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Thanks for being a subscriber!' });
                    
                    const sentMessage = await message.channel.send({ embeds: [alreadyVerifiedEmbed] });
                    
                    setTimeout(async () => {
                        try {
                            await sentMessage.delete();
                        } catch (error) {}
                    }, 1600);
                    
                    return;
                }

                await message.react(config.emojis.processing);
                
                const response = await axios.get(attachment.url, { 
                    responseType: 'arraybuffer',
                    timeout: 2800
                });
                const imageBuffer = Buffer.from(response.data);
                
                const extractedText = await extractTextFromImage(imageBuffer);
 
                if (isYouTubeSubscribed(extractedText, config.channel_name)) {
                    if (!message.guild.members.me.permissions.has('MANAGE_ROLES')) {
                        const permissionEmbed = new EmbedBuilder()
                            .setColor(0xFF6B00)
                            .setTitle('⚠️ Bot Missing Permissions')
                            .setDescription('I don\'t have permission to manage roles!')
                            .addFields(
                                { name: '🔧 Required Permission', value: 'Manage Roles', inline: true },
                                { name: '👤 Contact', value: 'Ask an administrator to give me "Manage Roles" permission', inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'Permission Error' });
                        
                        await message.reply({ embeds: [permissionEmbed] });
                        await sendLogMessage('failed', message.author, 'Bot missing permissions');
                        return;
                    }

                    if (message.guild.members.me.roles.highest.position <= role.position) {
                        const hierarchyEmbed = new EmbedBuilder()
                            .setColor(0xFF6B00)
                            .setTitle('⚠️ Role Hierarchy Issue')
                            .setDescription('My role is not high enough to assign this role!')
                            .addFields(
                                { name: '🔧 Solution', value: `Move my bot role above the **${role.name}** role in Server Settings > Roles`, inline: false },
                                { name: '👤 Contact', value: 'Ask an administrator to fix the role hierarchy', inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: 'Hierarchy Error' });
                        
                        await message.reply({ embeds: [hierarchyEmbed] });
                        await sendLogMessage('failed', message.author, 'Role hierarchy issue');
                        return;
                    }

                    try {
                        await message.member.roles.add(role);
                        await message.reactions.removeAll();
                        await message.react(config.emojis.success);
                        
                        console.log(chalk.green('　　[+]'), chalk.white('Verified:'), chalk.cyan(`(@${message.author.username})`));
                        
                        await sendLogMessage('success', message.author);
                        
                        if (config.remove_channel_access) {
                            setTimeout(async () => {
                                await removeChannelAccess(message.member, message.channel);
                            }, 1200);
                        }
                        
                        const successEmbed = new EmbedBuilder()
                            .setColor(0x00FF00)
                            .setTitle('🎉 Verification Successful!')
                            .setDescription(`Congratulations ${message.author}! Your YouTube subscription has been verified.`)
                            .addFields(
                                { name: '📺 Channel', value: `[${config.channel_name}](${config.channel_url})`, inline: true },
                                { name: '🎭 Role Assigned', value: role.name, inline: true },
                                { name: '⏰ Verified At', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
                            )
                            .setThumbnail(message.author.displayAvatarURL())
                            .setTimestamp()
                            .setFooter({ text: 'Thank you for subscribing! 🚀' });

                        if (config.remove_channel_access) {
                            successEmbed.addFields({
                                name: '🔒 Channel Access',
                                value: 'Your access to this verification channel',
                                inline: false
                            });
                        }
                        
                        const replyMessage = await message.reply({ embeds: [successEmbed] });
                        
                        setTimeout(async () => {
                            try {
                                await replyMessage.delete();
                                await message.delete();
                            } catch (error) {}
                        }, 1800);
                        
                    } catch (roleError) {
                        await message.reactions.removeAll();
                        await message.react(config.emojis.failed);
                        
                        console.log(chalk.red('　　[+]'), chalk.white('Failed To Verify:'), chalk.cyan(`(@${message.author.username})`));
                        
                        await sendLogMessage('failed', message.author, `Role assignment failed: ${roleError.message}`);
                        
                        const roleErrorEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('⚠ Role Assignment Failed')
                            .setDescription(`${message.author}, verification successful but I couldn't assign the role.`)
                            .addFields(
                                { name: '✅ Verification Status', value: 'Your subscription was verified successfully!', inline: false },
                                { name: '⚠ Role Issue', value: 'Contact an administrator to get your role manually', inline: false },
                                { name: '🔧 Technical Info', value: `Error: ${roleError.message}`, inline: false }
                            )
                            .setThumbnail(message.author.displayAvatarURL())
                            .setTimestamp()
                            .setFooter({ text: 'Manual role assignment needed' });
                        
                        await message.reply({ embeds: [roleErrorEmbed] });
                    }
                    
                } else {
                    await message.reactions.removeAll();
                    await message.react(config.emojis.failed);
                    
                    console.log(chalk.red('　　[+]'), chalk.white('Failed To Verify:'), chalk.cyan(`(@${message.author.username})`));
                    
                    await sendLogMessage('failed', message.author, 'Subscription not detected in screenshot');
                    
                    try {
                        const dmEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setTitle('📺 Subscribe to Get Verified!')
                            .setDescription(`Hello ${message.author.username}! 👋`)
                            .addFields(
                                { name: '⚠ Verification Failed', value: 'We couldn\'t verify your subscription from your screenshot.', inline: false },
                                { name: '📺 Subscribe Now!', value: `**[Click Here to Subscribe to ${config.channel_name}](${config.channel_url})**`, inline: false },
                                { name: '📸 Then Try Again', value: 'After subscribing, take a clear screenshot and upload it again!', inline: false },
                                { name: '💡 Tips for Success', value: '• Make sure you\'re actually subscribed\n• Screenshot should show "Subscribed" or "Unsubscribe" button\n• Ensure good image quality\n• Include the subscription status clearly\n• Try screenshotting your subscriptions page (youtube.com/feed/subscriptions)\n• Works in any language!', inline: false }
                            )
                            .setThumbnail('https://cdn.discordapp.com/attachments/1403799906895794331/1403800873498312735/free-youtube-logo-icon-2431-thumb.png?ex=6898def1&is=68978d71&hm=851d5b6705ad6e4dfe900b18851cf6f61adf45046fdb00e59e03aa49f02ffa22&')
                            .setTimestamp()
                            .setFooter({ text: 'We\'d love to have you as a subscriber! 🚀' });
                        
                        await message.author.send({ embeds: [dmEmbed] });
                    } catch (dmError) {}
                    
                    const failEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('⚠ Verification Failed')
                        .setDescription(`${message.author}, we couldn't verify your subscription from the provided screenshot.`)
                        .addFields(
                            { name: '📋 Requirements', value: `• Must be subscribed to **${config.channel_name}**\n• Screenshot must show "Subscribed" or "Unsubscribe" button\n• Image must be clear and readable\n• Must show the correct channel name\n• Works in any language!`, inline: false },
                            { name: '📺 Subscribe Here', value: `**[config.channel_name](${config.channel_url})**`, inline: false },
                            { name: '💡 Better Screenshots', value: '• Screenshot your subscriptions page: youtube.com/feed/subscriptions\n• Or screenshot the channel page showing "Subscribed"\n• Make sure subscription status is visible\n• Ensure good image quality\n• Any language is supported', inline: false },
                            { name: '📨 Check Your DMs', value: 'I\'ve sent you detailed instructions in your DMs!', inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Please subscribe and try again!' });
                    
                    const failReply = await message.reply({ embeds: [failEmbed] });
                    
                    setTimeout(async () => {
                        try {
                            await failReply.delete();
                            await message.delete();
                        } catch (error) {}
                    }, 2400);
                }
                
            } catch (error) {
                await message.reactions.removeAll();
                await message.react(config.emojis.failed);
                
                console.log(chalk.red('　　[+]'), chalk.white('Failed To Verify:'), chalk.cyan(`(@${message.author.username})`));
                
                await sendLogMessage('failed', message.author, `Processing error: ${error.message}`);
                
                if (error.code === 50013) {
                    const permissionEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle('🚫 Bot Permission Error')
                        .setDescription(`${message.author}, your subscription was **VERIFIED** ✅ but I can't assign the role due to missing permissions.`)
                        .addFields(
                            { name: '✅ Verification Status', value: 'Your YouTube subscription is confirmed!', inline: true },
                            { name: '⚠ Permission Issue', value: 'Bot lacks role management permissions', inline: true },
                            { name: '🔧 Admin Fix Required', value: '1. Go to Server Settings → Roles\n2. Find the bot role\n3. Enable "Manage Roles" permission\n4. Move bot role ABOVE the subscriber role\n5. Save changes', inline: false },
                            { name: '📺 Verified Channel', value: `[${config.channel_name}](${config.channel_url})`, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Contact admin for manual role assignment' });
                    
                    await message.reply({ embeds: [permissionEmbed] });
                } else if (error.message && error.message.includes('hierarchy')) {
                    const hierarchyEmbed = new EmbedBuilder()
                        .setColor(0xFF6B00)
                        .setTitle('⚠️ Role Hierarchy Error')
                        .setDescription(`${message.author}, verification successful but role hierarchy prevents assignment.`)
                        .addFields(
                            { name: '✅ Verification Status', value: 'YouTube subscription confirmed!', inline: false },
                            { name: '🔧 Admin Solution', value: 'Move the bot role above the subscriber role in Server Settings → Roles', inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Hierarchy fix needed' });
                    
                    await message.reply({ embeds: [hierarchyEmbed] });
                } else {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0xFF6B00)
                        .setTitle('⚠️ Processing Error')
                        .setDescription(`${message.author}, there was an error processing your screenshot.`)
                        .addFields(
                            { name: '🔧 Possible Solutions', value: '• Try uploading a different image format (PNG, JPG)\n• Ensure the image is not corrupted\n• Make sure the image is clear and readable\n• Try taking a new screenshot\n• Screenshot should show subscription status clearly\n• Supported in all languages', inline: false },
                            { name: '📞 Support', value: 'Use `/support` command or contact an administrator if the problem persists.', inline: false },
                            { name: '🛠 Error Details', value: `\`${error.message || 'Unknown error'}\``, inline: false }
                        )
                        .setThumbnail(message.author.displayAvatarURL())
                        .setTimestamp()
                        .setFooter({ text: 'Error Code: PROCESSING_FAILED' });
                    
                    await message.reply({ embeds: [errorEmbed] });
                }
            }
        } else {
            const invalidFileEmbed = new EmbedBuilder()
                .setColor(0xFFA500)
                .setTitle('📄 Invalid File Type')
                .setDescription(`${message.author}, please upload a valid image file to verify your subscription.`)
                .addFields(
                    { name: '✅ Supported Formats', value: 'PNG, JPG, JPEG, GIF, WEBP', inline: true },
                    { name: '📺 What to Screenshot', value: 'Your YouTube subscriptions page or channel page showing "Subscribed" status', inline: true },
                    { name: '🌍 Language Support', value: 'Screenshots in any language are supported!', inline: false }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: 'Upload an image to get verified!' });
            
            await message.reply({ embeds: [invalidFileEmbed] });
        }
    } else {
        const noImageEmbed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('📸 Upload Screenshot Required')
            .setDescription(`${message.author}, please upload a screenshot of your YouTube subscription to get verified!`)
            .addFields(
                { name: '📋 Instructions', value: `1. Subscribe to [${config.channel_name}](${config.channel_url})\n2. Take a screenshot showing you're subscribed\n3. Upload the screenshot here\n4. Get your role automatically!`, inline: false },
                { name: '📸 Best Screenshots', value: '• Screenshot of your subscriptions page (youtube.com/feed/subscriptions)\n• Or screenshot of the channel showing "Subscribed" button\n• Make sure subscription status is clearly visible\n• Any language is supported!', inline: false },
                { name: '💡 Pro Tip', value: 'Make sure the channel name and subscription status are both clearly visible in your screenshot.', inline: false }
            )
            .setThumbnail(message.author.displayAvatarURL())
            .setTimestamp()
            .setFooter({ text: 'We\'re waiting for your screenshot!' });
        
        const sentMessage = await message.reply({ embeds: [noImageEmbed] });
        
        setTimeout(async () => {
                        try {
                            await sentMessage.delete();
                        } catch (error) {}
                    }, 2400);
                    
                    return;
                }

    if (content === '>ping' && config.ownids && config.ownids.includes(message.author.id)) {
        const pingEmbed = new EmbedBuilder()
            .setTitle('🏓 Bot Ping Information')
            .setDescription(`**Latency:** ${Date.now() - message.createdTimestamp}ms\n**API Ping:** ${client.ws.ping}ms`)
            .addFields(
                { name: '🌐 WebSocket', value: `${client.ws.ping}ms`, inline: true },
                { name: '⏱️ Uptime', value: `${Math.floor(process.uptime() / 60)} minutes`, inline: true },
                { name: '📢 Guilds', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${client.users.cache.size}`, inline: true },
                { name: '💾 Memory', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true },
                { name: '🌍 Multi-Language', value: 'Supported', inline: true }
            )
            .setColor('#00D4FF')
            .setTimestamp()
            .setFooter({ text: 'Cheques • Tejv' });
        
        await message.reply({ embeds: [pingEmbed] });
    }
});

client.login(config.token);

// @Tejv – https://dsc.gg/tejv