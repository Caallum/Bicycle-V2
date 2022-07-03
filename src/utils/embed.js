import { MessageEmbed as Embed } from "discord.js";
import { default as Config } from "../Bicycle.Config.js";
import Bicycle from "../Bicycle.js";
import Logger from "../Logger.js";

/**
 * Parameters for BicycleEmbed Class
 * @CHANNEL
 * DISCORDJS TEXT CHANNEL > https://discord.js.org/#/docs/discord.js/main/class/TextChannel
 * @DATA @OBJECT
 *      @TITLE
 *      Optional<String>
 *      @DESCRIPTION
 *      Optional<String>
 *      @IMAGE
 *      Optional<String> 
 *      @THUMBNAIL
 *      Optional<String>
 */

export default class BicycleEmbed {
    constructor(channel, data) {

        let footerIconURL = Config.other?.embed?.footer?.icon;
        footerIconURL = footerIconURL ? footerIconURL.replace("{avatar}", Bicycle.getClient.user.displayAvatarURL({ dynamic: true })) : null;

        let authorIconURL = Config.other?.embed?.author?.icon;
        authorIconURL = authorIconURL ? authorIconURL.replace("{avatar}", Bicycle.getClient.displayAvatarURL({ dynamic: true })) : null;

        let EmbedMessage = new Embed()
        
        if(Config.other.embed.footer.text) {
            if(!footerIconURL) EmbedMessage.setFooter({ text: Config.other.embed.footer.text })
            if(footerIconURL) EmbedMessage.setFooter({ text: Config.other.embed.footer.text, iconURL: footerIconURL })
        }    
        if(Config.other?.embed?.author?.text) {
            if(!authorIconURL && !Config.other.embed.author.url) EmbedMessage.setAuthor({ text: Config.other.embed.author.text })
            if(!Config.other.embed.author.url && authorIconURL) EmbedMessage.setAuthor({ text: Config.other.embed.author, iconURL: authorIconURL })
            if(Config.other.embed.author.url && authorIconURL) EmbedMessage.setAuthor({ text: Config.other.embed.author, iconURL: authorIconURL, url: Config.other.embed.author.url })
        }
        if(Config.other?.embed?.color) {
            EmbedMessage.setColor(Config.other.embed.color)
        }

        if(data.title) EmbedMessage.setTitle(data.title)
        if(data.description) EmbedMessage.setDescription(data.description)
        if(data.image) EmbedMessage.setImage(data.image)
        if(data.thumbnail) EmbedMessage.setThumbnail(data.thumbnail)
        if(data.fields) EmbedMessage.addFields(data.fields)
        if(data.url) EmbedMessage.setURL(data.url)
        if(data.returnEmbed) return EmbedMessage
        
        if(channel?.applicationId) {
            if(data.ephemeral) {
                if(data.message) return channel.reply({ embeds: [EmbedMessage], content: data.message, ephemeral: true }).catch((err) => new Logger({ error: true, message: err }))
                return channel.reply({ embeds: [EmbedMessage], ephemeral: true }).catch((err) => new Logger({ error: true, message: err }))
            }

            if(data.message) return channel.reply({ embeds: [EmbedMessage], content: data.message }).catch((err) => new Logger({ error: true, message: err }))
            return channel.reply({ embeds: [EmbedMessage] }).catch((err) => new Logger({ error: true, message: err }))
        }
        if(data.message) return channel.send({ embeds: [EmbedMessage], content: data.message }).catch((err) => new Logger({ error: true, message: err }))
        return channel.send({ embeds: [EmbedMessage] }).catch((err) => new Logger({ error: true, message: err }))
    }
}