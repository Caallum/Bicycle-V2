//Packages
import { Client, Intents, Collection } from "discord.js";
import { readdirSync } from "node:fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

// Files
import BaseEvent from "./structures/BaseEvent.js"
import BaseCommand from "./structures/BaseCommand.js";
import config from "./Bicycle.Config.js"
import Logger from "./Logger.js";
import BicyclePlayer from "./Bicycle.Player.js"
import BicycleDatabase from "./Bicycle.Database.js"
import BicycleModeration from "./Bicycle.Moderation.js";
import BicycleCases from "./Bicycle.Cases.js";
import BicycleTickets from "./Bicycle.Tickets.js";
import BicycleLogs from "./Bicycle.Logs.js";

// Main File

class Bicycle {
    constructor() {
        this.config = config;

        this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES ], partials: ["CHANNEL", "MESSAGE"]});

        this.client.login(this.config.important.bot.token)

        this.EventHandler()
        this.CommandHandler()
        this.MusicHandler()
        this.DatabaseHandler()
        this.ModerationHandler()
        this.TicketHandler()
        this.LogHandler()
    }

    get getClient() {
        return this.client;
    }

    async LogHandler() {
        this.client.log = new BicycleLogs(this.client);
        new Logger({
            success: true,
            message: `Log Handler is active`
        })
    }

    async TicketHandler() {
        this.client.tickets = new BicycleTickets(this.client);
        new Logger({
            success: true,
            message: `Ticket Handler is active`
        })
    }

    async MusicHandler() {
        this.client.player = new BicyclePlayer(this.client);
        new Logger({
            success: true,
            message: `Music Handler is active`
        })
    }

    async ModerationHandler() {
        this.client.moderator = new BicycleModeration(this.client);
        this.client.case = new BicycleCases(this.client);
        new Logger({
            success: true,
            message: `Moderation Handler is active`
        })
    }

    async EventHandler() {
        const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));
        for(const file of eventFiles) {
            const Event = await import(`./events/${file}`);
            if(Event.default.prototype instanceof BaseEvent) {
                const event = new Event.default();
                this.client.on(event.name, event.run.bind(null, this.client));
            }
        }
    }

    async DatabaseHandler() {
        this.client.db = new BicycleDatabase(this.config.important.bot.mongoURI, {
            name: `BicycleDatabase`
        })

        this.client.db.on("error", (error) => {
            new Logger({
                error: true,
                message: `An error has occured: ${error}`
            })
        })

        this.client.db.on("connected", (message) => {
            new Logger({
                success: true,
                message: `${message}`
            })
        })
    }

    async CommandHandler() {
        let guildId = this.config.other.guild;
        let clientId = this.config.other.client;

        let commands = [];
        this.client.commands = new Collection()

        let dirs = readdirSync("./src/commands");
        for(const dir of dirs) {
            const commandFiles = readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith(".js"));
            for(const file of commandFiles) {
                let Command = await import(`./commands/${dir}/${file}`);
                Command = Command.default
                if(Command.prototype instanceof BaseCommand) {
                    let command = new Command();
                    commands.push(command.data.toJSON());
                } 
            }
        };


        const rest = new REST({ version: "9" }).setToken(this.config.important.bot.token);

        (async () => {
            try {
                new Logger({
                    info: true,
                    message: `Refreshing Slash Commands`
                })
                
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands }
                )

                new Logger({
                    success: true,
                    message: `Refreshed Slash Commands`
                })
            } catch (error) {
                new Logger({
                    error: true,
                    message: `An error has occured: ${error}`
                })
            }
        })(); 

        for(const dir of dirs) {
            const commandFiles = readdirSync(`./src/commands/${dir}`).filter(file => file.endsWith(".js"));
            for(const file of commandFiles) {
                let Command = await import(`./commands/${dir}/${file}`);
                Command = Command.default
                if(Command.prototype instanceof BaseCommand) {
                    let command = new Command();
                    this.client.commands.set(command.data.name, command)
                } 
            }
        }
    }
}

export default new Bicycle()