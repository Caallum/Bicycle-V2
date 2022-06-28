import BaseCommand from "../../structures/BaseCommand.js";
import { SlashCommandBuilder } from "@discordjs/builders"
import embed from "../../utils/embed.js"

export default class PingCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName(`ping`)
                .setDescription(`Get the API Latency for the Bot!`)
        )
    }

    async run(interaction) {
        new embed(interaction, {
            description: `🏓 Pong! \`${interaction.client.ws.ping} MS\``
        })
    }
}