import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("case")
                .setDescription("Get information of a case")
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("view")
                        .setDescription("View Information on a case")
                        .addNumberOption(numberOption =>
                            numberOption
                                .setName("caseid")
                                .setDescription(`The caseid of the case you wish to view`)
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("delete")
                        .setDescription("Delete a case from the database")
                        .addNumberOption(numberOption =>
                            numberOption
                                .setName("caseid")
                                .setDescription(`The caseid of the case you wish to delete`)
                                .setRequired(true)    
                        )    
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName("edit")
                        .setDescription("Edit a case's reason")
                        .addNumberOption(numberOption =>
                            numberOption
                                .setName("caseid")
                                .setDescription(`The caseid of the case you wish to delete`)
                                .setRequired(true)    
                        )
                        .addStringOption(stringOption =>
                            stringOption
                                .setName("reason")
                                .setDescription("Set the reason for the case")
                                .setRequired(true)    
                        )
                )
                ,
            true
        )
    }

    async run(interaction) {
        if(interaction.options.getSubcommand() == "view") {
            return await interaction.client.moderator.case(interaction)
        } else if(interaction.options.getSubcommand() == "delete") {
            return await interaction.client.moderator.deleteCase(interaction)
        } else if(interaction.options.getSubcommand() == "edit") {
            return await interaction.client.moderator.editCase(interaction)
        }
    }
}