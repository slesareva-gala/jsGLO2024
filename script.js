'use strict';

const appData = {
  title: '',
  screens: '',  // типы экранов для верстки
  screenPrice: 0,  // стоимость верстки экранов
  adaptive: true,  // наличие адаптива
  rollback: 10,  // % скидки посредрнику
  allServicePrices: 0,  // стоимость доп.сервисов
  fullPrice: 0,  // итого цена разработки сайта
  servicePercentPrice: 0,  // сумма разработчику без учета скидки и суммы посреднику
  service1: '',  // описание доп.сервиса 1
  service2: '',  // описание доп.сервиса 2

  isNumber: (str) => !isNaN(parseFloat(str)) && isFinite(str),

  toMoney: (str) => +Math.abs(+str).toFixed(2),

  start: () => {
    appData.asking();
    appData.title = appData.getTitle();
    appData.allServicePrices = appData.getAllServicePrices();
    appData.fullPrice = appData.getFullPrice();
    appData.servicePercentPrice = appData.getServicePercentPrices();

    appData.logger();
  },

  asking: () => {
    appData.title = prompt("Как называется ваш проект?", "Сайт, Лендинг ... ")
      || "Разработка сайта";
    appData.screens = prompt("Какие типы экранов нужно разработать?", "Простые, Сложные, Интерактивные")
      || "";

    do {
      appData.screenPrice = prompt("Сколько будет стоить данная работа?", "0") || "0";
    } while (!appData.isNumber(appData.screenPrice));
    appData.screenPrice = appData.toMoney(appData.screenPrice);

    appData.adaptive = confirm('Нужен ли адаптив на сайте?');
  },

  getTitle: () => appData.title.trim()[0].toUpperCase() + appData.title.trim().slice(1).toLowerCase(),

  getAllServicePrices: () => {
    let sum = 0;

    for (let i = 0; i < 2; i++) {
      const service = (prompt("Какой дополнительный тип услуги нужен ?", `услуга ${i + 1} `) || `услуга ${i + 1}`).trim();
      let price;

      appData['service' + (i + 1)] = service;

      do {
        price = prompt(`Сколько это будет стоить "${service}" ?`, "0") || "0";
      } while (!appData.isNumber(price));
      sum += appData.toMoney(price);
    }

    return sum;
  },

  getFullPrice: () => appData.screenPrice + appData.allServicePrices,

  getServicePercentPrices: () => appData.fullPrice - appData.toMoney(appData.fullPrice * appData.rollback / 100),

  getRollbackMessage: (cost) =>
    cost >= 30000 ? "Даем скидку в 10%"
      : cost >= 15000 ? "Даем скидку в 5%"
        : cost >= 0 ? "Скидка не предусмотрена"
          : "Что то пошло не так",

  logger: () => {
    for (let key in appData) {
      console.log(key + ':', appData[key]);
    }
  },
};

appData.start();
