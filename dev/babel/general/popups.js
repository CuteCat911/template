// Popups - ver. 1.2.8

// Description
// * * * = * * *

// Функция конструктор реализующая функционал всплывающих окон (попап окон);

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. popup (обязательный) (тип string) - класс элементов всплывающих окон.
// 2. btnOpen (не обязательный) (тип string) - класс элементов кнопок открытия всплывающих окон.
// 3. btnClose (не обязательный) (тип string) - класс элементов кнопок закрытия всплывающих окон.
// 4. overlayColor (не обязательный) (тип string) - задает цвет подложки.
// 5. overlayOpacity (не обязательный) (тип number) - задает прозрачность подложки.
// 6. overlayTransitionTime (не обязательный) (тип string) - задает время появления и скрытия подложки.
// 7. overlayHide (не обязательный) (тип boolean) - включает или выключает возможность скрытия всплывающего окна при клике на подложку.
// 8. popupTransitionTime (не обязательный) (тип string) - задает время появления и скрытия всплывающих окон.
// 9. openClass (не обязательный, обязательно использовать совместно с closeClass) (тип string) - класс, который будет добавляться к открытым всплывающим окнам, если класс будет отсутствовать, то будут применять дефолтные стили.
// 10. closeClass (не обязательный, обязательно использовать совместно с openClass) (тип string) - класс который будет добавляться к закрытым всплывающим окнам, если класс будет отсутствовать, то будут применять дефолтные стили.
// 11. mode (не обязательный) (тип string) - тип анимации для подложки.
// 12. dynamic (не обязательный) (тип boolean) - включает или выключает работу с динамическими кнопками открытия и закрытия (подгружаемые ajax-ом).
// 13. fixedElemsPadding (не обязательный) (тип string или array) - класс или классы элементов в массиве, которым нужно добавить правый padding при открытии попап окна, чтоюы они не скакали.
// 14. fixedElemsMargin (не обязательный) (тип string или array) -класс или классы элементов в массиве, которым нужно добавить правый margin при открытии попап окна, чтоюы они не скакали.

// Возможные значения параметра mode:
// 1. lap - подложка открывается и скрывается кругом.

// Пример объекта с параметрами:
// {
//  popup: "js-popup",
//  btnOpen: "js-open-popup",
//  btnClose: "js-close-popup",
//  overlayHide: true,
//  overlayOpacity: overlayOpacity,
//  popupTransitionTime: mobileMenuTime,
//  overlayTransitionTime: mobileMenuTime
// };

// Доступные атрибуты:
// 1. data-popup - содержит название всплывающего окна. (Применимо к всплывающим окнам).
// 2. data-open-popup - содержит название всплывающего окна, которое нужно открыть. (Применимо к кнопкам открытия и закрытия всплывающих окон).
// 3. data-close-popup - содержит название всплывающего окна, которое нужно закрыть. (Применимо к кнопкам закрытия всплывающих окон).

// Доступные методы:
// 1. open - выполняет открытие попап окна.
// Принимает в себя название всплывающего окна (popapName), обязательный параметр и координаты для режима lap (clickCoord), не обязательный параметр;
// 2. close - выполняет закрытие попап окна и может выполнить параллельное открытие другого окна.
// Принимает в себя название всплывающего окна (popapName), обязательный параметр, которое нужно закрыть и название всплывающего окна которое нужно синхронно открыть (reOpen), не обязательный параметр.
// 3. getOverlay - возвращает элемент подложки.
// 4. beforeOpen - отработает перед открытием попап окна.
// Принимает в себя функцию или массив функций вместе с названием или массивом названий попап окон. Если указано название или названия попап окнон, то эта функция отработает только перед их открытием. Если название не указано, то функция будет отрабатывать для всех попап окон.
// 5. afterOpen - отработает после открытия попап окна.
// Принимает в себя функцию или массив функций вместе с названием или массивом названий попап окон. Если указано название или названия попап окнон, то эта функция отработает только после их открытия. Если название не указано, то функция будет отрабатывать для всех попап окон.
// 6. beforeClose - отработает перед закрытием попап окна.
// Принимает в себя функцию или массив функций вместе с названием или массивом названий попап окон. Если указано название или названия попап окнон, то эта функция отработает только перед их закрытием. Если название не указано, то функция будет отрабатывать для всех попап окон.
// 7. afterClose - отработает после закрытия попап окна.
// Принимает в себя функцию или массив функций вместе с названием или массивом названий попап окон. Если указано название или названия попап окнон, то эта функция отработает только после их закрытия. Если название не указано, то функция будет отрабатывать для всех попап окон.

