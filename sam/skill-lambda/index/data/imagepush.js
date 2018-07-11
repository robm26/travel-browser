const https = require('https');
const fs = require("fs");
const { execSync } = require('child_process');

const imageFile = `./imagenames.csv`;


fs.readFile(imageFile, function (err, data) {  // open dialog sequence file and read Intents
    if (err) {
        console.log(`error reading file: ${imageFile}`);
        process.exit(1);
    }
    const lines = data.toString().split(`\n`);
    lines.forEach(downloader);

    // console.log(lines);

});

function downloader(file, index) {
    const cityName = file.replace(`\r`,``).replace(`city-`,``);
    const objName = file.replace(`\r`,``).replace(`.jpg`, `._TTH_.jpg`).replace(`.png`, `._TTH_.png`);
    const newFileName = fixName(cityName);

    // console.log(newFileName);

    const url = `https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/devdays/${objName}`;
    // console.log(url);
    // const cmd = `curl -o ./img/${newFileName} ${url} `;
    // console.log(cmd);
    // execCmd(cmd);
    let json = `{"city":"${newFileName.replace(`.jpg`,``)}", "fileName":"${objName}", "date":"2018-12-12"},`;
    if(newFileName.indexOf(`-bw`) === -1)  {
        console.log(json);
    }

}

function execCmd(cmd) {
    let stdout = execSync(cmd);
    return stdout.toString();

}
function fixName(name) {
    // console.log(name);
    let fixedName = name
        .replace(`Bangalore`, `bangalore`)
        .replace(`Delhi`, `delhi`)
        .replace(`sanfrancisco`, `San Francisco`)
        .replace(`Santaclara`, `Santa Clara`)
        .replace(`newyorkcity`, `New York City`);


    return capitalize(fixedName);
}

function capitalize(inputString) {
    return inputString.replace(/(?:^|\s)\S/g, function(input) {
        return input.toUpperCase();
    }) ;
}
