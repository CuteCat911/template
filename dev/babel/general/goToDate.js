// GoToDate - ver 1.1.0

// Description
// * * * = * * *

// Функция конструктор позволяющая задавать отчет времени до определенной даты.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. container (обязательный) (тип string) - класс элемента контейнера. Необязателен если указан containerId.
// 2. containerId (обязательный) (тип string) - id элемента контейнера. Необязателен если указан container.
// 3. dateEnd (обязательный) (тип string) - дата, до которого времени должен вестить отчет. Записывается - (13.7.2025 14:5:37) или (13.07.2025 14:05:37).
// 4. mode (не обязательный) (тип string) - режим в котором будет работать плагин.
// 5. strIndent (необязательный) (тип string) - разделитель, который будет использоваться в режиме "string" (режим по умолчанию).
// 6. interval (необязательный) (тип number) - интервал времени, через которое будет происходить обновление записи. Задается в милисикундах (минимум 1000).
// 7. years (необязательный) (тип object) - объект с параметрами для настройки лет.
// 8. months (необязательный) (тип object) - объект с параметрами для настройки месяцев.
// 9. days (необязательный) (тип object) - объект с параметрами для настройки дней.
// 10. hours (необязательный) (тип object) - объект с параметрами для настройки часов.
// 11. minutes (необязательный) (тип object) - объект с параметрами для настройки минут.
// 12. seconds (необязательный) (тип object) - объект с параметрами для настройки секунд.

// Возможные значения параметра mode:
// 1. string - время будет выводиться одной строкой в главный контейнер
// 2. block - время и текст будут выводиться в разные контейнеры
// 3. blocks - время и текст будут выводиться в разные контейнеры, время будет выводится в два блока (если число будет меньше 100). В один блок десятки, в другой единицы.

// Возможные параметры для объектов years, months, days, hours, minutes и seconds:
// 1. active - отвечает за активность этого периода в ремени в отсчете.
// 2. timeBlockClass - класс элемента в который будет выводится время (элемент обязательно должен находится в главном контейнере).
// 3. textBlockClass - класс элемента в который будет выводится текст времени (элемент обязательно должен находится в главном контейнере).

// Пример объекта с параметрами:
// {
//   container: "js-time",
//   dateEnd: "18.03.2018 12:00:00",
//   strIndent: "-",
//   years: {
//     active: false
//   }
// };

// Описание функционала счетчика времени.
// Счетчик отсчета времени может работать в трех режимах.
// В режимие "string" работает параметр "strIndent", в остальных режимах он не работает. Так же в режими "string" не работют параметры "timeBlockClass" и "textBlockClass" у настроек периодов времени.
// При отключении какого-то одного из периодов времени, все периоды которые выше него тоже отключаться. Например, если у days параметр "active" будет false, то у months и years этот параметр тоже будет false.
// Это правило переопределяет значения параметра "active".

// * * * = * * *
// End Description

import {findFirstClass, findElemsClass} from "./find";
import {getAssociativeArrayLength} from "./getAssociativeArrayLength";

