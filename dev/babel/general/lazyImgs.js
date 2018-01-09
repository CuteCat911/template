// LazyImgs - ver 1.0.0

// Description
// * * * = * * *

// Функция конструктор позволяющая подгружать изображения на сайте во время просмотра страницы.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. imgs (обязательный) (тип string) - класс элементов на место которых подгрузяться изображения
// 2. dynamic (не обязательный) (тип boolean) - включает или выключает работы с динамическими элементами (подгружаемые ajax-ом). Обязательно использовать метод findImgs.
// 3. indent (не обязательный) (тип number) - задает размер отступа до загрузки изображения.
// 4. preloader (не обязательный) (тип object или string) - позволяет задать или включить прелоадер для загружаемых изображений.

// Возможные значения параметра preloader:
// 1. object - элемент который будет использован как прелоадер
// 2. default - использование дефолтного прелоудера из плагина loader
// 3. custom - использование дефолтного прелоудера из плагина loader, но с возможностью задать свои классы для блока и индикатора

// Пример объекта с параметрами:
// {
//   imgs: "js-lazzy-img",
//   dynamic: true,
//   indent: 50,
//   preloader: "default"
// }

// Доступные атрибуты:
// 1. data-style-img - ссылка на изображение для тех элементов, у которых изображение сделано через стили (background-image)
// 2. data-img - ссылка на изображение для тега <img>.
// 3. data-alt - текст изображения для тега <img>.
// 4. data-picture - при наличии включает поддержку тега <picture>.
// 5. data-picture-rules - задает правила source для тега <picture>.

// Пример значения атрибута data-picture-rules:
// data-picture-rules="media=(max-width: 1024px) ? srcset=/img/img1.jpg, /img/img1.jpg 2x; media=(max-width: 640px) ? srcset=/img/img2.jpg, /img/img2.jpg 2x"
// где через ";" указываются отдельные правила для тегов source
// через " ? " задаются параметры со значениями указанными через знак "=";

// Доступные методы:
// 1. findImgs - находит все элементы для подгрузки изображений, следует обязательно вызывать после динамического добавления элементов.

// Описание функционала ленивой подгрузки изображений.
// Подгрузка изображений осуществляется только тогда когда страница будет проскроллена до того места где должно находиться изображение (+- указанный промежуток в px).
// Изображение при просмотре странице подгружается только один раз.
// Если указан прелоадер, то для всех изображений перед загрузкой он будет добавлен и исчезнет только после загрузки изображения.
// Поддерживаются изображения добавленые через стили, теги: img, picture и source.
// Так же при использованиее тега <noscript> можно добиться того что при отключенном js изображения все равно будут загружены.

// * * * = * * *
// End Description

import {findElemsClass} from "./find";
import {windowScroll, getScrollHeight} from "./windowScroll";
import {applyClasses} from "./applyClasses";
import {getXmlHttp} from "./ajax";
import {createLoader} from "./loader";

