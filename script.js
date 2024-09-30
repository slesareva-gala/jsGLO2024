'use strict';

const title = prompt("Как называется ваш проект?", "Сайт, Лендинг ... ")
  || "Разработка сайта";
const screens = prompt("Какие типы экранов нужно разработать?", "Простые, Сложные, Интерактивные")
  || "Разнообразные";
const screenPrice = parseInt(prompt("Сколько будет стоить данная работа?", 12000))
  || 12000;
const adaptive = confirm('Нужен ли адаптив на сайте?');
const service1 = prompt("Какой дополнительный тип услуги нужен?", "1. ")
  || "не указан";
const servicePrice1 = parseInt(prompt("Сколько это будет стоить?", 0))
  || 0;
const service2 = prompt("Какой дополнительный тип услуги нужен?", "2.")
  || "не указан";
const servicePrice2 = parseInt(prompt("Сколько это будет стоить?", 0))
  || 0;

let rollback = 10;
let fullPrice = screenPrice + servicePrice1 + servicePrice2;
let servicePercentPrice = Math.ceil(fullPrice * (100 - rollback) / 100);
let message = "Что то пошло не так";

if (fullPrice >= 30000) message = "Даем скидку в 10%";
else if (fullPrice >= 15000) message = "Даем скидку в 5%";
else if (fullPrice >= 0) message = "Скидка не предусмотрена";

console.log('title: ', typeof title, title);
console.log('fullPrice: ', typeof fullPrice);
console.log('adaptive: ', typeof adaptive);
console.log('длина screens: ', screens.length);
console.log(`Стоимость верстки экранов ${screenPrice} рублей/ долларов/гривен/юани`);
console.log(`Стоимость разработки сайта ${fullPrice} рублей/ долларов/гривен/юани`);
console.log('Типы экранов: ', screens.toLowerCase().split(", "));
console.log(`Сумма оплаты посреднику: ${fullPrice - servicePercentPrice}`);
console.log(`Сумма оплаты разработчику: ${servicePercentPrice}`);
console.log('message: ', message);