export let GoToDate = function(params) {

  if ((params.container && typeof params.container === "string" || params.containerId && typeof params.containerId === "string") && (params.dateEnd && typeof params.dateEnd === "string")) {

    let module = this;
    let moduleInfo = {
      container: {
        class: params.container ? params.container : null,
        id: params.containerId ? params.containerId : null,
        elem: null
      },
      options: {
        mode: "string",
        dateNow: null,
        dateEnd: params.dateEnd,
        daysInYear: null,
        diffDate: null,
        strIndent: ", ",
        interval: 1000,
        end: false
      },
      intervalsName: ["years", "months", "days", "hours", "minutes", "seconds"],
      intervals: {},
      texts: {
        years: ["лет", "год", "годa"],
        months: ["месяцев", "месяц", "месяцa"],
        days: ["дней", "день", "дня"],
        hours: ["часов", "час", "часа"],
        minutes: ["минут", "минута", "минуты"],
        seconds: ["секунд", "секунда", "секунды"]
      }
    };

    // Сокращение часто используемых частей объекта moduleInfo

    let containerInfo = moduleInfo.container;
    let options = moduleInfo.options;
    let intervalsName = moduleInfo.intervalsName;
    let intervals = moduleInfo.intervals;
    let texts = moduleInfo.texts;

    // End Сокращение часто используемых частей объекта moduleInfo

    // Вспомогательные функции

    let helpFunc = {
      getCurrentDate: function(str) {

        if (str && typeof str === "string") {

          let date = [];
          let globalTime = str.split(" ")[0].split(".");
          let localTime =  str.split(" ")[1].split(":");

          for (let item of [globalTime[2], globalTime[1], globalTime[0], localTime[0], localTime[1], localTime[2]]) {

            date.push(+item);

          }

          date = new Date(date[0], date[1] - 1, date[2], date[3], date[4], date[5]);

          return date;

        }

      },
      correctTime: function() {

        if (options.diffDate <= 0) {

          intervals[5].active = false;

        }

      },
      watchActive: function() {

        let lastActive;

        for (let i in intervals) {

          if (intervals[i].active == false) {

            lastActive = i;

          }

        }

        for (let i in intervals) {

          if (i < lastActive) {

            intervals[i].active = false;

          }

        }

      },
      leapYear: function(year) {

        if (year && typeof year === "number") {

          let days = 365;

          if (year % 4 == 0 && year % 100 != 0) {

            days = 366;

          }

          return days;

        }

      },
      reminderOfNumber: function(numb) {

        if (numb && (numb <= 0 || numb >= 0)) {

          let reminder = numb - Math.floor(numb);

          return reminder;

        }

      },
      findDozen: function(numb) {

        if (numb && (numb <= 0 || numb >= 0)) {

          let str = numb + "";
          let array = str.split("");
          let arrayLength = array.length;
          let dozen = array[arrayLength - 2];

          if (dozen) {

            return dozen;

          } else {

            return null;

          }

        }

      },
      selectText: function(text, info) {

        let mode = options.mode;

        if ((text && typeof text === "string") && (info && typeof info === "object")) {

          if (mode == "string") {

            info.text = info.time + " " + text;

          } else {

            info.text = text;

          }

        }

      }
    };

    // End Вспомогательные функции

    // Создание параметров интервалов

    module.createIntervals = function() {

      for (let i = 0; i < intervalsName.length; i++) {

        intervals[i] = {
          name: intervalsName[i],
          active: true,
          time: null,
          text: null,
          blocks: {
            time: {
              class: null,
              element: null
            },
            text: {
              class: null,
              element: null
            }
          }
        };

      }

    };

    // End Создание параметров интервалов

    // Функция установки дефолтных или пользовательских параметров

    module.setParams = function() {

      if (containerInfo.id) {

        containerInfo.elem = document.getElementById(containerInfo.id);

      } else if (containerInfo.class) {

        containerInfo.elem = findFirstClass(containerInfo.class, document);
      }

      if (params.mode && typeof params.mode === "string") {

        options.mode = params.mode;

      }

      if (params.strIndent && typeof params.strIndent === "string") {

        options.strIndent = params.strIndent;

      }

      if (params.interval && typeof params.interval === "number" && params.interval > 1000) {

        options.interval = Math.abs(params.interval);

      }

      for (let i in intervals) {

        let name = intervals[i].name;

        if (params[name]) {

          if (params[name].active == false) {

            intervals[i].active = params[name].active;

          }

          if (params[name].timeBlockClass && typeof params[name].timeBlockClass === "string") {

            intervals[i].blocks.time.class = params[name].timeBlockClass;

            if (options.mode == "block") {

              intervals[i].blocks.time.element = findFirstClass(params[name].timeBlockClass, container);

            } else if (options.mode == "blocks") {

              intervals[i].blocks.time.element = findElemsClass(params[name].timeBlockClass, container);

            }

          }

          if (params[name].textBlockClass && typeof params[name].textBlockClass === "string") {

            intervals[i].blocks.text.class = params[name].textBlockClass;
            intervals[i].blocks.text.element = findFirstClass(params[name].textBlockClass, container);

          }

        }

      }

      options.dateEnd = helpFunc.getCurrentDate(options.dateEnd);

    };

    // End Функция установки дефолтных или пользовательских параметров

    module.createIntervals();
    module.setParams();

    let container = containerInfo.elem;

    if (container) {

      // Установка параметров времени

      module.setTimeParams = function() {

        options.dateNow = new Date();
        options.diffDate = (options.dateEnd - options.dateNow) / 1000;
        options.daysInYear = helpFunc.leapYear(options.dateEnd.getFullYear());
        helpFunc.correctTime();
        helpFunc.watchActive();

      };

      // End Установка параметров времени

      // Вычисление оставшегося времени для каждого из периодов

      module.timeRemainder = function() {

        let years = intervals[0];
        let months = intervals[1];
        let days = intervals[2];
        let hours = intervals[3];
        let minutes = intervals[4];
        let seconds = intervals[5];
        let diffDate = options.diffDate;
        let totalDays = options.daysInYear;
        let reminderOfNumber = helpFunc.reminderOfNumber;

        if (years.active == true) {

          years.time = diffDate / (60 * 60 * 24 * totalDays);

        } else {

          years.time = 0;

        }

        if (months.active == true) {

          if (years.active == true) {

            months.time = reminderOfNumber(years.time) * 12;

          } else {

            months.time = diffDate / (60 * 60 * 24 * (totalDays / 12));

          }

        } else {

          months.time = 0;

        }

        if (days.active == true) {

          if (months.active == true) {

            days.time = reminderOfNumber(months.time) * (totalDays / 12);

          } else {

            days.time = diffDate / (60 * 60 * 24);

          }

        } else {

          days.time = 0;

        }

        if (hours.active == true) {

          if (days.active == true) {

            hours.time = reminderOfNumber(days.time) * 24;

          } else {

            hours.time = diffDate / (60 * 60);

          }

        } else {

          hours.time = 0;

        }

        if (minutes.active == true) {

          if (hours.active == true) {

            minutes.time = reminderOfNumber(hours.time) * 60;

          } else {

            minutes.time = diffDate / 60;

          }

        } else {

          minutes.time = 0;

        }

        if (seconds.active == true) {

          if (minutes.active == true) {

            seconds.time = reminderOfNumber(minutes.time) * 60;

          } else {

            seconds.time = diffDate;

          }

        } else {

          seconds.time = 0;

        }

        for (let item of [years, months, days, hours, minutes, seconds]) {

          item.time = parseInt(item.time);

        }

      };

      // End Вычисление оставшегося времени для каждого из периодов

      // Установка корректного текста для времени

      module.setText = function() {

        for (let i in intervals) {

          let info = intervals[i];
          let textArray = texts[info.name];
          let unit = info.time % 10;
          let dozen = helpFunc.findDozen(info.time);
          let selectText = helpFunc.selectText;

          if (dozen == 1) {

            selectText(textArray[0], info);

          } else {

            if (unit == 1) {

              selectText(textArray[1], info);

            } else if (unit == 2 || unit == 3 || unit == 4) {

              selectText(textArray[2], info);

            } else if (unit == 0 || unit == 5 || unit == 6 || unit == 7 || unit == 8 || unit == 9) {

              selectText(textArray[0], info);

            }

          }

        }

      };

      // End Установка корректного текста для времени

      // Вывод значений для периодов времени

      module.output = function() {

        let textArray = [];
        let totalText;
        let mode = options.mode;

        for (let i in intervals) {

          let info = intervals[i];
          let time = info.time;
          let text = info.text;
          let timeBlock = info.blocks.time.element;
          let textBlock = info.blocks.text.element;
          let outputParams = function() {

            if (mode == "string") {

              textArray.push(text);

            } else if (mode == "block") {

              if (timeBlock) {

                timeBlock.innerText = time;

              }

              if (textBlock) {

                textBlock.innerText = text;

              }

            } else if (mode == "blocks") {

              let strTime = time + "";

              if (textBlock) {

                textBlock.innerText = text;

              }

              if (timeBlock.length > 0) {

                let block1 = timeBlock[0];
                let block2 = timeBlock[1];

                if (strTime.length > 2) {

                  if (timeBlock.length == 1) {

                    block1.innerText = time;

                  } else {

                    if (block1) {

                      block1.innerText = time;

                    }

                    if (block2) {

                      block2.style.display = "none";

                    }

                  }

                } else {

                  let unit = time % 10;
                  let dozen = helpFunc.findDozen(time);

                  if (!dozen) {

                    dozen = 0;

                  }

                  if (block2) {

                    if (window.getComputedStyle(block2).display == "none") {

                      block2.style.display = "";

                    }

                  }

                  if (timeBlock.length == 1) {

                    block1.innerText = time;

                  } else {

                    block1.innerText = dozen;
                    block2.innerText = unit;

                  }

                }

              }

            }

          };

          if (info.active == true) {

            outputParams();

          } else {

            if (options.end == false) {

              outputParams();

            }

          }

        }

        if (mode == "string" && options.end == false) {

          totalText = textArray.join(options.strIndent);
          container.innerText = totalText;

        }

        if (options.diffDate <= 0) {

          options.end = true;

        }

      };

      // End Вывод значений для периодов времени

      // Обновление данных на странице через определенный интервал времени

      module.repeat = function() {

        if (!options.diffDate <= 0) {

          module.setTimeParams();
          module.timeRemainder();
          module.setText();
          module.output();
          setTimeout(module.repeat, options.interval);

        }

      };

      // End Обновление данных на странице через определенный интервал времени

      module.setTimeParams();
      module.timeRemainder();
      module.setText();
      module.output();
      setTimeout(module.repeat, options.interval);

    } else {

      console.error();

    }

  } else {

    console.error();

  }

};