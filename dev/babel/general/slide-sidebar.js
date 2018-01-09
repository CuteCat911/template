// SlideSidebar - ver 1.0.0

// Description
// * * * = * * *

// Функция конструктор реализующая функционал скользящих sidebar-ов.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. sidebarWrapper (обязательный) (тип string) - класс элементов обертки для сайдбара (может быть несколько)
// 2. sidebar (обязательный) (тип string) - класс сайдбаров (для корректной работы должны находиться в своих обертках (sidebarWrapper))
// 3. content (обязательный) (тип string) - класс элемента контента, по высоте которого будет происходить скольжение сайдбара(ов)
// 4. indentTop (не обязательный) (тип number) - отступ для всех сайдбаров сверху
// 5. indentBottom (не обязательный) (тип number) - отступ для всех сайдбаров снизу
// 6. minWidth (не обязательный) (тип number) - минимальная ширина при которой функционал перестает работать

// Пример объекта с параметрами:
// {
//   sidebarWrapper: "content-aside",
//   sidebar: "aside",
//   content: "content",
//   indentTop: 200,
//   indentBottom: 20,
//   minWidth: 1024
// };

// Доступные атрибуты:
// 1. data-indent-top - задает для определенного сайдбара отступ сверху.
// 2. data-indent-bottom - задает для определенного сайдбара отступ снизу.

// Описание функционала скользящих sidebar-ов.
// Одновременно работать могут до нескольких сайдбаров. Главное условие чтобы каждый сайдбар был в своей обертке и на старнице был один элемент с контентом.

// * * * = * * *
// End Description

import {findFirstClass, findElemsClass} from "./find";
import {getWindowScroll, windowScroll} from "./window-scroll";
import {applyStyle} from "./apply-style";
import {windowResize} from "./window-resize";

