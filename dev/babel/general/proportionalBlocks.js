// ProportionalBlocks - ver 1.0.0

// Description
// * * * = * * *

// Функция конструктор, которая позволяет создавать пропорциональные блоки, с различными настройками.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. blocks (обязательный) (тип string) - класс пропорциональных блоков.
// 2. dynamic (не обязательный) (тип boolean) - включает или выключает работу с динамическими элементами (подгружаемые ajax-ом). (После каждого добавленного элемента нужно вызывать метод findBlocks());

// Пример объекта с параметрами:
// {
//   blocks: "js-block",
//   dynamic: true
// };

// Доступные атрибуты:
// 1. data-ratio - указывает соотношение сторон ("4:3"), где 4 отношение ширины к высоте, а 3 наоборот.
// 2. data-priority - указывает какая сторона приоритетней и от неё производятся в дальнейшем все расчеты. Возможные значения - "width" или "height";
// 3. data-adjust - указывает будет ли учитываться контент при его ресайзе. Возможные значения - "true" или "false".
// 4. data-font-proportional - указывает соотношение размера шрифта к приоритетной стороне, (300:15), где 300 размер приоритетной стороны в пикселях, а 15 - размер шрифта в пикселях при таком размере приоритетной стороны.

// Доступные методы:
// 1. findBlocks - Производит поиск всех блоков и перерисовывает их в соответствии с заданными параметрами. (Рекомендуется вызывать после подгружки динамических элементов).

// * * * = * * *
// End Description

import {findElemsClass} from "./find";
import {getAssociativeArrayLength} from "./getAssociativeArrayLength";
import {windowResize} from "./windowResize";

export let ProportionalBlocks = function(params) {

  if (params.blocks && typeof params.blocks === "string") {

    let module = this;
    let moduleInfo = {
      blocksClass: params.blocks,
      blocks: findElemsClass(params.blocks, document),
      blocksInfo: {},
      options: {
        dynamic: false
      }
    };
    let dataAttr = {
      ratio: "data-ratio",
      priority: "data-priority",
      adjust: "data-adjust",
      font: "data-font-proportional"
    };

    let blocksClass = moduleInfo.blocksClass;
    let blocks = moduleInfo.blocks;
    let blocksInfo = moduleInfo.blocksInfo;
    let options = moduleInfo.options;

    module.setParams = function() {

      if (params.dynamic == true) {

        options.dynamic == params.dynamic;

      }

    };

    if (blocks || options.dynamic == true) {

      let helpFunc = {
        getCurrentFontSize: function(font, currentSize) {

          if (font && (currentSize && typeof currentSize === "number")) {

            let param = font.split(":");
            let size = currentSize / (param[0] / param[1]);

            return size;

          } else {

            return false;

          }

        }
      };

      module.setBlocksInfo = function() {

        if (blocks) {

          for (let i = 0; i < blocks.length; i++) {

            let block = blocks[i];

            blocksInfo[i] = {
              element: block,
              options: {
                ratio: null,
                priority: "width",
                adjust: "false",
                font: null
              }
            };

            for (let j in blocksInfo[i].options) {

              let value = block.getAttribute(dataAttr[j]);

              if (value) {

                blocksInfo[i].options[j] = value;

              }

            }

          }

        }

      };
      module.setSize = function(info) {

        if (info && typeof info === "object") {

          let block = info.element;
          let options = info.options;
          let priority = options.priority;
          let adjust = options.adjust;
          let ratio = options.ratio;
          let font = options.font;
          let currentSize;
          let wantedSize;

          if (ratio) {

            ratio = ratio.split(":");

            if (priority == "width") {

              currentSize = block.offsetWidth;
              wantedSize = currentSize * ratio[1] / ratio[0];

            } else if (priority == "height") {

              currentSize = block.offsetHeight;
              wantedSize = currentSize * ratio[0] / ratio[1];

            }

            if (wantedSize <= 0 || wantedSize >= 0) {

              if (priority == "width") {

                if (adjust == "true") {

                  block.style.minHeight = wantedSize + "px";

                } else if (adjust == "false") {

                  block.style.height = wantedSize + "px";

                }

              } else if (priority == "height") {

                if (adjust == "true") {

                  block.style.minWidth = wantedSize + "px";

                } else if (adjust == "false") {

                  block.style.width = wantedSize + "px";

                }

              }

            }

            if (font) {

              block.style.fontSize = helpFunc.getCurrentFontSize(font, currentSize) + "px";

            }

          }

        }

      };
      module.applySetSize = function() {

        if (getAssociativeArrayLength(blocksInfo) > 0) {

          for (let i in blocksInfo) {

            module.setSize(blocksInfo[i]);

          }

        }

      };
      module.findBlocks = function() {

        moduleInfo.blocks = findElemsClass(blocksClass, document);
        module.setBlocksInfo();
        module.applySetSize();

      };

      module.setBlocksInfo();
      module.applySetSize();
      windowResize(module.applySetSize);

    }

  }

};