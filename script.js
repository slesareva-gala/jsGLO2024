const title = "Калькуляция разработки сайта";
const screens = "Простые, Сложные, Интерактивные";
let screenPrice = 10;
let rollback = 10;
let fullPrice = 20000;
let adaptive = true;

console.log('title: ', typeof title);
console.log('fullPrice: ', typeof fullPrice);
console.log('adaptive: ', typeof adaptive);

console.log('длина screens: ', screens.length);

console.log(`Стоимость верстки экранов ${screenPrice} рублей/ долларов/гривен/юани`);
console.log(`Стоимость разработки сайта ${fullPrice} рублей/ долларов/гривен/юани`);

console.log(screens.toLowerCase().split(", "));

console.log(`Сумма оплаты посреднику за работу: ${fullPrice * (rollback / 100)}`);