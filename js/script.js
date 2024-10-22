'use strict';

// ссылки не элементы формы
// - название проекта
const title = document.getElementsByTagName('h1').title;
// - кнопка "+" под выпадающим списком
const buttonPlus = document.querySelector('.screen-btn');
//  - дополнительно: элемнеты-проценты и элемнеты-числa
const otherItemsPersent = [...document.querySelectorAll('.other-items.percent')];
const otherItemsNumber = [...document.querySelectorAll('.other-items.number')];

// - ранжированный ввод процента отката 
const inputRange = document.querySelector('.rollback input[type="range"]');
// - елемент отображения текущего значение процента отката 
const inputRangeValue = document.querySelector('.rollback span.range-value');

// - кнопка "Рассчитать" и "Сброс"
const startBtn = document.getElementsByClassName('handler_btn').start;
const btnReset = document.getElementsByClassName('handler_btn').reset;

// - елементы отображения итогов:
//   Cтоимость верстки
const total = document.getElementsByClassName('total-input').total;
//   Количество экранов
const totalCount = document.getElementsByClassName('total-input')["total-count"];
//   Стоимость доп. услуг
const totalCountOther = document.getElementsByClassName('total-input')["total-count-other"];
//   Итоговая стоимость
const fullTotalCount = document.getElementsByClassName('total-input')["total-full-count"];
//   Стоимость с учетом отката
const totalCountRollback = document.getElementsByClassName('total-input')["total-count-rollback"];

// - елементы экрана
let screens = [...document.querySelectorAll('.screen')];
// - блоки организации ввода исходных данных
const elsBlocksEdit = document.querySelectorAll('.main-controls__views:not(:has(div.rollback')

const appData = {
  title: '',
  screens: [],  // типы экранов для верстки: [{id,name,price},...]
  screenCount: 0, // количество экранов
  screenPrice: 0,  // стоимость верстки экранов
  adaptive: true,  // наличие адаптива
  rollback: 0,  // % скидки посредрнику
  servicePricesPersent: 0,  // стоимость доп.сервисов в процентах
  servicePricesNumber: 0,  // стоимость доп.сервисов в суммах
  fullPrice: 0,  // итого цена разработки сайта
  servicePercentPrice: 0,  // сумма разработчику без учета суммы посреднику
  servicesPercent: {},  // доп.сервисы: наименование-процент 
  servicesNumber: {},  // доп.сервисы: наименование-сумма 

  cloneScreen: screens[0].cloneNode(true),

  init: () => {
    appData.addTitle();
    appData.controlScreens();

    startBtn.addEventListener('click', appData.start)
    buttonPlus.addEventListener('click', appData.addScreenBlock)
    screens[0].parentElement.addEventListener('input', appData.controlScreens)
    screens[0].parentElement.addEventListener('click', appData.controlScreens)
    inputRange.addEventListener('input', appData.inputRange)
  },

  start: () => {
    appData.addScreens();
    appData.addServices();
    appData.addPrices();

    appData.showResult();
    appData.stop();
    //appData.logger();
  },
  stop: () => {
    startBtn.removeEventListener('click', appData.start);
    buttonPlus.removeEventListener('click', appData.addScreenBlock)
    screens[0].parentElement.removeEventListener('input', appData.controlScreens)
    screens[0].parentElement.removeEventListener('click', appData.controlScreens)

    startBtn.style.display = "none";
    elsBlocksEdit.forEach(el => el.style.zIndex = '-1')
  },

  addTitle: () => {
    document.title = title.textContent;
  },

  // ввод:
  addScreenBlock: () => {
    const cloneScreen = appData.cloneScreen.cloneNode(true);

    screens[screens.length - 1].after(cloneScreen);
    screens.push(cloneScreen);
  },
  controlScreens: () => {
    const isNumber = (str) => !isNaN(parseInt(str)) && isFinite(str) && Math.abs(+str).toFixed(0) === str;
    let disabled = false;

    for (const screen of screens) {
      const value = screen.querySelector('input').value.replaceAll(" ", "");
      screen.querySelector('input').value = value;

      if (disabled = !isNumber(value) || +value === 0 || +screen.querySelector('select').selectedIndex === 0) {
        break;
      }
    }
    if (disabled !== startBtn.disabled) {
      startBtn.disabled = disabled;
      startBtn.style.backgroundColor = disabled ? "darkgrey" : "";
      startBtn.style.cursor = disabled ? "default" : "";
    }
  },
  inputRange: (e) => {
    appData.rollback = +e.target.value;

    inputRangeValue.innerText = `${appData.rollback} %`;

    if (startBtn.style.display === "none") {
      appData.addSeervicePercentPrice();
      appData.showResultRollback();
    }
  },

  // расчет:
  addScreens: () => {
    screens.forEach((screen, index) => {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].textContent;

      appData.screens.push({
        id: index,
        name: selectName,
        count: +input.value,
        price: +select.value * +input.value
      });
    })
  },
  addServices: () => {
    otherItemsPersent.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      } else delete appData.servicesPercent[label.textContent];
    })

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      } else delete appData.servicesNumber[label.textContent];
    })
  },
  addPrices: () => {
    appData.screenPrice = appData.screens.reduce((sum, screen) => sum + screen.price, 0);
    appData.screenCount = appData.screens.reduce((count, screen) => count + screen.count, 0);

    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key];
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricesPersent += Math.round(appData.screenPrice * appData.servicesPercent[key] / 100);
    }
    appData.fullPrice = appData.screenPrice + appData.servicePricesPersent + appData.servicePricesNumber;
    appData.addSeervicePercentPrice();
  },
  addSeervicePercentPrice: () => {
    appData.servicePercentPrice = appData.fullPrice - Math.round(appData.fullPrice * appData.rollback / 100);
  },
  showResult: () => {
    total.value = appData.screenPrice;
    totalCount.value = appData.screenCount;
    totalCountOther.value = appData.servicePricesPersent + appData.servicePricesNumber;
    fullTotalCount.value = appData.fullPrice;
    appData.showResultRollback();
  },
  showResultRollback: () => {
    totalCountRollback.value = appData.servicePercentPrice;
  },

  logger: () => {
    console.log(appData.fullPrice);
    console.log(appData.servicePercentPrice);
    console.log(appData.screens);
  },
};

appData.init();
