#!/usr/bin/env node

const fs = require("fs");
const http = require('http');
const path = require("path");

// получаем путь к директории, из которой запущена программа
const currentDirectory = process.cwd();

// функция для проверки является ли аргумент файлом
const isFile = fileName => {
    return fs.lstatSync(fileName).isFile();
};

// функция для рендеринга разметки
const createList = (directory) => {
    // получаем содержимое директории
    const list = fs.readdirSync(directory);

    const ul = list.map(el => {
        // let li;
        // if (!isFile(el)) {
        //     li = `<li><a href="${el}">${el}</a></li>`
        // } else {
        //     li = `<li>${el}</li>`
        // };
        return `<li><a href="${el}">${el}</a></li>`;
    });
    return ul;
    
};

// создаем http-сервер
const server = http.createServer((req, res) => {
    const newPath = path.join(currentDirectory, req.url);
    const list = createList(currentDirectory).join('');

    res.setHeader('Content-Type', 'text/html');
    res.write(`<h3>Current directory:`);
    res.write(`<h3>${newPath}</h3>`);
    res.write(`<ul>${list}<li><a href="#">Back</a></li></ul>`);
    res.end();
    
});

server.listen(3002, 'localhost', error => {
    error ? console.log(error) : console.log('Listening');
});
