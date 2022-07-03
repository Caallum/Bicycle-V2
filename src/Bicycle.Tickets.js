import BicycleConfig from "./Bicycle.Config.js";
import Logger from "./Logger.js";
import date from "./utils/date.js";
import embed from "./utils/embed.js"

export default class BicycleTickets {
    constructor(client) {
        this.client = client;
    }

    async handle(interaction, type) {
        let existing = await this.getTicket(interaction.user.id)
        if(existing) {

            let channel = await this.client.channels.fetch(existing)
            let newEmbed = await new embed(interaction, { description: `You already have a ticket open: ${channel.toString()}`, returnEmbed: true });
            return interaction.update({ embeds: [newEmbed], ephemeral: true, components: [] })
        };

        let channel = await interaction.guild.channels.create(`unclaimed-${interaction.user.discriminator}`, {
            parent: BicycleConfig.other.tickets.createCategory
        });

        let channelObject = {
            reason: null,
            claimed: false,
            user: interaction.user,
            type: type,
            date: date()
        }

        await this.client.db.set(`ticket-${interaction.user.id}`, channel.id);
        await this.client.db.set(`ticket.channel-${channel.id}`, channelObject)

        new embed(channel, { message: `${interaction.user.toString()}`, title: `Your ticket has been created`, description: `Give as much detail as needed so support can help you with your issue.` });
        let newEmbed = await new embed(interaction, { description: `Your ticket has been created: ${channel.toString()}`, returnEmbed: true });
        return interaction.update({ embeds: [newEmbed], ephemeral: true, components: [] })
    }

    async getTicket(userId) {
        return await this.client.db.get(`ticket-${userId}`)
    }

    async claimTicket(interaction) {
        if(interaction.channel.parentId != BicycleConfig.other.tickets.pendingCategory) return new embed(interaction, { title: `Invalid channel`, ephemeral: true });

        let information = await this.client.db.get(`ticket.channel-${interaction.channel.id}`);
        if(!information) return new embed(interaction, { title: `Invalid channel`, ephemeral: true });

        information.claimed = interaction.user;
        interaction.channel.setParent(BicycleConfig.other.tickets.claimedCategory);

        await this.client.db.set(`ticket.channel-${interaction.channel.id}`, information);
        return new embed(interaction, {
            title: `Ticket has been claimed`,
            description: `This ticket has been claimed by ${interaction.user.tag}`
        })
    }

    async ticketInformation(interaction) {
        if(interaction.channel.parentId != BicycleConfig.other.tickets.pendingCategory && interaction.channel.parentId != BicycleConfig.other.tickets.claimedCategory) return new embed(interaction, { title: `Invalid channel`, ephemeral: true })

        let information = await this.client.db.get(`ticket.channel-${interaction.channel.id}`);
        if(!information) return new embed(interaction, { title: `Invalid channel`, description: `There is no information on this channel`, ephemeral: true })

        return new embed(interaction, { title: `Information Found!`, description: `**Created by:** ${information.user.username}#${information.user.discriminator} (${information.user.id})\n**Claimed By:** ${information.claimed ? `${information.claimed.username}#${information.claimed.discriminator} (${information.claimed.id})` : "This ticket has not been claimed yet"}\n**Reason:** ${information.reason}\n**Type:** ${information.type}\n**Date:** ${information.date}`, ephemeral: true })
    }

    async closeTicket(interaction) {
        if(interaction.channel.parentId != BicycleConfig.other.tickets.createCategory && interaction.channel.parentId != BicycleConfig.other.tickets.pendingCategory && interaction.channel.parentId != BicycleConfig.other.tickets.claimedCategory) return new embed(interaction, { title: `Invalid channel`, ephemeral: true })

        let information = await this.client.db.get(`ticket.channel-${interaction.channel.id}`)

        new embed(interaction, { title: `Ticket closing in 5 seconds` })

        let messages = await interaction.channel.messages.fetch({ limit: 100 })
        messages.reverse()
        let transcriptChannel = await this.client.channels.cache.get(BicycleConfig.other.tickets.transcriptChannel);
        if(transcriptChannel) {
            let content = `Ticket System created by big jonh#5007\nDate: ${date()}\nType of ticket: ${information.type}\nReason: ${information?.reason}\n\n-------------- START OF TICKET --------------\n`;
            content += messages.map((message) => `${message.author.tag} (${message.author.id}): ${message.embeds.length > 0 ? "Message Embed" : message.content}`).join("\n")
            
            transcriptChannel.send({ files: [{ name: "transcript.txt", attachment: Buffer.from(content)}]})
        }

        setTimeout(async () => {
            if(information) {
                await this.client.db.delete(`ticket-${information.user.id}`)
                await this.client.db.delete(`ticket.channel-${interaction.channel.id}`)
            }

            interaction.channel.delete()
        }, 5000)
    }
}