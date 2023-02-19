<<<<<<< HEAD
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


=======
const EventEmitter = require('events');
class Emitter extends EventEmitter {
    timer = (args) => {
        const {date, id} = args;
        this.emit('timer', {date, id});
    }
};

const emitter = new Emitter;

emitter.on('timer', (args) => {
    const {date, id} = args;
    timer(date, id);
});

// форматируем введенную дату
const formatDate= (date) => {
    const arr = date.split("-");
    const hours = arr[0];
    const days = arr[1];
    const months = arr[2];
    const years = arr[3];
    const newDate = `${years}-${months}-${days}T${hours}:00:00.000Z`;
    return newDate;
};

// вычисление остатка времени
function getTimeRemaining(endTime) {
    let days, hours, minutes, seconds;
    
    const t = Date.parse(formatDate(endTime)) - Date.parse(new Date());

    if (t <= 0) {
        days = 0;
        hours = 0;
        minutes = 0;
        seconds = 0;
    } else {
        days = Math.floor(t/(1000 * 60 * 60 * 24)),
        hours = Math.floor((t/(1000 * 60 * 60)) % 24),
        minutes = Math.floor((t/(1000 * 60)) % 60),
        seconds = Math.floor((t/1000) % 60);
    }

    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
};

// создание таймера
const timer = (date, i) => {

    const timeInterval = setInterval(() => {
        const {total, days, hours, minutes, seconds} = getTimeRemaining(date);

        console.log(`timer ${i-2}: is ${getZero(days)} days: ${getZero(hours)}:${getZero(minutes)}:${getZero(seconds)}`);

        if (total <= 0) {
            console.log(`timer ${i-2} is out`);
            clearInterval(timeInterval);
        }
    }, 1000);
};

// добавляем 0
function getZero(num) {
    if (num >= 0 && num < 10) {
        return `0${num}`;
    } else {
        return num;
    }
}

if (process.argv.length > 2) { 
    for (let i = 3; i <= process.argv.length; i++) {
        emitter.timer({date: process.argv[i-1], id: i});
    }
} else {
    console.log('No date');
}
>>>>>>> main