export let LazyImgs = function(params) {

  if (params.imgs && typeof params.imgs === "string") {

    let module = this;
    let moduleInfo = {
      imgs: findElemsClass(params.imgs, document),
      imgsClass: params.imgs,
      imgsInfo: {},
      options: {
        dynamic: false,
        indent: 0,
        windowHeight: null
      },
      preloader: false
    };
    let dataAttr = {
      styleImg: "data-style-img",
      img: "data-img",
      alt: "data-alt",
      picture: {
        active: "data-picture",
        rules: "data-picture-rules"
      }
    };

    // Сокращения параметров объекта moduleInfo

    let imgsClass = moduleInfo.imgsClass;
    let imgsInfo = moduleInfo.imgsInfo;
    let options = moduleInfo.options;

    // End Сокращения параметров объекта moduleInfo

    // Установка дефолтных параметров

    module.setParams = function() {

      if (params.dynamic == true) {

        options.dynamic = params.dynamic;

      }

      if (params.indent && typeof params.indent === "number") {

        options.indent = params.indent;

      }

      if (params.preloader) {

        if (typeof params.preloader === "string") {

          if (params.preloader == "default") {

            moduleInfo.preloader = createLoader();

          } else if (params.preloader == "custom") {

            let blockClass = params.preloaderBlock;
            let indicatorClass = params.preloaderIndicator;

            if ((blockClass && typeof blockClass === "string") && (indicatorClass && typeof indicatorClass === "string")) {

              moduleInfo.preloader = createLoader(blockClass, indicatorClass);

            }

          }

        } else if (typeof params.preloader === "object") {

          moduleInfo.preloader = params.preloader;

        }

      }

      options.scrollHeight = getScrollHeight();

    };

    // End Установка дефолтных параметров

    module.setParams();

    if (moduleInfo.imgs || options.dynamic == true) {

      // Загрузка изображения и добавление его на страницу

      module.load = function(info) {

        if (info && typeof info === "object") {

          let request = getXmlHttp();
          let url = info.options.styleImg || info.options.img;
          let imgElem = info.imgElem;
          let options = info.options;
          let picture = info.picture;

          request.open("GET", url);
          request.onreadystatechange = function() {

            if (request.readyState == 4) {

              if (request.status == 200) {

                let parent = info.element.parentNode;

                if (imgElem.type == "style") {

                  imgElem.element.style.backgroundImage = "url(" + url + ")";

                } else if (imgElem.type == "img") {

                  imgElem.element.setAttribute("src", url);

                  if (options.alt) {

                    imgElem.element.setAttribute("alt", options.alt);

                  } else {

                    imgElem.element.setAttribute("alt", "");

                  }

                }

                if (picture.active == true) {

                  picture.element.appendChild(imgElem.element);
                  parent.replaceChild(picture.element, info.element);

                } else {

                  parent.replaceChild(imgElem.element, info.element);

                }

                options.load = true;

              } else {

                options.load = false;

              }

            }

          };
          request.send(null);

        }

      };

      // End Загрузка изображения и добавление его на страницу

      // Отслеживание позиции изображения при скролле страницы

      module.scroll = function() {

        if (moduleInfo.imgs) {

          options.windowHeight = window.innerHeight;

          let windowHeight = options.windowHeight;

          for (let i in imgsInfo) {

            let info = imgsInfo[i];

            info.top = info.element.getBoundingClientRect().top;
            info.height = info.element.offsetHeight;

            if (info.options.load == false && (info.top - windowHeight - options.indent <= 0) && (info.top + info.height + options.indent >= 0)) {

              module.load(info);
              info.options.load = "loading";

            }

          }

        }

      };

      // End Отслеживание позиции изображения при скролле страницы

      // Нахождение всей информации о подгружаемой картинке

      module.getInfoImgs = function() {

        for (let i = 0; i < moduleInfo.imgs.length; i++) {

          let img = moduleInfo.imgs[i];

          if (moduleInfo.preloader) {

            let preloader = moduleInfo.preloader.cloneNode(true);

            img.appendChild(preloader);

          }

          imgsInfo[i] = {
            element: img,
            top: null,
            height: null,
            imgElem: {
              element: null,
              type: null,
              tag: null,
              classes: []
            },
            options: {
              styleImg: null,
              img: null,
              alt: null,
              load: false
            },
            picture: {
              active: false,
              element: null,
              sources: {}
            }
          };

          let imgElem = imgsInfo[i].imgElem;
          let options = imgsInfo[i].options;
          let picture = imgsInfo[i].picture;

          if (img.hasAttribute(dataAttr.styleImg)) {

            options.styleImg = img.getAttribute(dataAttr.styleImg);
            imgElem.tag = "div";
            imgElem.type = "style";

          } else if (img.hasAttribute(dataAttr.img)) {

            options.img = img.getAttribute(dataAttr.img);
            imgElem.tag = "img";
            imgElem.type = "img";

            if (img.hasAttribute(dataAttr.alt)) {

              options.alt = img.getAttribute(dataAttr.alt);

            }

            if (img.hasAttribute(dataAttr.picture.active)) {

              picture.active = true;
              picture.element = document.createElement("picture");

              if (img.hasAttribute(dataAttr.picture.rules)) {

                let rules = img.getAttribute(dataAttr.picture.rules).split("; ");

                if (rules) {

                  for (let i = 0; i < rules.length; i++) {

                    let params = rules[i].split(" ? ");

                    picture.sources[i] = {
                      element: document.createElement("source")
                    };

                    for (let item of params) {

                      let parts = item.split("=");

                      picture.sources[i].element.setAttribute(parts[0], parts[1]);

                    }

                    picture.element.appendChild(picture.sources[i].element);

                  }

                }

              }

            }

          }

          for (let $class of img.classList) {

            if ($class != imgsClass) {

              imgElem.classes.push($class);

            }

          }

          imgElem.element = document.createElement(imgElem.tag);
          applyClasses(imgElem.element, imgElem.classes, "add");

        };

      };

      // End Нахождение всей информации о подгружаемой картинке

      // Нахождение всех картинок при динамической подгрузке

      module.findImgs = function() {

        moduleInfo.imgs = findElemsClass(imgsClass, document);
        module.getInfoImgs();

      };

      // End Нахождение всех картинок при динамической подгрузке

      if (options.dynamic == false) {

        module.getInfoImgs();

      }

      module.scroll();
      windowScroll(module.scroll);

    }

  }

};