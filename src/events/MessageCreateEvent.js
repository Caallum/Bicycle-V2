import { MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import BaseEvent from "../structures/BaseEvent.js"
import embed from "../utils/embed.js"
import BicycleConfig from "../Bicycle.Config.js";

export default class MessageCreateEvent extends BaseEvent {
    constructor() {
        super("messageCreate")
    }

    async run(client, message) {
        if(message.author.bot) return;

        if(message.channel.parentId == BicycleConfig.other.tickets.createCategory) {
            let channelInformation = await client.db.get(`ticket.channel-${message.channel.id}`)
            if(message.author.id != channelInformation.user.id) return;

            new embed(message.channel, {
                title: `Ticket is now pending`,
                description: `Please wait for staff to respond, feel free to add any extra details as you wait.\n\n**Important: Do not ping staff, this will not speed up your ticket**`
            })

            channelInformation.reason = message.content;
            await client.db.set(`ticket.channel-${message.channel.id}`, channelInformation)
            message.channel.setParent(BicycleConfig.other.tickets.pendingCategory)
            message.channel.setName(`${channelInformation.type}-${message.author.discriminator}`)
        }
    }
}