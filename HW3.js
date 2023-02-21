const fs = require('fs');

const readStream = fs.createReadStream('./log.txt', 'utf-8');

const ip1 = '89.123.1.41';
const ip2 = '34.48.240.111';

const writeStreamCreater = (ip, newText) => {
    const writeStream = fs.createWriteStream(`./%${ip}%_requests.log`,  { flags: 'a', encoding: 'utf8' });
    writeStream.write(newText);
}

const findLog = (ip, chunk) => { 
    if (chunk.search(ip) > -1) {
        let idx = chunk.indexOf(ip);
        let arrIp = [];
        while (idx != -1) {
            arrIp.push(idx);
            idx = chunk.indexOf(ip, idx + 1);
        };

        for (let i = 0; i < arrIp.length; i++) {
            text = chunk.slice(arrIp[i]);
            const newText = text.slice(0, text.search(/\n/));
            writeStreamCreater(ip, '\n');
            writeStreamCreater(ip, newText);
        };
    };
 }

readStream.on('data', (chunk) => {
    findLog(ip1, chunk);
    findLog(ip2, chunk);
});

readStream.on('end', () => console.log('File reading finished'));
readStream.on('error', () => console.log(err));


