'use strict';

let title;
let screens;
let screenPrice;
let adaptive;
let rollback = 10;
let allServicePrices;
let fullPrice;
let servicePercentPrice;
let service1;
let service2;

const isNumber = function (str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}

const rounded = (num, dec = 0) => +num.toFixed(dec);

const toMoney = (str) => rounded(Math.abs(+str));

const asking = function () {
  title = prompt("Как называется ваш проект?", "Сайт, Лендинг ... ")
    || "Разработка сайта";
  screens = prompt("Какие типы экранов нужно разработать?", "Простые, Сложные, Интерактивные")
    || "Разнообразные";

  do {
    screenPrice = prompt("Сколько будет стоить данная работа?", "0") || "0";
  } while (!isNumber(screenPrice));
  screenPrice = toMoney(screenPrice);

  adaptive = confirm('Нужен ли адаптив на сайте?');
}

const getTitle = str => str.trim()[0].toUpperCase() + str.trim().slice(1).toLowerCase();

const getAllServicePrices = function () {
  let sum = 0;

  for (let i = 0; i < 2; i++) {
    const service = (prompt("Какой дополнительный тип услуги нужен ?", `услуга ${i + 1} `) || `услуга ${i + 1}`).trim();
    let price;

    if (i === 0) service1 = service;
    else if (i === 1) service2 = service;

    do {
      price = prompt(`Сколько это будет стоить "${service}" ?`, "0") || "0";
    } while (!isNumber(price));
    sum += toMoney(price);
  }
  return sum;
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

const showTypeOf = function (varName, varSense) {
  console.log(varName + ": ", varSense, typeof varSense);
}

asking();
title = getTitle(title);
allServicePrices = getAllServicePrices();
fullPrice = getFullPrice(screenPrice, allServicePrices);
servicePercentPrice = getServicePercentPrices(fullPrice, rollback);

showTypeOf("title", title);
showTypeOf("screenPrice", screenPrice);
showTypeOf("allServicePrices", allServicePrices);
showTypeOf("fullPrice", fullPrice);
showTypeOf("adaptive", adaptive);

console.log('Типы экранов: ', screens.toLowerCase().split(", "));
console.log(getRollbackMessage(fullPrice));
console.log(`Сумма оплаты разработчику (без учета скидки): ${servicePercentPrice} рублей`);

