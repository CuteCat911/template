// GoToSection - ver 1.0.0

// Description
// * * * = * * *

// функция конструктор реализующая якорьную систему на странице.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. pointers (обязательный) (тип string) - класс элементов, которые будут играть роль якорей.
// 2. sections (обязательный) (тип string) - класс элементов, которые будут играть роль секций.
// 3. dynamic (не обязательный) (тип boolean) - включает или выключает работу с динамическими элементами (подгружаемые ajax-ом).
// 4. fps (не обязательный) (тип number) - количество кадров во время прокрутки страницы.
// 5. speed (не обязательный) (тип number) - скорость прокрутки страницы.
// 6. headerClass (не обязательный) (тип string) - класс шапки, используется для корректной работы с фиксированными шапками.
// 7. headerMode (не обязательный) (тип string) - режим в котором работает шапка.
// 8. headerMinWidth (не обязательный) (тип number) - минимальный размер экрана, при котором нужно учитвать высоту шапки при скролле до секции.

// Возможные значения параметра headerMode:
// 1. default - стандартное значение, стоит по-умолчанию, высота шапки не будет учитываться.
// 2. absolute - указывается при абсолютно спозиционированной шапке, высота шапки не будет учитываться
// 3. fixing - указывается при фиксированной шапке, высота шапки будет учитываться всегда.
// 4. lurking - указывается при фиксированной шапке, которая при скролле вниз скрывается, при скролле вверх появляется, высота шапки будет учитываться в зависимости от того в какую сторону мы скролим страницу.

// Пример объекта с параметрами:
// {
//     pointers: "js-nav",
//     sections: "section",
//     headerMode: "lurking",
//     headerClass: "sticky-header"
// };

// Доступные атрибуты:
// 1. data-section-name - содержит название секции, к которой нужно проскролить страницу (обязателен для pointers и sections).

// Доступные методы:
// 1. afterScroll - отработает после того как страница просскролиться до секции.
// Принимает в себя функцию или массив функций, которые будут выполнены.
// 2. beforeScroll - отработает до того как страница просскролиться до секции.
// Принимает в себя функцию или массив функций, которые будут выполнены.
// 3. goToSection - проскролит страницу до указанной секции.

// Описание функционала якорьной системы.
// Может совместно работать с плагином StickyHeader, так и просто с стилизованными шапками.
// У кажого якоря и секции должен быть обязателен атрибут data-section-name, где записано название.

// * * * = * * *
// End Description

import {findElemsClass, findFirstClass} from "./find";
import {findCurrentParent} from "./find-current-parent";
import {getWindowScroll, scrollTo} from "./window-scroll";

