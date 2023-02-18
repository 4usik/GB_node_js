const fs = require('fs');

const readStream = fs.createReadStream('./log.txt', 'utf-8');

const ip1 = '89.123.1.41';
const ip2 = '34.48.240.111';
const writeStreamIp1 = fs.createWriteStream(`./%${ip1}%_requests.log`,  { flags: 'a', encoding: 'utf8' });
const writeStreamIp2 = fs.createWriteStream(`./%${ip2}%_requests.log`,  { flags: 'a', encoding: 'utf8' });

readStream.on('data', (chunk) => {
    if (chunk.search(ip1) > -1) {
        let idx = chunk.indexOf(ip1);
        let arrIp = [];
        while (idx != -1) {
            arrIp.push(idx);
            idx = chunk.indexOf(ip1, idx + 1);
        };

        for (let i = 0; i < arrIp.length; i++) {
            text = chunk.slice(arrIp[i]);
            const newText = text.slice(0, text.search(/\n/));
            writeStreamIp1.write('\n');
            writeStreamIp1.write(newText);
        };
    };

    if (chunk.search(ip2) > -1) {
        let idx = chunk.indexOf(ip2);
        let arrIp = [];
        while (idx != -1) {
            arrIp.push(idx);
            idx = chunk.indexOf(ip2, idx + 1);
        };
        console.log(arrIp.length);

        for (let i = 0; i < arrIp.length; i++) {
            text = chunk.slice(arrIp[i]);
            const newText = text.slice(0, text.search(/\n/));
            writeStreamIp2.write('\n');
            writeStreamIp2.write(newText);
        };
    };
    
});

readStream.on('end', () => console.log('File reading finished'));
readStream.on('error', () => console.log(err));


