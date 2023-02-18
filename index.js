const EventEmitter = require('events');
class Emitter extends EventEmitter {
    timer = (args) => {
        const {time, id} = args;
        this.emit('timer', {time, id});
    }
};

const emitter = new Emitter;

emitter.on('timer', (args) => {
    const {time, id} = args;
    const total = toSec(time);
    timer(total, id);
});

// функция для перевода аргументов в секунды
const toSec = (arg) => {
    const arr = arg.split("-");
    const hours = +arr[0] || 0;
    const days = +arr[1] || 0;
    const months = +arr[2] || 0;
    const years = +arr[3] || 0;
    const total = 60 * 60 * (hours + 24 * (days + 30 * (months + years * 12)));

    return total;
};

// создание таймера
const timer = (total, i) => {
    let t = total;
    const timeInterval = setInterval(() => {
        if (t > 0) {
            t--;
            console.log(`timer ${i-2} is ${t}`);
        } else {
            console.log(`timer ${i-2} is out`);
            clearInterval(timeInterval);
        }
    }, 1000);
};

if (process.argv.length > 2) { 
    for (let i = 3; i <= process.argv.length; i++) {
        emitter.timer({time: process.argv[i-1], id: i});
    }
}