// Описание функционала всплывающих окон.
// Открытие или закрытие всплывающих окон может быть выполнено как при помощи кнопок их открытия или закрытия, так и программным уровнем при помощи методов.
// У всех попап окон обязательно должен быть атрибут data-popup с названием окна, иначе скрипт не увидет это окно.
// Так же у кнопок открытия всплывающих окон должен быть атрибут data-open-popup, с названием окна, которое он должен открыть, иначе скрипт не поймет какое окно открыть.
// У кнопок закрытия всплывающих окон обязателен data-close-popup с названием окна, которое дожно закрыться, так же может быть добавлен атрибут data-open-popup с названием окна которое нужно открыть.
// Если указан атрибут data-open-popup у кнопки закрытия, то после закрытия основного окна, откроется то, название которого было указано.

// * * * = * * *
// End Description

import {findElemsClass, findElemsClasses, findFirstTag} from "./find";
import {windowResize} from "./window-resize";
import {applyStyle} from "./apply-style";
import {findCurrentParent} from "./find-current-parent";

export let Popups = function(params) {

  if (params.popup && typeof params.popup === "string") {

    let module = this;
    let moduleInfo = {
      popups: findElemsClass(params.popup, document),
      btnsOpen: null,
      btnsClose: null,
      elemsClasses: {
        popups: params.popup,
        btnsOpen: null,
        btnsClose: null
      },
      elems: {
        wrapper: {
          element: null,
          tag: "div"
        },
        overlay: {
          element: null,
          tag: "div"
        },
        lap: {
          element: null,
          tag: "div"
        }
      },
      options: {
        popup: {
          marginTop: null,
          marginBottom: null,
          top: null,
          height: null,
          transitionTime: "0.3s"
        },
        overlay: {
          height: null,
          transitionTime: "0.3s",
          color: "#000",
          opacity: 1,
          hide: false
        },
        classes: {
          open: null,
          close: null
        },
        dynamic: false,
        clickCoord: {
          top: 0,
          left: 0
        },
        mode: null,
        window: {
          width: null,
          height: null,
        },
        html: {
          element: findFirstTag("html", document),
          width: null
        },
        timeOut: null,
        diffWidth: null,
        opened: [],
        closed: false
      },
      fixedElems: {
        margin: null,
        padding: null
      },
      funcs: {
        afterOpen: [],
        beforeOpen: [],
        afterClose: [],
        beforeClose: []
      }
    };
    let dataAttr = {
      open: "data-open-popup",
      close: "data-close-popup",
      popup: "data-popup"
    };
    let styles = {
      wrapper: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        overflowY: "auto",
        opacity: 0,
        zIndex: -9999
      },
      overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        willChange: "opacity",
        overflow: "hidden",
        opacity: 0,
        zIndex: 0
      },
      overlayLap: null,
      fixedElems: {
        padding: {
          paddingRight: null,
          boxSizing: "border-box"
        },
        margin: {
          marginRight: null
        }
      },
      popup: {
        position: "absolute",
        top: "46%",
        left: "50%",
        willChange: "opacity",
        transform: "translate(-50%, -50%)",
        opacity: 0,
        zIndex: -1
      },
      opened: {
        body: {
          overflow: "hidden"
        },
        wrapper: {
          opacity: 1,
          zIndex: 99999
        },
        overlayLap: null
      },
      closed: {
        wrapper: {
          opacity: 0,
          zIndex: -9999
        },
        overlayLap: null
      }
    };

    // Сокращение часто используемых частей объекта moduleInfo

    let elemsClasses = moduleInfo.elemsClasses;
    let elems = moduleInfo.elems;
    let options = moduleInfo.options;
    let fixedElems = moduleInfo.fixedElems;
    let funcs = moduleInfo.funcs;

    // End Сокращение часто используемых частей объекта moduleInfo

    // Вспомогательные функции

    let helpFunc = {
      currentIndex: function(elem) { // Функция установки правильного z-index открывающемуся окну. Принимает в себя попап окно (elem)

        if ((elem && typeof elem === "object") && (options.opened.length != 0)) {

          let opened = options.opened;
          let lastOpenPopup = opened[opened.length - 1];
          let currentZIndex = parseInt(getComputedStyle(lastOpenPopup).zIndex) + 1;

          elem.style.zIndex = currentZIndex;

        }

      },
      addFunc: function(func, popupName, nameArray) { // Функция, позволяющая записывать в массив функцию или массив с функциями

        if (func && (nameArray && typeof nameArray === "string")) {

          let popupsNameArray = [];
          let addPopupsName = function() {

            if (typeof popupName === "string") {

              popupsNameArray.push(popupName);

            } else if (typeof popupName === "object") {

              for (let item of popupName) {

                if (typeof item === "string") {

                  popupsNameArray.push(item);

                }

              }

            }

          };

          if (typeof func === "function") {

            if (popupName) {

              addPopupsName();
              funcs[nameArray].push([func, popupsNameArray]);

            } else {

              funcs[nameArray].push(func);

            }

          } else if (typeof func === "object") {

            for (let item of func) {

              if (typeof item === "function") {

                if (popupName) {

                  addPopupsName();
                  funcs[nameArray].push([item, popupsNameArray]);

                } else {

                  funcs[nameArray].push(item);

                }

              }

            }

          }

        }

      },
      applyFunc: function(popupName, nameArray) { // Функция, позволяющая пробегаться по массиву с функциями и выполнять каждую из них.

        if (funcs[nameArray].length > 0) {

          for (let item of funcs[nameArray]) {

            if (item.length == 2) {

              for (let popup of item[1]) {

                if (popup == popupName) {

                  let func = item[0];

                  func();

                }

              }

            } else {

              item();

            }

          }

        }

      },
      setPaddingFixedElems: function(type, mode) {

        if ((type && typeof type === "string") && (mode && typeof mode === "string")) {

          styles.fixedElems[type][type + "Right"] = options.diffWidth + "px";

          if (fixedElems[type]) {

            for (let fixedElems of fixedElems[type]) {

              for (let elem of fixedElems) {

                if (mode == "add") {

                  applyStyle(elem, styles.fixedElems[type], mode);

                } else if (mode == "remove") {

                  applyStyle(elem, styles.fixedElems[type], mode);

                }

              }

            }

          }

        }

      },
      overlayClose: function() {

        if (elems.overlay.element) {

          elems.overlay.element.addEventListener("click", function() {

            if (options.closed == false && options.overlay.hide == true) {

              module.close();

            }

          });

        }

      }
    };

    // End Вспомогательные функции

    // Сокращения добавления и исполнения функций

    let addFunc = helpFunc.addFunc;
    let applyFunc = helpFunc.applyFunc;

    // End Сокращения добавления и исполнения функций

    // Функция, которая записывает функцию или массив с функциями и которые будут выполены до открытия попап окна

    module.beforeOpen = function(func, popupName) {

      addFunc(func, popupName, "beforeOpen");

    };

    // End Функция, которая записывает функцию или массив с функциями и которые будут выполены до открытия попап окна

    // Функция выполения функций в массиве до открытия попап окна

    module.applyBeforeOpen = function(popupName) {

      applyFunc(popupName, "beforeOpen");

    };

    // End Функция выполения функций в массиве до открытия попап окна

    // Функция, которая записывает функцию или массив с функциями и которые будут выполены после открытия попап окна

    module.afterOpen = function(func, popupName) {

      addFunc(func, popupName, "afterOpen");

    };

    // End Функция, которая записывает функцию или массив с функциями и которые будут выполены после открытия попап окна

    // Функция выполения функций в массиве после открытия попап окна

    module.applyAfterOpen = function(popupName) {

      applyFunc(popupName, "afterOpen");

    };

    // End Функция выполения функций в массиве после открытия попап окна

    // Функция, которая записывает функцию или массив с функциями и которые будут выполены до закрытия попап окна

    module.beforeClose = function(func, popupName) {

      addFunc(func, popupName, "beforeClose");

    };

    // End Функция, которая записывает функцию или массив с функциями и которые будут выполены до закрытия попап окна

    // Функция выполения функций в массиве до закрытия попап окна

    module.applyBeforeClose = function(popupName) {

      applyFunc(popupName, "beforeClose");

    };

    // End Функция выполения функций в массиве до закрытия попап окна

    // Функция, которая записывает функцию или массив с функциями и которые будут выполены после закрытия попап окна

    module.afterClose = function(func, popupName) {

      addFunc(func, popupName, "afterClose");

    };

    // End Функция, которая записывает функцию или массив с функциями и которые будут выполены после закрытия попап окна

    // Функция выполения функций в массиве после закрытия попап окна

    module.applyAfterClose = function(popupName) {

      applyFunc(popupName, "afterClose");

    };

    // End Функция выполения функций в массиве после закрытия попап окна

    // Функция нахождения всех открывающих и закрывающих кнопок

    module.findBtns = function() {

      if (params.btnOpen && typeof params.btnOpen === "string") {

        moduleInfo.btnsOpen = findElemsClass(params.btnOpen, document);
        elemsClasses.btnsOpen = params.btnOpen;

      }

      if (params.btnClose && typeof params.btnClose === "string") {

        moduleInfo.btnsClose = findElemsClass(params.btnClose, document);
        elemsClasses.btnsClose = params.btnClose;

      }

    };

    // End Функция нахождения всех открывающих и закрывающих кнопок

    module.findPopups = function() {

      moduleInfo.popups = findElemsClass(elemsClasses.popups, document);
      module.createElems();
      helpFunc.overlayClose();

    };

    module.destroyPopups = function() {

      if (elems.wrapper.element) {

        options.html.element.removeChild(elems.wrapper.element);

      }

    };

    // Функция установки дефолтных или пользовательских параметров

    module.setParams = function() {

      let popup = options.popup;
      let overlay = options.overlay;
      let classes = options.classes;
      let setCurrentTimeOut = function(trsTime) {

        if (trsTime && typeof trsTime === "string") {

          let lastLetter = trsTime[trsTime.length - 1];
          let preLastLetter = trsTime[trsTime.length - 2];
          let time;

          if (preLastLetter == "m" &&  lastLetter == "s") {

            time = Math.abs(+parseInt(trsTime));

          } else if (preLastLetter != "m" && lastLetter == "s") {

            time = Math.abs(+parseFloat(trsTime)) * 1000;

          }

          if (time) {

            return time;

          }

        }

      };

      // Overlay params

      if (params.overlayColor && typeof params.overlayColor === "string") {

        overlay.color = params.overlayColor;

      }

      if (params.overlayOpacity && typeof params.overlayOpacity === "number") {

        overlay.opacity = Math.abs(params.overlayOpacity);

      }

      if (params.overlayTransitionTime && typeof params.overlayTransitionTime === "string") {

        overlay.transitionTime = params.overlayTransitionTime;

      }

      if (params.overlayHide == true) {

        overlay.hide = params.overlayHide;

      }

      styles.overlay.transition = "opacity " + overlay.transitionTime;

      if (overlay.hide == true) {

        styles.overlay.cursor = "pointer";

      }

      options.timeOut = setCurrentTimeOut(overlay.transitionTime);

      // End Overlay params

      // Popups params

      if (params.popupTransitionTime && typeof params.popupTransitionTime === "string") {

        popup.transitionTime = params.popupTransitionTime;

      }

      styles.popup.transition = "opacity " + popup.transitionTime;


      // End Popups params

      // Classes params

      if ((params.openClass && typeof params.openClass === "string") && (params.closeClass && typeof params.closeClass === "string")) {

        classes.open = params.openClass;
        classes.close = params.closeClass;

      }

      // End Classes params

      // Mode params

      if (params.mode && typeof params.mode === "string") {

        options.mode = params.mode;

      }

      if (options.mode == "lap") {

        styles.overlayLap = {
          position: "absolute",
          width: 0,
          height: 0,
          backgroundColor: overlay.color,
          borderRadius: "50%",
          willChange: "width, height, transform, opacity",
          transform: "translate(-50%, -50%) scale(0)",
          transition: "width " + overlay.transitionTime + ", height " + overlay.transitionTime + ", opacity 0s " + overlay.transitionTime + ", transform " + overlay.transitionTime,
          opacity: 0,
          zIndex: 0
        };

      }

      // End Mode params

      // Dynamic params

      if (params.dynamic == true) {

        options.dynamic = params.dynamic;

      }

      //  End Dynamic params

      // FixedElems

      if (params.fixedElemsPadding && typeof params.fixedElemsPadding === "object") {

        fixedElems.padding = findElemsClasses(params.fixedElemsPadding, document);

      }

      if (params.fixedElemsMargin && typeof params.fixedElemsMargin === "object") {

        fixedElems.margin = findElemsClasses(params.fixedElemsMargin, document);

      }

      // End FixedElems

    };

    // End Функция установки дефолтных или пользовательских параметров

    // Функция создания вспомогательных элементов

    module.createElems = function() {

      for (let i in elems) {

        elems[i].element = document.createElement(elems[i].tag);
        applyStyle(elems[i].element, styles[i], "add");

      }

      if (options.mode == "lap") {

        let lap = elems.lap;
        lap.element = document.createElement(lap.tag);
        applyStyle(lap.element, styles.overlayLap, "add");
        elems.overlay.element.appendChild(lap.element);
        elems.overlay.element.style.backgroundColor = "transparent";

      } else {

        elems.overlay.element.style.backgroundColor = options.overlay.color;

      }

      elems.wrapper.element.appendChild(elems.overlay.element);
      options.html.element.appendChild(elems.wrapper.element);

      for (var i in moduleInfo.popups) {

        let popup = moduleInfo.popups[i];

        if (options.classes.close) {

          popup.classList.add(options.classes.close);

        } else {

          applyStyle(popup, styles.popup, "add");

        }

        elems.wrapper.element.appendChild(popup);

      }

    };

    // End Функция создания вспомогательных элементов

    // Функция установки высоты overlay

    module.setOverlayHeight = function(item) {

      let opens = options.opens;

      if ((item && typeof item === "object") || (options.opened.length > 0)) {

        let $window = options.window;
        let html = options.html;
        let popup = options.popup;
        let currentSize = function(size) {

          if (size && (size <= 0 || size >= 0)) {

            return size;

          } else {

            return 0;

          }

        };

        $window.width = innerWidth;
        $window.height = innerHeight;
        html.width = html.element.offsetWidth;
        options.diffWidth = $window.width - html.width;
        styles.opened.body.paddingRight = options.diffWidth + "px";

        if (item) {

          popup.marginTop = currentSize(Math.abs(parseFloat(getComputedStyle(item).marginTop)));
          popup.marginBottom = currentSize(Math.abs(parseFloat(getComputedStyle(item).marginBottom)));
          popup.top = currentSize(Math.abs(parseFloat(getComputedStyle(item).top)));
          popup.height = currentSize(Math.abs(item.offsetHeight));

        } else {

          let lastOpenPopup = options.opened[options.opened.length - 1];

          popup.marginTop = currentSize(Math.abs(parseFloat(getComputedStyle(lastOpenPopup).marginTop)));
          popup.marginBottom = currentSize(Math.abs(parseFloat(getComputedStyle(lastOpenPopup).marginBottom)));
          popup.top = currentSize(Math.abs(parseFloat(getComputedStyle(lastOpenPopup).top)));
          popup.height = currentSize(Math.abs(lastOpenPopup.offsetHeight));

        }

        options.overlay.height = popup.height + popup.marginTop + popup.marginBottom + (Math.abs(popup.top) * 2);

        if (popup.height + popup.marginTop + popup.marginBottom <= $window.height) {

          options.overlay.height = $window.height;

          if (item) {

            item.style.top = "45%";

          }

        } else {

          if (item) {

            item.style.top = "100%";

          }

        }

        elems.overlay.element.style.height = options.overlay.height + "px";

      }

    };

    // End Функция установки высоты overlay

    // Функция открытия попап окна

    module.open = function(popupName, clickCoord) {

      if (popupName && typeof popupName === "string") {

        if (clickCoord && typeof clickCoord === "object") {

          if (clickCoord.top && typeof clickCoord.top === "number") {

            options.clickCoord.top = clickCoord.top;

          }

          if (clickCoord.left && typeof clickCoord.left === "number") {

            options.clickCoord.left = clickCoord.left;

          }

        }

        if (moduleInfo.popups) {

          for (let item of moduleInfo.popups) {

            let currentName = item.getAttribute(dataAttr.popup);

            if (currentName && currentName == popupName) {

              module.setOverlayHeight(item);

              if (options.opened.length == 0) {

                applyStyle(document.body, styles.opened.body, "add");
                applyStyle(elems.wrapper.element, styles.opened.wrapper, "add");
                elems.overlay.element.style.opacity = options.overlay.opacity;
                helpFunc.setPaddingFixedElems("padding", "add");
                helpFunc.setPaddingFixedElems("margin", "add");

                if (options.mode == "lap") {

                  let lap = elems.lap.element;
                  let top = options.clickCoord.top;
                  let left = options.clickCoord.left;
                  let overlay = options.overlay;
                  let $window = options.window;
                  let overlayLapStyle = styles.opened.overlayLap;

                  overlayLapStyle = {
                    top: top + "px",
                    left: left + "px",
                    transform: "translate(-50%, -50%) scale(1)",
                    transition: "width " + overlay.transitionTime + ", height " + overlay.transitionTime + ", opacity 0s 0s" + ", transform " + overlay.transitionTime,
                    opacity: 1
                  };

                  if ((overlay.height >= $window.height) && (overlay.height >= $window.width)) {

                    overlayLapStyle.width = (overlay.height * 4) + "px";
                    overlayLapStyle.height = (overlay.height * 4) + "px";

                  } else if ((overlay.height >= $window.height) && (overlay.height <= $window.width)) {

                    overlayLapStyle.width = ($window.width * 4) + "px";
                    overlayLapStyle.height = ($window.width * 4) + "px";

                  } else if (overlay.height <= $window.height) {

                    if ($window.width >= $window.height) {

                      overlayLapStyle.width = ($window.width * 4) + "px";
                      overlayLapStyle.height = ($window.width * 4) + "px";

                    } else {

                      overlayLapStyle.width = ($window.height * 4) + "px";
                      overlayLapStyle.height = ($window.height * 4) + "px";

                    }

                  }

                  applyStyle(lap, overlayLapStyle, "add");

                }

              }

              if (options.classes.open && options.classes.close) {

                item.classList.remove(options.classes.close);
                item.classList.add(options.classes.open);
                helpFunc.currentIndex(item);

              } else {

                item.style.opacity = 1;
                item.style.zIndex = 1;
                helpFunc.currentIndex(item);

              }

              if (options.opened.indexOf(item) == -1) {

                options.opened.push(item);

              }

            }

          }

        }

      }

    };

    // End Функция открытия попап окна

    // Функция закрытия попап окна

    module.close = function(popupName, reOpen) {

      let openClass = options.classes.open;
      let closeClass = options.classes.close;

      if (popupName && typeof popupName === "string") {

        if (moduleInfo.popups) {

          for (let item of moduleInfo.popups) {

            let currentName = item.getAttribute(dataAttr.popup);

            if (currentName == popupName && reOpen == false) {

              if (options.opened.length > 0) {

                if (options.opened.length == 1) {

                  applyStyle(document.body, styles.opened.body, "remove");
                  options.closed = true
                  elems.overlay.element.style.opacity = 0;
                  helpFunc.setPaddingFixedElems("padding", "remove");
                  helpFunc.setPaddingFixedElems("margin", "remove");

                  setTimeout(function() {

                    applyStyle(elems.wrapper.element, styles.closed.wrapper, "add");
                    options.closed = false;

                  }, options.timeOut);

                  if (options.mode == "lap") {

                    let lap = elems.lap.element;
                    let overlay = options.overlay;
                    let overlayLapStyle = styles.closed.overlayLap;

                    overlayLapStyle = {
                      width: 0,
                      height: 0,
                      transform: "translate(-50%, -50%) scale(0)",
                      transition: "width " + overlay.transitionTime + ", height " + overlay.transitionTime + ", opacity 0s " + overlay.transitionTime + ", transform " + overlay.transitionTime,
                      opacity: 0
                    };
                    applyStyle(elems.lap.element, overlayLapStyle, "add");

                  }

                }

                if (openClass && closeClass) {

                  item.classList.remove(openClass);
                  item.classList.add(closeClass);

                } else {

                  item.style.opacity = 0;
                  item.style.zIndex = -1;

                }

                options.opened.pop();

              }

            } else if (reOpen != false) {

              let closePopup;
              let openPopup;

              if (currentName == popupName) {

                closePopup = item;

                if (closePopup) {

                  if (openClass && closeClass) {

                    closePopup.classList.remove(openClass);
                    closePopup.classList.add(closeClass);

                  } else {

                    closePopup.style.opacity = 0;
                    closePopup.style.zIndex = -1;

                  }

                  options.opened.pop();

                }

              } else if (currentName == reOpen) {

                openPopup = item;

                if (openPopup) {

                  if (closeClass && openClass) {

                    openPopup.classList.remove(closeClass);
                    openPopup.classList.add(openClass);

                  } else {

                    openPopup.style.opacity = 1;
                    openPopup.style.zIndex = 1;

                  }

                  options.opened.push(openPopup);
                  elems.wrapper.element.scrollTop = 0;

                }

              }

            }

          }

        }

      } else {

        let lastOpen = options.opened[options.opened.length - 1];

        if (lastOpen) {

          if (options.opened.length == 1) {

            applyStyle(document.body, styles.opened.body, "remove");
            options.closed = true
            elems.overlay.element.style.opacity = 0;
            helpFunc.setPaddingFixedElems("padding", "remove");
            helpFunc.setPaddingFixedElems("margin", "remove");

            setTimeout(function() {

              applyStyle(elems.wrapper.element, styles.closed.wrapper, "add");
              options.closed = false;

            }, options.timeOut);

            if (options.mode == "lap") {

              let lap = elems.lap.element;
              let overlay = options.overlay;
              let overlayLapStyle = styles.closed.overlayLap;

              overlayLapStyle = {
                width: 0,
                height: 0,
                transform: "translate(-50%, -50%) scale(0)",
                transition: "width " + overlay.transitionTime + ", height " + overlay.transitionTime + ", opacity 0s " + overlay.transitionTime + ", transform " + overlay.transitionTime,
                opacity: 0
              };
              applyStyle(elems.lap.element, overlayLapStyle, "add");

            };

          };

          if (openClass && closeClass) {

            lastOpen.classList.remove(openClass);
            lastOpen.classList.add(closeClass);

          } else {

            lastOpen.style.opacity = 0;
            lastOpen.style.zIndex = -1;

          };

          options.opened.pop();

        };

      }

    };

    // End Функция закрытия попап окна

    module.getOverlay = elems.overlay;

    module.findBtns();
    module.setParams();

    if (moduleInfo.popups) {

      module.createElems();

    }

    if (options.dynamic == true) {

      document.addEventListener("click", function(e) {

        let elem = e.target;
        let popup;

        if (elem.classList.contains(elemsClasses.btnsOpen)) {

          e.preventDefault();
          popup = elem.getAttribute(dataAttr.open);

        } else {

          let parent = findCurrentParent(elem, elemsClasses.btnsOpen);

          if (parent) {

            e.preventDefault();
            popup = parent.getAttribute(dataAttr.open);

          }

        }

        if (popup) {

          module.applyBeforeOpen(popup);
          options.clickCoord.top = e.clientY;
          options.clickCoord.left = e.clientX;
          module.open(popup);
          module.applyAfterOpen(popup);

        }

      });

    } else if (moduleInfo.btnsOpen) {

      for (let btn of moduleInfo.btnsOpen) {

        btn.addEventListener("click", function(e) {

          e.preventDefault();

          let popup = btn.getAttribute(dataAttr.open);

          if (popup) {

            module.applyBeforeOpen(popup);
            options.clickCoord.top = e.clientY;
            options.clickCoord.left = e.clientX;
            module.open(popup);
            module.applyAfterOpen(popup);

          };

        });

      };

    }

    if (options.dynamic == true) {

      document.addEventListener("click", function(e) {

        let elem = e.target;
        let popup;

        if (elem.classList.contains(elemsClasses.btnsClose)) {

          e.preventDefault();
          popup = elem.getAttribute(dataAttr.close);

        } else {

          let parent = findCurrentParent(elem, elemsClasses.btnsClose);

          if (parent) {

            e.preventDefault();
            popup = parent.getAttribute(dataAttr.close);

          }

        }

        if (popup) {

          let reOpen = elem.getAttribute(dataAttr.open);

          if (!reOpen) {

            reOpen = false;

          }

          module.applyBeforeClose(popup);
          module.close(popup, reOpen);
          module.applyAfterClose(popup);

        }

      });

    } else if (moduleInfo.btnsClose) {

      for (let btn of moduleInfo.btnsClose) {

        btn.addEventListener("click", function(e) {

          e.preventDefault();

          let popup = btn.getAttribute(dataAttr.close);

          if (popup) {

            let reOpen = btn.getAttribute(dataAttr.open);

            if (!reOpen) {

              reOpen = false;

            }

            if (options.closed == false) {

              module.applyBeforeClose(popup);
              module.close(popup, reOpen);
              module.applyAfterClose(popup);

            }

          }

        });

      }

    }

    helpFunc.overlayClose();

    windowResize(module.setOverlayHeight);

  } else {

    console.error();
    return false;

  }

};