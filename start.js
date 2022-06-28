import chalk from "chalk";

async function startup() {
    await console.log(`${chalk.bold(`Starting up Bicycle`)}`)

    await console.log(`${chalk.yellow(`
    ░██▄░█░▄▀▀░▀▄▀░▄▀▀░█▒░▒██▀
    ▒█▄█░█░▀▄▄░▒█▒░▀▄▄▒█▄▄░█▄▄`)}`)

    await console.log(`\n`)
    setTimeout(async() => {
        await console.log(`${chalk.bold.bgYellow(`Bicycle has Started Up`)}`)
        await import("./src/Bicycle.js")
    }, 1000)
}

startup();