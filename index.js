const colors = require("colors/safe");

const arr = [];

if ((+process.argv[3] % 1) !== 0 || (+process.argv[2] % 1) !== 0) {
    console.log('Error');
} else {
    if (+process.argv[3] >= +process.argv[2]) {
        nextPrime:
        for (let i = +process.argv[2]; i <= process.argv[3]; i++) {

            for (let j = 2; j < i ; j++) {
                if (i % j === 0) continue nextPrime;
            }
            arr.push(i);
        }
    } else {
        nextPrime:
        for (let i = +process.argv[3]; i <= process.argv[2]; i++) {

            for (let j = 2; j < i ; j++) {
                if (i % j === 0) continue nextPrime;
            }
            arr.push(i);
        }
    };

    switch (arr.length) {
        case 0:
            console.log(colors.red('В указанном диапазоне нет простых чисел'))
            break;
        case 1:
            console.log(colors.green(arr[0]));
            break;
        case 2:
            console.log(colors.green(arr[0]));
            console.log(colors.yellow(arr[1]));
            break;
        default:
            console.log(colors.green(arr[0]));
            console.log(colors.yellow(arr[1]));
            console.log(colors.red(arr[2]));
            break;
    };

}




