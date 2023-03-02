#!/usr/bin/env node

const fs = require("fs");
const inquirer = require('inquirer');
const path = require("path");
const readline = require("readline");
const { Worker } = require('worker_threads');

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
            isFile(newPath) ? start({newPath, term}) : createInq(newPath, term);
            // isFile(newPath) ? createReadStream(newPath, term) : createInq(newPath, term);
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

function start(workerData) {
    return new Promise((res, rej) => {
        const worker = new Worker('./worker_hw4.js', { workerData });
        worker.on('message', res);
        worker.on('error', rej);
    })
}


