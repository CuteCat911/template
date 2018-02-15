// OneHeight - ver. 1.0.0

import {findElemsClass} from "./find";
import {windowResize} from "./window-resize";

export let OneHeight = class {

  constructor(elemsClass) {

    if (elemsClass && typeof elemsClass === "string") {

      let $module = this;

      this.info = {
        class: elemsClass,
        elems: findElemsClass(elemsClass, document),
        params: {
          maxHeights: {},
          windowWidth: window.innerWidth
        }
      };
      this.dataAttrs = {
        section: "data-section"
      };
      this.helpFuncs = {
        getHeight(mode) {

          if (mode && typeof mode === "string") {

            let $elems = $module.info.elems;
            let $maxHeights = $module.info.params.maxHeights;
            let $dataAttrs = $module.dataAttrs;

            if ($elems) {

              for (let $elem of $elems) {

                let $section = $elem.getAttribute($dataAttrs.section);

                if ($section) {

                  let $height;

                  $elem.style.minHeight = "";
                  $height = $elem.offsetHeight;

                  if (mode == "less") {

                    if ($maxHeights[$section] < $height || !$maxHeights[$section]) {

                      $maxHeights[$section] = $height;

                    }

                  } else if (mode == "more") {

                    if ($maxHeights[$section] > $height || !$maxHeights[$section]) {

                      $maxHeights[$section] = $height;

                    }

                    this.getHeight("less");

                  }

                }

              }

            }

          }

        },
        resize() {

          $module.setSize();

        }
      };

      this.setSize();
      windowResize($module.helpFuncs.resize);

    }

  }

  __getMaxHeights() {

    let $windowWidth = this.info.params.windowWidth;
    let $helpFuncs = this.helpFuncs;
    let windowWidth = window.innerWidth;

    if ($windowWidth >= windowWidth) {

      $helpFuncs.getHeight("less");

    } else {

      $helpFuncs.getHeight("more");

    }

    this.info.params.windowWidth = windowWidth;

  }

  setSize() {

    let $elems = this.info.elems;
    let $maxHeights = this.info.params.maxHeights;
    let $dataAttrs = this.dataAttrs;

    this.__getMaxHeights();

    if ($elems) {

      for (let $elem of $elems) {

        let $section = $elem.getAttribute($dataAttrs.section);

        $elem.style.boxSizing = "border-box";
        $elem.style.minHeight = $maxHeights[$section] + "px";

      }

    }

  }

  findElems() {

    this.info.elems = findElemsClass(this.info.class, document);
    this.setSize();

  }

}