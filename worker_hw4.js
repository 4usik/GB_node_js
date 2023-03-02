const fs = require("fs");

const { workerData } = require('worker_threads');

const findLog = (term, chunk) => {

    if (chunk.search(term) > -1) {
        let idx = chunk.indexOf(term);
        let arrIp = [];
        while (idx != -1) {
            arrIp.push(idx);
            idx = chunk.indexOf(term, idx + 1);
        };

        for (let i = 0; i < arrIp.length; i++) {
            text = chunk.slice(arrIp[i]);
            const newText = text.slice(0, text.search(/\n/)) + `\n`;
            writeStreamCreater(term, newText);
        };
    } else {
        console.log('The term not found in choosed file');
        createReadStream('plug');
    };
};

// функция для создания отдельных файлов с логами по term
const writeStreamCreater = (term, newText) => {
    const writeStream = fs.createWriteStream(`./%${term}%_requests.log`,  { flags: 'a', encoding: 'utf8' });
    writeStream.write(newText);
};

// функция для создания потока для чтения
const createReadStream = (workerData) => {
    const {newPath, term} = workerData;
    // создаем поток
    const readStream = fs.createReadStream(newPath, 'utf-8');

    // получаем и обрабатываем chunk'и
    if (term) {
        readStream.on('data', (chunk) => {

            findLog(term, chunk);
        });
    }

    readStream.on('end', () => {
        console.log('File reading finished');
        process.exit(0);
    });
    readStream.on('error', () => {
        console.log('err');
        process.exit(1);
    });
    
};

createReadStream(workerData);
