import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class HistoryCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("history")
                .setDescription("View the punishment history of a user")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("target")
                        .setDescription("Which user you wish to view the history off")
                        .setRequired(true)
                )
        )
    }

    async run(interaction) {
        await interaction.client.moderator.history(interaction);
    }
}