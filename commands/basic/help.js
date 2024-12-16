const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const { serverConfigCollection } = require('../../mongodb');
const commandFolders = ['anime', 'basic', 'fun', 'moderation', 'utility', 'distube music', 'setups'];
const enabledCategories = config.categories;
const excessCommands = config.excessCommands;
const cmdIcons = require('../../UI/icons/commandicons');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of commands'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {

            const serverId = interaction.guildId;
            let serverConfig;
            try {
                serverConfig = await serverConfigCollection.findOne({ serverId });
            } catch (err) {
                console.error('Error fetching server configuration from MongoDB:', err);
            }

          
            const serverPrefix = serverConfig && serverConfig.prefix ? serverConfig.prefix : config.prefix;

            const createSlashCommandPages = () => {
                const pages = [];

                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(enabledCategories).filter(category => enabledCategories[category]);
                const disabledCategoriesList = Object.keys(enabledCategories).filter(category => !enabledCategories[category]);

                
                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };
                
             
                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };
                
              
                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');
                
             
                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
           
                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
            
                const totalCommands = totalCommandFiles + totalExcessCommandFiles;
                

                pages.push({
                    title: 'Bot Information',
                    description: `Welcome to the help command! This bot provides a variety of commands to enhance your server experience. Below are the categories and the number of commands available in each.`,
                    commands: [
                        `**💜 Bot Developer:** dep\n`+
                        `**Bot Version:** 1.1.0\n`+
                        `**Total Servers:** ${totalServers}\n`+
                        `**Total Members:** ${totalMembers}\n`+
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n`+
                        `**Total Commands:** ${totalCommands}\n`+
                        `**Enabled Categories:** ${enabledCategoriesList.join(', ')}\n`+
                        `**Disabled Categories:** ${disabledCategoriesList.join(', ')}\n`,
                    ],
                    image: "https://media.discordapp.net/attachments/1057712779320103094/1318257504702173255/furry-furries.gif?ex=6761aa79&is=676058f9&hm=7a0f019e1dce66b42483d6ee0483c35ad1a05eb6654c27e9bebc12f8e9061c1b&=",
                    color: "#3498db",
                    thumbnail: "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&",
                    author: {
                        name: 'Ins4ne',
                        iconURL: "https://tenor.com/view/shush-eevee-gif-25220194",
                        url: "https://discord.gg/43VDd3UTrM"
                    }
                });

                const commandData = {};

                for (const folder of commandFolders) {

                    if (enabledCategories[folder]) { 
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../commands/${folder}`)).filter(file => file.endsWith('.js'));
                        commandData[folder] = commandFiles.map(file => {
                            const command = require(`../../commands/${folder}/${file}`);
                            return command.data.name;
                        });
                    }
                }

                for (const [category, commands] of Object.entries(commandData)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Both Slash commands and Prefix\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command}\`\``),
                        image: "",
                        color: "#3498db",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/43VDd3UTrM"
                        }
                    };

                    switch (category) {
                        case 'anime':
                            page.image = "https://tenor.com/view/gojo-satoru-gojo-satoru-jjk-jujutsu-kaisen-gif-7280593681001594903";
                            page.color = "#ff66cc";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://tenor.com/view/shush-eevee-gif-25220194";
                            break;
                        case 'basic':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#99ccff";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'fun':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#ffcc00";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'moderation':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'distube music':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'setups':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#ff0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        default:
                            page.color = "#3498db"; // Set a default color if none matches
                            break;
                    }

                    pages.push(page);
                }

                return pages;
            };

            const createPrefixCommandPages = () => {

                const pages = [];
                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(enabledCategories).filter(category => enabledCategories[category]);
                const disabledCategoriesList = Object.keys(enabledCategories).filter(category => !enabledCategories[category]);

                
                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };
                
             
                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };
                
              
                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');
                
             
                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
           
                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);
                
            
                const totalCommands = totalCommandFiles + totalExcessCommandFiles;
                pages.push({
                    title: 'Bot Information',
                    description: `Welcome to the help command! This bot provides a variety of commands to enhance your server experience. Below are the categories and the number of commands available in each.`,
                    commands: [
                        `**Bot Developer:** dep\n`+
                        `**Bot Version:** 1.0.4\n`+
                        `**Total Servers:** ${totalServers}\n`+
                        `**Total Members:** ${totalMembers}\n`+
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n`+
                        `**Total Commands:** ${totalCommands}\n`+
                        `**Enabled Categories:** ${enabledCategoriesList.join(', ')}\n`+
                        `**Disabled Categories:** ${disabledCategoriesList.join(', ')}\n`,
                    ],
                    image: "https://cdn.discordapp.com/attachments/1057712779320103094/1318257504702173255/furry-furries.gif?ex=6761aa79&is=676058f9&hm=7a0f019e1dce66b42483d6ee0483c35ad1a05eb6654c27e9bebc12f8e9061c1b&",
                    color: "#3498db",
                    thumbnail: "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&",
                    author: {
                        name: 'Ins4ne',
                        iconURL: "https://tenor.com/view/shush-eevee-gif-25220194",
                        url: "https://discord.gg/43VDd3UTrM"
                    }
                });

                const prefixCommands = {};

                for (const [category, isEnabled] of Object.entries(excessCommands)) {
                    if (isEnabled) {
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../excesscommands/${category}`)).filter(file => file.endsWith('.js'));
                        prefixCommands[category] = commandFiles.map(file => {
                            const command = require(`../../excesscommands/${category}/${file}`);
                            return {
                                name: command.name,
                                description: command.description
                            };
                        });
                    }
                }

                for (const [category, commands] of Object.entries(prefixCommands)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Only Prefix commands with \`${serverPrefix}\`\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command.name}\`\``),
                        image: "",
                        color: "",
                        thumbnail: "",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            iconURL: "",
                            url: "https://discord.gg/43VDd3UTrM"
                        }
                    };

                    switch (category) {
                        case 'utility':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#00cc99";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1255164064192270418/2861-tool.gif?ex=667c2220&is=667ad0a0&hm=17d2f57af30831b62639fd3d06853a7bc423e1a96b36e5994f432b65aa9f30dc&";
                            break;
                        case 'other':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#ff6600";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'hentai':
                            page.image = "https://cdn.discordapp.com/attachments/1246408947708072027/1255160148272353373/Rias.gif?ex=667c1e7b&is=667accfb&hm=cd9d086020fd0e062be92126942d1d683c15a878bb699b000d9db9a34447eb6c&";
                            page.color = "#ff99cc";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1230824519220985896/6280-2.gif?ex=667beaa8&is=667a9928&hm=50dfab0b5a63dab7abdc167899c447041b9717016c71e4ffe377a0d7a989d6b5&";
                            break;
                        case 'lavalink':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#ffcc00";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        case 'troll':
                            page.image = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.color = "#cc0000";
                            page.thumbnail = "https://cdn.discordapp.com/attachments/1057712779320103094/1318260759221895269/74fabe0ac2588f7f052170708b5136b8.gif?ex=6761ad81&is=67605c01&hm=b81aa20eeea147f460066a709d13190acb1b936d9726358d5907e80b468079c8&";
                            page.author.iconURL = "https://cdn.discordapp.com/attachments/1230824451990622299/1253655047259160596/6186-developer-bot.gif?ex=66a9667f&is=66a814ff&hm=1494b63ccfaf2dae30a35af520fb748dd17e76195c206f2925b526595018c60f&";
                            break;
                        default:
                            page.color = "#3498db"; // Set a default color if none matches
                            break;
                    }

                    pages.push(page);
                }

                return pages;
            };

            const slashCommandPages = createSlashCommandPages();
            const prefixCommandPages = createPrefixCommandPages();
            let currentPage = 0;
            let isPrefixHelp = false;

            const createEmbed = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                const page = pages[currentPage];

                if (!page) {
                    console.error('Page is undefined');
                    return new EmbedBuilder().setColor('#3498db').setTitle('Error').setDescription('Page not found.');
                }

                const fieldName = page.title === "Bot Information" ? "Additional Information" : "Commands";

                // Ensure a valid color is always set
                const color = page.color || '#3498db';

                return new EmbedBuilder()
                    .setTitle(page.title)
                    .setDescription(page.description)
                    .setColor(color)
                    .setImage(page.image)
                    .setThumbnail(page.thumbnail)
                    .setAuthor({ name: page.author.name, iconURL: page.author.iconURL, url: page.author.url })
                    .addFields({ name: fieldName, value: page.commands.join(', ') });
            };

            const createActionRow = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous1')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next2')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === pages.length - 1),
                        new ButtonBuilder()
                            .setCustomId('prefix')
                            .setLabel(isPrefixHelp ? 'Normal Command List' : 'Excess Command List')
                            .setStyle(ButtonStyle.Secondary)
                    );
            };

            const createDropdown = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('page-select')
                            .setPlaceholder('Select a page')
                            .addOptions(pages.map((page, index) => ({
                                label: page.title,
                                value: index.toString()
                            })))
                    );
            };

            await interaction.reply({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (button) => {
                if (button.user.id !== interaction.user.id) return;

                if (button.isButton()) {
                    if (button.customId === 'previous1') {
                        currentPage = (currentPage - 1 + (isPrefixHelp ? prefixCommandPages : slashCommandPages).length) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'next2') {
                        currentPage = (currentPage + 1) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'prefix') {
                        isPrefixHelp = !isPrefixHelp;
                        currentPage = 0;
                    }
                } else if (button.isSelectMenu()) {
                    currentPage = parseInt(button.values[0]);
                }

                try {
                    await button.update({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });
                } catch (error) {
                    //console.error('Error updating the interaction:', error);
                }
            });

            collector.on('end', async () => {
                try {
                    await interaction.editReply({ components: [] });
                } catch (error) {
                    //console.error('Error editing the interaction reply:', error);
                }
            });
           }   else {
                const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon ,
                    url: "https://discord.gg/43VDd3UTrM"
                })
                .setDescription('- This command can only be used through slash command!\n- Please use `/help`')
                .setTimestamp();
            
                await interaction.reply({ embeds: [embed] });
            
                } 
    }
};
