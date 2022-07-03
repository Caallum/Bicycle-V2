import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";
import BiycleConfig from "../../Bicycle.Config.js";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import embed from "../../utils/embed.js"

export default class TicketCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ticket")
                .setDescription("Open a ticket"),
        )
    }

    async run(interaction) {
        let options = [];
        let i = 0;

        BiycleConfig.other.tickets.options.forEach(option => {
            options.push({
                label: option.name,
                description: option.description,
                emoji: option?.emoji,
                value: `option-${i}`
            });
            i++;
        })

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("ticketMenu")
                    .setPlaceholder("Nothing has been Selected")
                    .addOptions(options)
            )

        const Ee = new embed(interaction, {
            title: `Open a ticket based on the following selections`,
            returnEmbed: true
        })

        interaction.reply({ embeds: [Ee], components: [row], ephemeral: true })
    }
}