export let SlideSidebar = function(params) {

  if ((params.sidebarWrapper && typeof params.sidebarWrapper === "string") && (params.sidebar && typeof params.sidebar === "string") && (params.content && typeof params.content === "string")) {

    let module = this;
    let moduleInfo = {
      elems: {
        sidebarWrapper: findElemsClass(params.sidebarWrapper, document),
        sidebar: findElemsClass(params.sidebar, document),
        content: findFirstClass(params.content, document)
      },
      classes: {
        sidebarWrapper: params.sidebarWrapper,
        sidebar: params.sidebar,
        content: params.content
      },
      sidebarsInfo: {

      },
      options: {
        indent: {
          top: 0,
          bottom: 0
        },
        windowWidth: null,
        contentHeight: null,
        minWidth: null
      }
    };
    let dataAttr = {
      indent: {
        top: "data-indent-top",
        bottom: "data-indent-bottom"
      }
    };
    let styles = {
      fixed: {
        top: {
          marginTop: "",
          position: "fixed",
          top: "",
          width: ""
        },
        bottom: {
          position: "fixed",
          bottom: "",
          width: ""
        }
      },
      static: {
        marginTop: "",
        position: "static",
        top: "",
        bottom: "",
        width: ""
      }
    };

    // Сокращение часто используемых частей объекта moduleInfo

    let elems = moduleInfo.elems;
    let classes = moduleInfo.classes;
    let sidebarsInfo = moduleInfo.sidebarsInfo;
    let options = moduleInfo.options;

    // End Сокращение часто используемых частей объекта moduleInfo

    if (elems.sidebarWrapper && elems.sidebar && elems.content) {

      // Функция установки дефолтных или пользовательских параметров

      module.setParams = function() {

        if (params.indentTop && typeof params.indentTop === "number") {

          options.indent.top = Math.abs(params.indentTop);

        };

        if (params.indentBottom && typeof params.indentBottom === "number") {

          options.indent.bottom = Math.abs(params.indentBottom);

        };

        if (params.minWidth && typeof params.minWidth === "number") {

          options.minWidth = Math.abs(params.minWidth);

        };

      };

      // End Функция установки дефолтных или пользовательских параметров

      // Функция установки размеров ширины окна и высоты контента

      module.setSizes = function() {

        options.windowWidth = window.innerWidth;
        options.contentHeight = elems.content.offsetHeight;

      };

      // End Функция установки размеров ширины окна и высоты контента

      // Функция сбора всей информации по сайдбару

      module.setSidebarsInfo = function() {

        for (let i = 0; i < elems.sidebarWrapper.length; i++) {

          let wrapper = elems.sidebarWrapper[i];

          sidebarsInfo[i] = {
            wrapper: wrapper,
            sidebar: findFirstClass(classes.sidebar, wrapper),
            options: {
              indent: {
                top: null,
                bottom: null
              },
              marginTop: null,
              width: null,
              height: null,
              offset: null,
              position: {
                top: null,
                bottom: null
              },
              lastScroll: 0
            }
          };

          if (sidebarsInfo[i].sidebar) {

            for (let item of ["top", "bottom"]) {

              let position = sidebarsInfo[i].sidebar.getAttribute(dataAttr.indent[item]);

              if (position && (typeof +position === "number") && (position <= 0 || position >= 0)) {

                sidebarsInfo[i].options.indent[item] = +position;

              } else {

                sidebarsInfo[i].options.indent[item] = options.indent[item];

              };

            };

          };

        };

      };

      // End Функция сбора всей информации по сайдбару

      // Функция скольжения сайдбара

      module.slide = function() {

        if ((options.minWidth && options.windowWidth >= options.minWidth) || !options.minWidth) {

          let scroll = getWindowScroll();
          let windowHeight = window.innerHeight;
          let startLine = elems.content.getBoundingClientRect().top + scroll;

          for (let i in sidebarsInfo) {

            let info = sidebarsInfo[i];
            let sidebar = info.sidebar;
            let $options = info.options; // Локальные опции сайдбара
            let top = $options.indent.top;
            let bottom = $options.indent.bottom;
            let position = $options.position;
            let contentHeight = options.contentHeight;

            $options.marginTop = parseFloat(window.getComputedStyle(sidebar).marginTop);
            $options.width = sidebar.offsetWidth;
            $options.height = sidebar.offsetHeight;
            $options.offset = sidebar.getBoundingClientRect().top + scroll;
            info.wrapper.style.height = options.contentHeight + "px";

            let marginTop = $options.marginTop;
            let width = $options.width;
            let height = $options.height;
            let offset = $options.offset;

            if (height <= contentHeight || options.windowWidth >= options.minWidth) {

              let $fixed = styles.fixed;
              let $static = styles.static;

              $fixed.top.top = top + "px";
              $fixed.top.width = width + "px";
              $fixed.bottom.bottom = bottom + "px";
              $fixed.bottom.width = width + "px";

              if (scroll > $options.lastScroll) { // Скролл вниз

                if (height <= windowHeight) { // Высота сайдбара меньше высоты экрана

                  if (scroll >= startLine - top) {

                    applyStyle(sidebar, $fixed.top, "add");

                  };

                  if (scroll + windowHeight >= startLine + contentHeight - top + (windowHeight - height)) {

                    $static.marginTop = contentHeight - height + "px";
                    applyStyle(sidebar, $static, "add");

                  };

                } else { // Высота сайдбара больше высоты экрана

                  if (scroll >= startLine + height + bottom - windowHeight && marginTop == 0) {

                    position.bottom = "active";
                    applyStyle(sidebar, $fixed.bottom, "add");

                  };

                  if (scroll + windowHeight >= startLine + contentHeight + bottom && marginTop == 0) {

                    position.bottom = null;
                    $static.marginTop = contentHeight - height + "px";
                    applyStyle(sidebar, $static, "add");

                  };

                  if (scroll >= offset - top && position.top == "active") {

                    position.top = null;
                    $static.marginTop = offset - startLine + "px";
                    applyStyle(sidebar, $static, "add");

                  };

                  if (scroll >= offset + height + bottom - windowHeight && scroll + windowHeight < startLine + contentHeight && marginTop >= 1) {

                    position.bottom = "active";
                    $fixed.bottom.marginTop = "";
                    applyStyle(sidebar, $fixed.bottom, "add");

                  };

                };

              } else { // Скролл вверх

                if ($options.height <= windowHeight) { // Высота сайдбара меньше высоты экрана

                  if (scroll <= startLine - top) {

                    $static.marginTop = "";
                    applyStyle(sidebar, $static, "add");

                  };

                  if (scroll + windowHeight <= startLine + contentHeight - top + (windowHeight - height) && scroll > startLine - top) {

                    applyStyle(sidebar, $fixed.top, "add");

                  };

                } else { // Высота сайдбара больше высоты экрана

                  if (scroll + top <= offset) {

                    position.top = "active";
                    applyStyle(sidebar, $fixed.top, "add");

                  };

                  if (scroll + top <= startLine) {

                    position.top = null;
                    $static.marginTop = "";
                    applyStyle(sidebar, $static, "add");

                  };

                  if (position.bottom == "active") {

                    position.bottom = null;
                    $static.marginTop = offset - startLine + "px";
                    applyStyle(sidebar, $static, "add");

                  };

                };

              };

              $options.lastScroll = scroll;

            };

          };

        };

      };

      // End Функция скольжения сайдбара

      // Функция очистки стилей сайдбаров

      module.clear = function() {

        for (let i in sidebarsInfo) {

          let info = sidebarsInfo[i];
          let sidebar = info.sidebar;
          let $static = styles.static;

          $static.marginTop = "";
          applyStyle(sidebar, $static, "add");

        };

      };

      // End Функция очистки стилей сайдбаров

      // Функция отрабатывающая при ресайзе окна

      module.resize = function() {

        module.setSizes();
        module.setSidebarsInfo();

        if (options.windowWidth <= options.minWidth) {

          module.clear();

        };

      };

      // End Функция отрабатывающая при ресайзе окна

      module.setParams();
      module.setSizes();
      module.setSidebarsInfo();
      windowScroll(module.slide);
      windowResize(module.resize);

    } else {

      console.error();

    };

  } else {

    console.error();

  };

};