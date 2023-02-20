#!/usr/bin/env node

const fs = require("fs");
const inquirer = require('inquirer');
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ip1 = '89.123.1.41';
const ip2 = '34.48.240.111';

// функция для проверки является ли аргумент файлом
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
};

// получаем путь к директории, из которой запущена программа
const currentDirectory = process.cwd();

// функция для поиска строки в файле
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
            const newText = text.slice(0, text.search(/\n/));
            writeStreamCreater(term, '\n');
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

// функция для создания потка для чтения
const createReadStream = (fileName, term) => {
    // создаем поток
    const readStream = fs.createReadStream(fileName, 'utf-8');

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

// функция для просмотра и выбора содержимого директории
const createInq = (currentDirectory, term) => {
    // получаем содержимое директории
    const list = fs.readdirSync(currentDirectory);
 
    inquirer
        .prompt([{
            name: "fileName",
            type: "list",
            message: "Choose file:",
            choices: list,
            }])
        .then((answer) => {
            // получаем полный путь к файлу
            const newPath = path.join(currentDirectory, answer.fileName);

            // читаем, если файл - строим список, если директория
            isFile(newPath) ? createReadStream(newPath, term) : createInq(newPath, term);
        });

};

console.log('currentDirectory', currentDirectory);

rl.question("Please enter the path to the file or press enter, if the current dir contain the file: ",
    function(inputedPath = currentDirectory) {

    rl.question("Please enter the term for search: ", function(inputedTerm) {

        if (!inputedTerm) {
            console.log('The term is null');
            process.exit(1);
        };

        if (inputedPath) {
            createInq(inputedPath, inputedTerm);
        } else {
            createInq(currentDirectory, inputedTerm);
        };

    });    
});

rl.on("close", function() {
    process.exit(0);
});

