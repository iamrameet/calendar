/// <reference path="E:/library/dom.js"/>

/** @param {number} year */
function isLeapYear(year){
  if(year % 400 === 0)
    return true;
  if(year % 100 === 0)
    return false;
  if(year % 4 === 0)
    return true;
  return false;
}

/** @param {number} year */
function leapYearsTill(year){
  year--;
  return Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400);
}

/** @param {number} year */
function daysTillYear(year){
  return year * 365 + leapYearsTill(year);
}

/**
 * @param {number} month
 * @param {boolean} isLeapYear
 */
function daysTillMonth(month, isLeapYear){
  if(month < 2)
    return 0;
  if(month === 3)
    return (isLeapYear ? 29 : 28) + 31;
  if(month <= 8)
    return ((month % 2 === 0) ? 31 : 30) + daysTillMonth(month - 1, isLeapYear);
  return ((month % 2 === 0) ? 30 : 31) + daysTillMonth(month - 1, isLeapYear);
}

/**
 * @param {number} month
 * @param {boolean} isLeapYear
 */
function daysInMonth(month, isLeapYear){
  if(month === 2)
    return isLeapYear ? 29 : 28;
  if(month < 8)
    return (month % 2 === 0) ? 30 : 31;
  return (month % 2 === 0) ? 31 : 30;
}

/**
 * @param {number} date
 * @param {number} month
 * @param {number} year
 */
function daysTill(date, month, year){
  const isLeap = isLeapYear(year);
  return daysTillYear(year) + daysTillMonth(month, isLeap) + date - 1;
}

/**
 * @param {number} date
 * @param {number} month
 * @param {number} year
 */
function dayOfWeek(date, month, year){
  return daysTill(date, month, year) % 7;
}

/**
 * @param {number} month
 * @param {number} year
 */
function monthView(month, year, wrapAround = false){
  /** @type {number[][]} */
  const view = [];
  const weekDay = dayOfWeek(1, month, year);
  const lastDate = daysInMonth(month, isLeapYear(year));

  const maxWeek = wrapAround ? 5 : 6;
  let date = 1;
  let week = 0;
  for(; week < 5; week++){
    view[week] = [];
    for(let day = (week === 0) ? weekDay : 0; day < 7 && date <= lastDate; day++)
      view[week][day] = date++;
  }
  if(wrapAround){
    for(let day = 0; day < 7 && date <= lastDate; day++)
      view[0][day] = date++;
  }else{
    view[week] = [];
    for(let day = 0; day < 7 && date <= lastDate; day++)
      view[week][day] = date++;
  }
  // for(let day = weekDay; day < 7; day++)
  //   view[0][day] = date++;
  // let week = 1;
  // for(let day = 0; day < 7 && date <= lastDate; day++){
  //   view[week % 5][day] = date++;
  //   if(day === 6)
  //     week++;
  // }

  return view;
}

class Calendar{
  static monthsName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  static daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  static getCellId(date, month, year){
    return `cal-${date}-${month}-${year}`;
  }

  static createMonthTable(month, year){
    const view = monthView(month, year);
    view.unshift(this.daysName.map(day => day.substring(0, 3)));

    const table = DOM.create("table");
    table.createCaption().innerText = this.monthsName[month - 1];
    const tHead = table.createTHead();
    const tBody = table.createTBody();

    let w = 0;
    for(; w < 1; w++){
      const row = tHead.insertRow();
      for(let d = 0; d < 7; d++)
        row.appendChild(DOM.create("th", {text: view[w][d]}));
    }
    for(; w < 7; w++){
      const row = tBody.insertRow();
      for(let d = 0; d < 7; d++){
        DOM.attr(row.insertCell(), {
          text: view[w][d] ?? "",
          ...(view[w][d] === 0 ? {} : {id: this.getCellId(view[w][d], month, year)})
        });
      }
    }
    return table;
  }

  static createMonthTables(year){
    const tables = [];
    for(let m = 1; m < 13; m++)
      tables.push(this.createMonthTable(m, year));
    return tables;
  }
}

function main(){
  const [calendar] = DOM.class("calendar");
  const [caption] = DOM.class("caption");

  caption.innerText = 2022;

  const tables = Calendar.createMonthTables(2022);
  tables.forEach(table => calendar.appendChild(table));

  const today = new Date();
  const todayId = Calendar.getCellId(today.getDate(), today.getMonth() + 1, today.getFullYear());

  DOM.id(todayId)?.toggleAttribute("today", true);
}

addEventListener("load", main);