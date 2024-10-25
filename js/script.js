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
const resetBtn = document.getElementsByClassName('handler_btn').reset;

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

  init: function () {
    this.addTitle();
    this.controlScreens();

    startBtn.addEventListener('click', () => this.start())
    resetBtn.addEventListener('click', () => this.reset())
    buttonPlus.addEventListener('click', () => this.addScreenBlock())
    screens[0].parentElement.addEventListener('input', () => this.controlScreens())
    screens[0].parentElement.addEventListener('click', () => this.controlScreens())
    inputRange.addEventListener('input', (e) => this.inputRange(e))
  },

  start: function () {
    this.addScreens();
    this.addServices();

    this.addPrices();
    this.showResult();

    this.statusSwitch(false);
    //this.logger();
  },

  reset: function () {
    this.clrScreens();
    this.clrServices();
    this.clrRollback();

    this.addPrices();
    this.showResult();

    this.statusSwitch(true);
    this.controlScreens();


    // this.logger();
  },

  statusSwitch: function (on) {
    startBtn.style.display = on ? "" : "none";

    elsBlocksEdit.forEach(block => {
      block.querySelectorAll('input[type=text]:not(input[value]), input[type=checkbox], select, button')
        .forEach(el => {
          el.disabled = !on;

          if (on) {
            switch (el.localName) {
              case 'input':
                if (el.type === 'checkbox') el.checked = false;
                else el.value = "";
                break;
              case 'select':
                el.selectedIndex = 0
                break;
            }
          }
        })
      block.style.filter = on ? "" : 'grayscale(1)';
    })

    resetBtn.style.display = on ? "none" : "";
  },

  addTitle: function () {
    document.title = title.textContent;
  },

  // ввод:
  addScreenBlock: function () {
    const cloneScreen = this.cloneScreen.cloneNode(true);

    screens[screens.length - 1].after(cloneScreen);
    screens.push(cloneScreen);
  },

  controlScreens: function () {
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

  inputRange: function (e) {

    this.rollback = +e.target.value;

    inputRangeValue.innerText = `${this.rollback} %`;

    if (startBtn.style.display === "none") {
      this.addSeervicePercentPrice();
      this.showResultRollback();
    }
  },

  // сбор данных для расчета:
  addScreens: function () {
    screens.forEach((screen, index) => {
      const select = screen.querySelector('select')
      const input = screen.querySelector('input')
      const selectName = select.options[select.selectedIndex].textContent;

      this.screens.push({
        id: index,
        name: selectName,
        count: +input.value,
        price: +select.value * +input.value
      });
    })
  },

  addServices: function () {
    otherItemsPersent.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) this.servicesPercent[label.textContent] = +input.value;
    })

    otherItemsNumber.forEach((item) => {
      const check = item.querySelector('input[type=checkbox]')
      const label = item.querySelector('label')
      const input = item.querySelector('input[type=text]')

      if (check.checked) this.servicesNumber[label.textContent] = +input.value;
    })
  },

  // сброс (обнуление) данных для расчета::
  clrScreens: function () {
    this.screens.length = 0;
    screens.splice(1).forEach(el => el.remove())
  },
  clrServices: function () {
    this.screens.length = 0;
    screens.splice(1).forEach(el => el.remove())
    Object.keys(this.servicesPercent).forEach(key => delete this.servicesPercent[key]);
    Object.keys(this.servicesNumber).forEach(key => delete this.servicesNumber[key]);
  },
  clrRollback: function () {
    this.rollback = 0;
    inputRange.value = 0;
    inputRangeValue.innerText = '0 %';
  },

  // расчет:
  addPrices: function () {
    this.screenPrice = this.screens.reduce((sum, screen) => sum + screen.price, 0);
    this.screenCount = this.screens.reduce((count, screen) => count + screen.count, 0);

    this.servicePricesNumber = 0;
    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    this.servicePricesPersent = 0;
    for (let key in this.servicesPercent) {
      this.servicePricesPersent += Math.round(this.screenPrice * this.servicesPercent[key] / 100);
    }
    this.fullPrice = this.screenPrice + this.servicePricesPersent + this.servicePricesNumber;
    this.addSeervicePercentPrice();
  },
  addSeervicePercentPrice: function () {
    this.servicePercentPrice = this.fullPrice - Math.round(this.fullPrice * this.rollback / 100);
  },

  // вывод результатов
  showResult: function () {
    total.value = this.screenPrice;
    totalCount.value = this.screenCount;
    totalCountOther.value = this.servicePricesPersent + this.servicePricesNumber;
    fullTotalCount.value = this.fullPrice;
    this.showResultRollback();
  },

  showResultRollback: function () {
    totalCountRollback.value = this.servicePercentPrice;
  },

  logger: function () {
    console.log(this.fullPrice);
    console.log(this.servicePercentPrice);
    console.log(this.screens);
  },
};

appData.init();
