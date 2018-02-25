// ToTop - ver. 1.0.1

import {findElemsClass} from "./find";
import {scrollTo} from "./scroll-to";
import {findCurrentParent} from "./find-current-parent";
import {hideClass} from "./state-classes";
import {windowScroll, getWindowScroll} from "./window-scroll";

export let ToTop = class {

  constructor(params) {

    if (params.elems && typeof params.elems === "string") {

      let $module = this;

      this.info = {
        topElems: {
          class: params.elems,
          elems: findElemsClass(params.elems, document)
        },
        fps: (params.fps > 0) ? params.fps : 60,
        speed: (params.speed > 0) ? params.speed : 1.5,
        dynamic: (params.dynamic && typeof params.dynamic === "boolean") ? params.dynamic : false,
        hide: {
          active: (params.hide && typeof params.hide === "boolean") ? params.hide : false,
          indent: (params.hideIndent && (typeof params.hideIndent === "string" || params.hideIndent > 0)) ? params.hideIndent : "screen"
        }
      };
      this.helpFuncs = {
        scroll() {

          $module.__hide();

        }
      };

      let $info = this.info;
      let $helpFuncs = this.helpFuncs;

      if ($info.topElems.elems) {

        for (let $elem of $info.topElems.elems) {

          $elem.addEventListener("click", function() {
            $module.__toTop();
          });

        }

      } else if ($info.dynamic) {

        document.addEventListener("click", function(e) {

          let elem = e.target;

          if (elem.classList.contains($info.topElems.class)) {

            $module.findBtns();
            $module.__toTop();

          } else {

            let parent = findCurrentParent(elem, $info.topElems.class);

            if (parent) {

              e.preventDefault();
              $module.findBtns();
              $module.__toTop();

            }

          }

        });

      }

      windowScroll($helpFuncs.scroll);

    }

  }

  findBtns() {

    if (this.info) {

      let $topElems = this.info.topElems;

      $topElems.elems = findElemsClass($topElems.class, document);

    }

  }

  __toTop() {

    let info = this.info;

    scrollTo({
      position: 0,
      fps: info.fps,
      speed: info.speed
    });

  }

  __hide() {

    let $elems = this.info.topElems.elems;
    let $hide = this.info.hide;

    if ($hide.active && $elems) {

      let scroll = getWindowScroll();
      let indent;

      if ($hide.indent === "number") {

        indent = $hide.indent;

      } else if ($hide.indent.split("X")[0] === "screen") {

        let factor = ($hide.indent.split("X")[1] > 1) ? $hide.indent.split("X")[1] : 1;

        indent = window.innerHeight * factor;

      }

      if (indent) {

        for (let $elem of $elems) {

          if (scroll >= indent) {

            $elem.classList.remove(hideClass);

          } else {

            $elem.classList.add(hideClass);

          }

        }

      }

    }

  }

};