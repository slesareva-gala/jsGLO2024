'use strict';

let title = prompt("Как называется ваш проект?", "Сайт, Лендинг ... ")
  || "Разработка сайта";
let screens = prompt("Какие типы экранов нужно разработать?", "Простые, Сложные, Интерактивные")
  || "Разнообразные";
let screenPrice = parseInt(prompt("Сколько будет стоить данная работа?", 12000))
  || 12000;
let adaptive = confirm('Нужен ли адаптив на сайте?');
let service1 = prompt("Какой дополнительный тип услуги нужен?", "1. ")
  || "не указан";
let servicePrice1 = parseInt(prompt("Сколько это будет стоить?", 0))
  || 0;
let service2 = prompt("Какой дополнительный тип услуги нужен?", "2.")
  || "не указан";
let servicePrice2 = parseInt(prompt("Сколько это будет стоить?", 0))
  || 0;

let rollback = 10;

let allServicePrices, fullPrice, servicePercentPrice;

const getTitle = str => {
  str = str.trim();
  return str = str[0].toUpperCase() + str.slice(1).toLowerCase();
};

const getAllServicePrices = function (...prices) {
  return prices.reduce((sum, n) => sum + n, 0);
};

function getFullPrice(n1, n2) {
  return n1 + n2;
}

const getServicePercentPrices = (sum, percent) =>
  Math.ceil(sum * (100 - percent) / 100);

const getRollbackMessage = (cost) =>
  cost >= 30000 ? "Даем скидку в 10%"
    : cost >= 15000 ? "Даем скидку в 5%"
      : cost >= 0 ? "Скидка не предусмотрена"
        : "Что то пошло не так";

const showTypeOf = function (variable) {
  console.log(variable, typeof variable);
}

title = getTitle(title);
allServicePrices = getAllServicePrices(servicePrice1, servicePrice2);
fullPrice = getFullPrice(screenPrice, allServicePrices);
servicePercentPrice = getServicePercentPrices(fullPrice, rollback);

showTypeOf(title);
showTypeOf(fullPrice);
showTypeOf(adaptive);

console.log('Типы экранов: ', screens.toLowerCase().split(", "));
console.log(getRollbackMessage(fullPrice));
console.log(`Сумма оплаты разработчику (без учета скидки): ${servicePercentPrice} рублей`);

