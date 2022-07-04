import BaseCommand from "../../structures/BaseCommand.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export default class PurgeCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("purge")
                .setDescription("Delete messages in a channel")
                .addNumberOption(numberOption =>
                    numberOption
                        .setName("amount")
                        .setDescription(`The amount of messages you wish to delete`)
                        .setRequired(true)   
                        .setMinValue(0)
                        .setMaxValue(100) 
                )
        )
    }

    async run(interaction) {
        return interaction.client.moderator.purge(interaction);
    }
}