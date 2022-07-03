export default {
    
    replit: false,

    important: {
        developerRoleID: "",
        bot: {
            token: "",
            mongoURI: "",
            moderation: {
                logChannel: ""
            }
        },
        music: {
            spotify: {
                id: "",
                secret: ""
            },
            youtubeCookie: ""
        }
    },

    other: {
        client: "",
        guild: "",
        tickets: {
            createCategory: "",
            pendingCategory: "",
            claimedCategory: "",
            transcriptChannel: "",
            options: [
                {
                    name: "Report",
                    description: "Report a user for a crime",
                    emoji: "👮",
                },
                {
                    name: "Suggestion",
                    description: "Suggest a feature for the server",
                    emoji: "💡"
                },
                {
                    name: "Order",
                    description: "Place an order for a custom made bot",
                    emoji: "🍔"
                }
            ]
        },

        embed: {
            color: "YELLOW",
            footer: {
                text: "Bicycle",
                icon: "{avatar}"
            },
            author: {
                text: "",
                icon: "",
                url: ""
            }
        }
    }
}