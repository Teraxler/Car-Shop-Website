"use strict";

// === DOM ===
function getElementByClass(className) {
  let elm = document.getElementsByClassName(className)[0];

  !elm ? console.error("Class:", className, "Is wrong!") : null;

  return elm;
}

function getAllElementsByClass(className) {
  let elms = [...document.getElementsByClassName(className)];

  !elms[0] ? console.error("Class:", className, "Is wrong!") : null;

  return elms;
}

function removeClass(className, elm = null) {
  if (elm) {
    elm.classList.remove(className);
  } else {
    let elms = document.getElementsByClassName(className);
    for (const elm of elms) {
      elm.classList.remove(className);
    }
  }
}

// Number
function numberSeparator(num) {
  let strNum = num.toString(),
    result = "";

  const len = strNum.length;

  for (let i = 1; i < len; i++) {
    result = strNum[len - i] + result;

    if (i % 3 === 0) {
      result = "," + result;
    }
  }

  return strNum[0] + result;
}

// URL
function normalizeUrl(url) {
  url = url.trim();

  while (url.includes(" ")) {
    url = url.replace(" ", "-");
  }

  return url;
}

// Filter
function filterPopularCars(cars) {
  return cars.filter((car) => car.isPopular);
}

// Find
function findBrandByName(brands, brandName) {
  return brands.find((brand) => brand.name === brandName);
}

function generateStarRatingClasses(score) {
  const starCount = 5;
  const activeStarClass = "text-[#E1C03F]";
  const inActiveStarClass = "text-gray-300";

  return Array(starCount)
    .fill(inActiveStarClass)
    .fill(activeStarClass, 0, Math.floor(score));
}

// Calculateor
function calcDiscount(price, percent) {
  percent =
    percent >= 0 && percent <= 100
      ? percent
      : percent > 100
      ? 100
      : percent < 0
      ? 0
      : null;

  return price - (price * percent) / 100;
}

// Date Time
function normalizeDateTime(dateTime) {
  const monthsNameMap = {
    1: "January",
    2: " February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  const year = dateTime.slice(0, 4);
  const month = dateTime.slice(5, 7);
  const day = dateTime.slice(8, 10);
  const hour = dateTime.slice(11, 13);
  const minute = dateTime.slice(14, 16);
  const second = dateTime.slice(17, 19);
  const monthName = monthsNameMap[Number(month)];

  return {
    year,
    month,
    monthName,
    day,
    hour,
    minute,
    second,
    date: `${year}/${month}/${day}`,
    time: `${hour}:${minute}:${second}`,
  };
}

class Timer {
  constructor(fn, time) {
    this.intervalID = setInterval(fn, time);
  }

  start(fn, time) {
    this.intervalID && this.stop();
    this.intervalID = setInterval(fn, time);
  }

  stop() {
    clearInterval(this.intervalID);
  }

  reset(fn, time) {
    this.stop();
    this.start(fn, time);
  }
}

export {
  getElementByClass,
  getAllElementsByClass,
  removeClass,
  numberSeparator,
  normalizeUrl,
  generateStarRatingClasses,
  calcDiscount,
  Timer,
  normalizeDateTime,
  filterPopularCars,
  findBrandByName,
};
