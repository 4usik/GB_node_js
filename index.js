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

    const list = fs.readdirSync(directory);
    const ul = list.map(el => `<li><a href="${el}">${el}</a></li>`);
    return ul.join('');  
};

// создаем http-сервер
const server = http.createServer((req, res) => {
    const newPath = path.join(currentDirectory, req.url);

    res.setHeader('Content-Type', 'text/html');
    
    text = isFile(newPath) ?
    (fs.readFileSync(`${newPath}`, "utf8"))
    :
    (`<ul>${createList(newPath)}<li><a href="#">Back</a></li></ul>`);

    res.end(text);
    
});

// слушаем сервер
server.listen(3002, 'localhost', error => {
    error ? console.log(error) : console.log('Listening');
});



