// Sharing - ver. 1.0.0

// Description
// * * * = * * *

// Функция конструктор, которая позволяет делать кастомные кнопки поделиться.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. links (обязательный) (тип string) - класс элементов, которые будут работать кнопками поделиться.
// 2. dynamic (не обязательный) (тип boolean) - включает или выключает работу с динамическими элементами (подгружаемые ajax-ом).
// 3. og (не обязательный) (тип boolean) - включает или выключает подтягивание некоторых данных из мета тегов open graph-а.
// 4. rules (не обязательный) (тип object) - объект с кастомными параметрами, позволяет для некоторых кнопок задавать свои параметры.
// 5. windowWidth (не обязательный) (тип number) - задает ширину открывающегося окна соц. сети, с информацией.
// 6. windowHeight (не обязательный) (тип number) - задает высоту открывающегося окна соц. сети, с информацией.

// Пример объекта с параметрами:
// {
//   links: "js-share",
//   dynamic: true,
//   windowWidth: 400,
//   windowHeight: 300
// };

// Описание правил (rules):
// Указывается название параметров, потом задаются параметры.

// Описание доступных параметров у rules:
// 1. url - ссылка на страницу, которой хотите поделиться
// 2. title - заголовок

// Доступные атрибуты:
// 1. data-share-sociate - указывает в какой сети вы хотите поделиться ссылкой
// 2. data-share-rule - указывается название параметров из правил, чтобы подгрузить их.

// * * * = * * *
// End Description

import {findElemsClass, findFirstTag, findElemsTag} from "./find";

export let Sharing = function(params) {

  if (params.links && typeof params.links === "string") {

    let module = this;
    let moduleInfo = {
      linksClass: params.links,
      links: findElemsClass(params.links, document),
      options: {
        dynamic: false,
        og: true
      },
      windowParams: {
        toolbar: "no",
        status: "no",
        width: "626px",
        height: "436px"
      },
      metaParams: {
        standart: {
          url: null,
          title: null
        },
        og: {
          url: null,
          title: null
        }
      },
      shareParams: {
        vk: {
          link: "https://vk.com/share.php?",
          params: {
            url: "url",
            title: "title"
          }
        },
        "fb": {
          link: "https://www.facebook.com/sharer.php?",
          params: {
            url: "u"
          }
        },
        ok: {
          link: "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&",
          params: {
            url: "st.shareUrl",
            title: "st.title"
          }
        },
        tw: {
          link: "https://twitter.com/intent/tweet?",
          params: {
            url: "url",
            title: "text"
          }
        },
        tel: {
          link: "https://telegram.me/share/url?",
          params: {
            url: "url",
            title: "text"
          }
        },
        "g+": {
          link: "https://plus.google.com/share?",
          params: {
            url: "url"
          }
        }
      },
      pageParams: {
        url: null,
        title: null
      },
      rules: null
    };
    let dataAttr = {
      sociate: "data-share-sociate",
      rule: "data-share-rule"
    };

    // Сокращение часто используемых частей объекта moduleInfo

    let linksClass = moduleInfo.linksClass;
    let links = moduleInfo.links;
    let options = moduleInfo.options;
    let windowParams = moduleInfo.windowParams;
    let metaParams = moduleInfo.metaParams;
    let shareParams = moduleInfo.shareParams;
    let pageParams = moduleInfo.pageParams;

    // End Сокращение часто используемых частей объекта moduleInfo

    // Установка дефолтных параметров

    module.setParams = function() {

      if (params.dynamic == true) {

        options.dynamic = params.dynamic;

      }

      if (params.rules && typeof params.rules === "object") {

        moduleInfo.rules = params.rules;

      }

      if (params.og == false) {

        options.og = params.og;

      }

      if (params.windowWidth && typeof params.windowWidth === "number") {

        windowParams.width = Math.abs(params.windowWidth) + "px";

      }

      if (params.windowHeight && typeof params.windowHeight === "number") {

        windowParams.height = Math.abs(params.windowHeight) + "px";

      }

    };

    // End Установка дефолтных параметров

    module.setParams();

    if (links || options.dynamic == true) {

      // Вспомогательные функции

      let helpFunc = {
        setWindowParams: function() { // корректное преобразование параметров открывающегося окна в строку

          let str;
          let paramsArray = [];

          for (let i in windowParams) {

            paramsArray.push(i + "=" + windowParams[i]);

          }

          str = paramsArray.join(",");

          return str;

        }
      };

      // End Вспомогательные функции

      // Сбор информации со страницы

      module.findPageInfo = function() {

        let standart = metaParams.standart;
        let og = metaParams.og;
        let titleTag = findFirstTag("title", document);
        let metaElems = findElemsTag("meta", document);

        standart.url = decodeURIComponent(window.location.toString());
        standart.title = titleTag.innerText;

        for (let meta of metaElems) {

          if (meta.getAttribute("name") == "description") {

            standart.description = meta.getAttribute("content");

          }

          if (meta.hasAttribute("property")) {

            let property = meta.getAttribute("property");
            let content = meta.getAttribute("content");

            switch (property) {
              case "og:url":
                og.url = content;
                break;
              case "og:title":
                og.title = content;
                break;
              case "og:description":
                og.description = content;
                break;
              case "og:image":
                og.img = content;
                break;
            }

          }

        }

      };

      // End Сбор информации со страницы

      // Установка всех собраных параметров для их дальнейшей передачи

      module.setPageShareParams = function() {

        for (let i in pageParams) {

          if (options.og == true) {

            pageParams[i] = metaParams.og[i] || metaParams.standart[i];

          } else {

            pageParams[i] = metaParams.standart[i];

          }

        }

      };

      // End Установка всех собраных параметров для их дальнейшей передачи

      // Открытие и передача всех параметров по ссылке

      module.openShareWindow = function(link) {

        if (link && typeof link === "object") {

          let sociate = link.getAttribute(dataAttr.sociate);
          let rule = link.getAttribute(dataAttr.rule);
          let rules = moduleInfo.rules;

          if (sociate) {

            let url = "";
            let paramsArray = [];

            for (let i in shareParams) {

              if (i == sociate) {

                let info = shareParams[i];

                url = info.link;

                for (let j in info.params) {

                  if (rule && rules[rule]) {

                    if (rules[rule][j]) {

                      paramsArray.push(info.params[j] + "=" + encodeURIComponent(rules[rule][j]));

                    } else if (pageParams[j]) {

                      paramsArray.push(info.params[j] + "=" + encodeURIComponent(pageParams[j]));

                    }

                  } else if (!rule) {

                    if (pageParams[j]) {

                      paramsArray.push(info.params[j] + "=" + encodeURIComponent(pageParams[j]));

                    }

                  }

                }

              }

            }

            url += paramsArray.join("&");
            window.open(url, "", helpFunc.setWindowParams());

          }

        }

      };

      // End Открытие и передача всех параметров по ссылке

      module.findPageInfo();
      module.setPageShareParams();

      if (links) {

        for (let link of links) {

          link.addEventListener("click", function(e) {

            e.preventDefault();
            module.openShareWindow(link);

          });

        }

      } else if (options.dynamic == true) {

        document.addEventListener("click", function(e) {

          let elem = e.target;

          if (elem.classList.contains(linksClass)) {

            e.preventDefault();

          }

        });

      }

    }

  }

};