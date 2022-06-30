import date from "./utils/date.js";

export default class BicycleCases {
    constructor(client) {
        this.client = client;
    }

    async _caseNumber() {
        let cases = await this.client.db.get(`cases`);
        if(!cases) {
            await this.client.db.set(`cases`, 1);
            return 1;
        };

        cases += 1

        await this.client.db.set(`cases`, cases);
        return cases;
    }

    async addCase(moderator, user, reason, punishment, time = null) {
        let caseNumber = await this._caseNumber();

        let caseObject = {
            case: caseNumber,
            moderator: {
                userTag: moderator.tag,
                userId: moderator.id,
            },
            user: {
                userTag: user.tag,
                userId: user.id
            },
            action: {
                punishment: punishment,
                reason: reason,
                date: date()
            }
        };

        if(time) caseObject.action.time = time;

        await this.client.db.set(`cases-${caseNumber}`, caseObject)
        await this.addUserCase(user.id, caseObject)
        return caseNumber;
    }

    async findCase(caseId) {
        return await this.client.db.get(`cases-${caseId}`)
    }

    async editCase(caseId, reason) {
        let caseObject = await this.client.db.get(`cases-${caseId}`)

        caseObject.action.reason = reason;
        await this.client.db.set(`cases-${caseId}`, caseObject)
    }

    async addUserCase(userId, caseObject) {
        await this.client.db.push(`punishments-${userId}`, caseObject);
        return true
    }

    async getUserCases(userId) {
        return await this.client.db.get(`punishments-${userId}`)
    }

    async getUserWarns(userId) {
        let punishments = await this.getUserCases(userId);
        if(!punishments) return [];

        let warns = [];
        punishments.forEach(async(punishment) => {
            if(punishment.action.punishment == "warn") {
                warns.push(punishment);
            }
        });

        return warns;
    }

    async getUserMutes(userId) {
        let punishments = await this.getUserCases(userId);
        if(!punishments) return [];

        let mutes = [];
        punishments.forEach(async(punishment) => {
            if(punishment.action.punishment == "mute") {
                mutes.push(punishment);
            }
        });

        return mutes;
    }

    async getUserKicks(userId) {
        let punishments = await this.getUserCases(userId);
        if(!punishments) return [];

        let kicks = [];
        punishments.forEach(async(punishment) => {
            if(punishment.action.punishment == "kick") {
                kicks.push(punishment);
            }
        });

        return kicks;
    }

    async getUserBans(userId) {
        let punishments = await this.getUserCases(userId);
        if(!punishments) return [];

        let bans = [];
        punishments.forEach(async(punishment) => {
            if(punishment.action.punishment == "ban") {
                bans.push(punishment);
            }
        });

        return bans;
    }

    async removeUserCase(userId, caseId) {
        let newPunishments = await this._pullCase(caseId, userId);
        await this.client.db.set(`punishments-${userId}`, newPunishments)
        return true;
    }

    async _pullCase(caseId, userId) {
        let history = await this.client.db.get(`punishments-${userId}`);
        let hasItem = history.some((x) => x.caseId === caseId);
        if(!hasItem) return false;
        let index = history.findIndex((x) => x.caseId == caseId);
        history = history.splice(index, 1);
        return history;
    }

    async deleteCase(caseId) {
        let caseObject = await this.client.db.get(`cases-${caseId}`);

        caseObject.delete = true;
        await this.client.db.set(`cases-${caseId}`, caseObject)
    }
}