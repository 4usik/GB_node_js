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