export let GoToSection = function(params) {

  if ((params.pointers && typeof params.pointers === "string") && (params.sections && typeof params.sections === "string")) {

    let module = this;
    let moduleInfo = {
      pointer: {
        class: params.pointers,
        elems: findElemsClass(params.pointers, document)
      },
      section: {
        class: params.sections,
        elems: findElemsClass(params.sections, document)
      },
      header: {
        class: null,
        mode: "default",
        elem: null,
        minWidth: null
      },
      options: {
        dynamic: false,
        fps: 60,
        speed: 1.5
      },
      funcs: {
        after: [],
        before: []
      }
    };
    let dataAttr = {
      sectionName: "data-section-name"
    };

    // Сокращение часто используемых частей объекта moduleInfo

    let pointer = moduleInfo.pointer;
    let section = moduleInfo.section;
    let header = moduleInfo.header;
    let options = moduleInfo.options;
    let funcs = moduleInfo.funcs;

    // End Сокращение часто используемых частей объекта moduleInfo

    // Вспомогательные функции

    let helpFunc = {
      findSectionName: function(elem) { // функция нахождения названия секции

        if (elem && typeof elem === "object") {

          let name = elem.getAttribute(dataAttr.sectionName);

          if (name) {

            return name;

          } else {

            return false;

          }

        }

      },
      addFunc: function(func, nameArray) { // Функция, позволяющая записывать в массив функцию или массив с функциями

        if (func && (nameArray && typeof nameArray === "string")) {

          if (typeof func === "function") {

            funcs[nameArray].push(func);

          } else if (typeof func === "object") {

            for (let item of func) {

              if (typeof item === "function") {

                funcs[nameArray].push(item);

              }

            }

          }

        }

      },
      applyFunc: function(nameArray) { // Функция, позволяющая пробегаться по массиву с функциями и выполнять каждую из них.

        if (funcs[nameArray].length > 0) {

          for (let item of funcs[nameArray]) {

            item();

          }

        }

      }
    };

    // End Вспомогательные функции

    // Функция, которая записывает функцию или массив с функциями и которые будут выполены после скролла страницы до секции

    module.afterScroll = function(func) {

      helpfunc.addFunc(func, "after");

    };

    // End Функция, которая записывает функцию или массив с функциями и которые будут выполены после скролла страницы до секции

    // Функция выполения функций в массиве после скролла страницы до секции

    module.applyAfterScroll = function() {

      helpFunc.applyFunc("after");

    };

    // End Функция выполения функций в массиве после скролла страницы до секции

    // Функция, которая записывает функцию или массив с функциями и которые будут выполены до скролла страницы к секции

    module.beforeScroll = function(func) {

      helpfunc.addFunc(func, "before");

    };

    // End Функция, которая записывает функцию или массив с функциями и которые будут выполены до скролла страницы к секции

    // Функция выполения функций в массиве до скролла страницы к секции

    module.applyBeforeScroll = function() {

      helpFunc.applyFunc("before");

    };

    // End Функция выполения функций в массиве до скролла страницы к секции

    // Функция установки дефолтных или пользовательских параметров

    module.setParams = function() {

      if (params.dynamic == true) {

        options.dynamic = params.dynamic;

      }

      for (let item of ["fps", "speed"]) {

        if (params[item] && typeof params[item] === "number") {

          options[item] = Math.abs(params[item]);

        }

      }

      if (params.headerClass && typeof params.headerClass === "string") {

        header.class = params.headerClass;

      }

      if (params.headerMode && typeof params.headerMode === "string") {

        header.mode = params.headerMode;

      }

      if (params.headerMinWidth && typeof params.headerMinWidth === "number") {

        header.minWidth = Math.abs(params.headerMinWidth);

      }

    };

    // End Функция установки дефолтных или пользовательских параметров

    // Функция нахождения шапки на странице

    module.findHeader = function() {

      if (header.class && typeof header.class === "string") {

        header.elem = findFirstClass(header.class, document);

      };

    };

    // End Функция нахождения шапки на странице

    // Функция скролла страницы к указанной секции

    module.goToSection = function(sectionName) {

      if (sectionName && typeof sectionName === "string") {

        let top = 0;
        let scroll = getWindowScroll();

        for (let section of section.elems) {

          if (section.getAttribute(dataAttr.sectionName) == sectionName) {

            let applyScrollTo = function(coord, fps, speed, calibration) {

              let params = {
                position: coord,
                fps: fps,
                speed: speed
              };

              if (calibration == false) {

                params.calibration = calibration;

              }

              scrollTo(params);

            };
            let fps = options.fps;
            let speed = options.speed;

            top = parseInt(section.getBoundingClientRect().top + scroll);

            if (header.elem && header.mode) {

              let headerHeight = header.elem.offsetHeight;
              let windowWidth = window.innerWidth;

              if (header.minWidth && header.minWidth > windowWidth) {

                applyScrollTo(top, fps, speed);

              } else if (!header.minWidth || (header.minWidth && header.minWidth <= windowWidth)) {

                if (header.mode == "fixed") {

                  applyScrollTo(top - parseInt(headerHeight), fps, speed);

                } else if (header.mode == "lurking") {

                  if (top > scroll) {

                    applyScrollTo(top - parseInt(headerHeight), fps, speed, false);

                  } else {

                    applyScrollTo(top, fps, speed, false);

                  }

                } else  {

                  applyScrollTo(top, fps, speed);

                }

              }

            } else {

              applyScrollTo(top, fps, speed);

            }

            module.applyAfterScroll();

          }

        }

      }

    };

    // End Функция скролла страницы к указанной секции

    module.setParams();
    module.findHeader();

    if (options.dynamic == true) {

      document.addEventListener("click", function(e) {

        let elem = e.target;

        if (elem.classList.contains(pointer.class)) {

          pointer.elems = findElemsClass(pointer.class);
          section.elems = findElemsClass(section.class);
          module.applyBeforeScroll();
          module.goToSection(helpFunc.findSectionName(elem));

        } else {

          let parent = findCurrentParent(elem, goToSection.pointer.class);

          if (parent) {

            pointer.elems = findElemsClass(pointer.class);
            section.elems = findElemsClass(section.class);
            module.applyBeforeScroll();
            module.goToSection(helpFunc.findSectionName(parent));

          }

        }

      });

    } else if (pointer.elems && section.elems) {

      for (let pointer of pointer.elems) {

        pointer.addEventListener("click", function() {

          module.applyBeforeScroll();
          module.goToSection(helpFunc.findSectionName(pointer));

        });

      }

    }

  }

};