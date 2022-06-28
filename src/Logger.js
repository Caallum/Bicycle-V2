import chalk from "chalk";
import moment from "moment";
import { writeFileSync, appendFileSync, existsSync } from "node:fs";

let FileName = `./src/development.logs`;
let WriteToFile = true;

export default class Logger {
    constructor(data) {
        this.log(data);
        if(WriteToFile) this.writeToLogs(data);
    }

    async writeToLogs(data) {
        if(data.error || data.warning) {
            if(existsSync(FileName)) {
                appendFileSync(FileName, `${data.error ? "ERROR" : "WARNING"} ${await this.line()} ${data.message}\n`)
            } else {
                writeFileSync(FileName, `${data.error ? "ERROR" : "WARNING"} ${await this.line()} ${data.message}\n`)
            }
        }
    }

    async log(data) {
        if (data.error) {
            return console.log(`${chalk.bgRed(`[Logger]`)} ${await this.line()} ${data.message}`)
        }

        if(data.success) {
            return console.log(`${chalk.bgGreen(`[Logger]`)} ${await this.line()} ${data.message}`)
        }

        if(data.warning) {
            return console.log(`${chalk.bgYellow(`[Logger]`)} ${await this.line()} ${data.message}`)
        }

        if(data.info) {
            return console.log(`${chalk.bgBlue(`[Logger]`)} ${await this.line()} ${data.message}`)
        }

        return console.log(`${chalk.bgWhite(`[Logger]`)} ${await this.line()} ${data.message}`)
    }

    async getTime() { return moment().format('YYYY-MM-DD HH:mm:ss') };

    async line(num = 2) {
        const e = new Error();
        let location = e.stack.split("\n")[4];
        location = location.split("src/")[1];
        if(location.endsWith(")")) location = location.slice(0, (location.length - 1))

        const time = await this.getTime();
        return `${time} - ${location}`
    }
}