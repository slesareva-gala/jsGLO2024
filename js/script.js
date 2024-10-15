'use strict';

// ссылки не элементы формы
// - название проекта
const elTitle = document.getElementsByTagName('h1').title;
// - кнопка "Рассчитать" и "Сброс"
const btnStart = document.getElementsByClassName('handler_btn').start;
const btnReset = document.getElementsByClassName('handler_btn').reset;
// - кнопка "+" под выпадающим списком
const btnPlus = document.querySelector('.screen-btn');
//  - дополнительно: элемнеты-проценты и элемнеты-числa
const elsPersent = [...document.querySelectorAll('.other-items.percent')];
const elsNumber = [...document.querySelectorAll('.other-items.number')];
// - ранжированный ввод процента отката 
const elInputRollback = document.querySelector('.rollback input[type="range"]');
// - елемент отображения текущего значение процента отката 
const elValueRollback = document.querySelector('.rollback span.range-value');
// - елементы отображения итогов:
//   Cтоимость верстки
const total = document.getElementsByClassName('total-input').total;
//   Количество экранов
const totalCount = document.getElementsByClassName('total-input')["total-count"];
//   Стоимость доп. услуг
const totalCountOther = document.getElementsByClassName('total-input')["total-count-other"];
//   Итоговая стоимость
const totalFullCount = document.getElementsByClassName('total-input')["total-full-count"];
//   Стоимость с учетом отката
const totalCountRollback = document.getElementsByClassName('total-input')["total-count-rgitollback"];

// - елементы экрана
let elsScreens = document.querySelectorAll('.screen');

// для проверки, так же закоментировала appData.asking() и appData.logger()
console.log('1)', 'elTitle', elTitle);
console.log('2.1)', 'btnStart', btnStart);
console.log('2.2)', 'btnReset', btnReset);
console.log('3)', 'btnPlus', btnPlus);
console.log('4.1)', 'elsPersent', elsPersent);
console.log('4.2)', 'elsNumber', elsNumber);
console.log('5)', 'elInputRollback', elInputRollback);
console.log('6)', 'elValueRollback', elValueRollback);
console.log('7.1)', 'total: ', total);
console.log('7.2)', 'totalCount: ', totalCount);
console.log('7.3)', 'totalCountOther: ', totalCountOther);
console.log('7.4)', 'totalFullCount: ', totalFullCount);
console.log('7.5)', 'totalCountRollback: ', totalCountRollback);
console.log('8)', 'elsScreens', elsScreens);

const appData = {
  title: '',
  screens: [],  // типы экранов для верстки: [{id,name,price},...]
  screenPrice: 0,  // стоимость верстки экранов
  adaptive: true,  // наличие адаптива
  rollback: 10,  // % скидки посредрнику
  allServicePrices: 0,  // стоимость доп.сервисов
  fullPrice: 0,  // итого цена разработки сайта
  servicePercentPrice: 0,  // сумма разработчику без учета скидки и суммы посреднику
  services: {},  // доп.сервисы: наименование-сумма 

  isNumber: (str) => !isNaN(parseInt(str)) && isFinite(str) && Math.abs(+str).toFixed(0) === str,
  isString: (str) => typeof (str) === "string" && str.trim() !== "" && !appData.isNumber(str.replaceAll(" ", "")),
  inputString: (title, str = "") => {
    do {
      str = (prompt(title, str) || "").replace(/[  ]+/g, " ").trim();
    } while (!appData.isString(str));
    return str;
  },
  inputNumber: (title, str) => {
    do {
      str = !str ? "0" : str.replaceAll(" ", "");
      str = prompt(title, str);
    } while (!appData.isNumber(str));
    return +str;
  },

  start: () => {
    //appData.asking();
    appData.addPrices();
    appData.getFullPrice();
    appData.getServicePercentPrices();
    appData.getTitle();

    //appData.logger();
  },

  asking: () => {

    appData.title = appData.inputString("Как называется ваш проект?", "Калькулятор верстки");

    for (let i = 0; i < 2; i++) {
      const name = appData.inputString(`Какой тип экрана № ${i + 1} нужно разработать ?`, `тип экрана ${i + 1}`);
      const price = appData.inputNumber(`Сколько это будет стоить данная работа: "${name}" ?`);

      appData.screens.push({ id: i, name: name, price: price });
    }

    for (let i = 0; i < 2; i++) {
      let name = appData.inputString(`Какой дополнительный тип услуги № ${i + 1} нужен ?`, `услуга ${i + 1}`);
      if (name in appData.services) name += `(${i})`;
      appData.services[name] = appData.inputNumber(`Сколько "${name}" будет стоить ?`);
    }

    appData.adaptive = confirm('Нужен ли адаптив на сайте?');
  },

  addPrices: () => {

    appData.screenPrice = appData.screens.reduce((sum, screen) => sum + screen.price, 0);

    for (let key in appData.services) {
      appData.allServicePrices += appData.services[key];
    }
  },

  getFullPrice: () => {
    appData.fullPrice = appData.screenPrice + appData.allServicePrices;
  },

  getServicePercentPrices: () => {
    appData.servicePercentPrice = appData.fullPrice - Math.round(appData.fullPrice * appData.rollback / 100);
  },

  getTitle: () => {
    appData.title = (appData.title.trim()[0] || '').toUpperCase() + appData.title.trim().slice(1).toLowerCase();
  },

  getRollbackMessage: (cost) =>
    cost >= 30000 ? "Даем скидку в 10%"
      : cost >= 15000 ? "Даем скидку в 5%"
        : cost >= 0 ? "Скидка не предусмотрена"
          : "Что то пошло не так",

  logger: () => {
    console.log(appData.fullPrice);
    console.log(appData.servicePercentPrice);
    console.log(appData.screens);
  },
};

appData.start();
