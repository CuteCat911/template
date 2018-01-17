// ProportionalBlocks - ver 1.0.0

import {findElemsClass} from "./find";
import {getAssociativeArrayLength} from "./get-associative-array-length";
import {windowResize} from "./window-resize";

export let ProportionalBlocks = class {

  constructor(params) {

    if (params.blocks && typeof params.blocks === "string") {

      let $module = this;

      this.info = {
        class: params.blocks,
        elems: (findElemsClass(params.blocks, document)) ? findElemsClass(params.blocks, document) : null,
        blocksInfo: {}
      };
      this.dataAttrs = {
        ratio: "data-ratio",
        priority: "data-priority",
        adjust: "data-adjust",
        font: "data-font-proportional"
      };
      this.helpFuncs = {
        get: {
          currentFontSize(font, currentSize) {

            if (font && (currentSize <= 0 || currentSize >= 0)) {

              let param = font.split(":");
              let size = currentSize / (param[0] / param[1]);

              return size;

            }

          }
        },
        resize() {

          $module.__setBlocksInfo();
          $module.__applySize();

        }
      };

      let $helpFuncs = this.helpFuncs;

      this.__setBlocksInfo();
      this.__applySize();
      windowResize($helpFuncs.resize);

    }

  }

  __setBlocksInfo() {

    let $info = this.info;
    let $dataAttrs = this.dataAttrs;

    if ($info.elems) {

      for (let i in $info.elems) {

        let elem = $info.elems[i];

        $info.blocksInfo[i] = {
          el: elem,
          options: {
            ratio: null,
            priority: "width",
            adjust: "false",
            font: null
          }
        };

        for (let j in $info.blocksInfo[i].options) {

          let value = elem.getAttribute($dataAttrs[j]);

          if (value) {

            $info.blocksInfo[i].options[j] = value;

          }

        }

      }

    }

  }

  __setSize(info) {

    if ((info && typeof info === "object") && this.info.elems) {

      let $helpFuncs = this.helpFuncs;
      let options = info.options;

      if (options.ratio) {

        let ratio = options.ratio.split(":");
        let currentSize;
        let wantedSize;

        if (options.priority == "width") {

          currentSize = info.el.offsetWidth;
          wantedSize = currentSize * ratio[1] / ratio[0]; 

        } else if (options.priority == "height") {

          currentSize = info.el.offsetHeight;
          wantedSize = currentSize * ratio[0] / ratio[1];

        }

        if (wantedSize <= 0 || wantedSize >= 0) {

          if (options.priority == "width") {

            if (options.adjust == "true") {

              info.el.style.minHeight = wantedSize + "px";

            } else if (options.adjust == "false") {

              info.el.style.height = wantedSize + "px";

            }

          } else if (options.priority == "height") {

            if (options.adjust == "true") {

              info.el.style.minWidth = wantedSize + "px";

            } else if (options.adjust == "false") {

              info.el.style.width = wantedSize + "px";

            }

          }

        }

        if (options.font) {

          info.el.style.fontSize = $helpFuncs.get.currentSize(options.font, currentSize);

        }

      }

    }

  }

  __applySize() {

    let $blocksInfo = this.info.blocksInfo;

    if (getAssociativeArrayLength($blocksInfo) > 0) {

          for (let i in $blocksInfo) {

            this.__setSize($blocksInfo[i]);

          }

        }

  }

};