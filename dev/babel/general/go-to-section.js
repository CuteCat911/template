// GoToSection - ver 1.1.0

import {findElemsClass, findFirstClass} from "./find";
import {findCurrentParent} from "./find-current-parent";
import {getWindowScroll} from "./window-scroll";
import {scrollTo} from "./scroll-to";

export let GoToSection = class {

  constructor(params) {

    if ((params.pointers && typeof params.pointers === "string") && (params.sections && typeof params.sections === "string")) {

      let $module = this;

      this.info = {
        pointer: {
          class: params.pointers,
          elems: (findElemsClass(params.pointers, document)) ? findElemsClass(params.pointers, document) : null
        },
        section: {
          class: params.sections,
          elems: (findElemsClass(params.sections, document)) ? findElemsClass(params.sections, document) : null
        },
        header: {
          class: (params.header && typeof params.header === "string") ? params.header : null,
          el: ((params.header && typeof params.header === "string") && findFirstClass(params.header, document)) ? findFirstClass(params.header, document) : null,
          mode: (params.headerMode && typeof params.headerMode === "string") ? params.headerMode : "default",
          minWidth: (params.headerMinWidth > 0) ? params.headerMinWidth : null
        },
        options: {
          fps: (params.fps > 0) ? params.fps : 60,
          speed: (params.speed > 0) ? params.speed : 1.5,
          dynamic: (params.dynamic && typeof params.dynamic === "boolean") ? params.dynamic : false
        },
        funcs: {
          after: [],
          before: []
        }
      };
      this.dataAttrs = {
        section: "data-section-name"
      };
      this.helpFuncs = {
        scrollTo(position, fps, speed) {

          scrollTo({
            position,
            fps,
            speed
          });

        }
      };

      let $pointer = this.info.pointer;
      let $section = this.info.section;
      let $options = this.info.options;

      if ($pointer.elems && $section.elems && !$options.dynamic) {

        for (let $pointerElem of $pointer.elems) {

          $pointerElem.addEventListener("click", function() {

            $module.__goToSection($pointerElem);

          });

        }

      } else if ($options.dynamic) {

        document.addEventListener("click", function(e) {

          let elem = e.target;

          if (elem.classList.contains($pointer.class)) {

            e.preventDefault();
            $module.__findElems();
            $module.__goToSection(elem);

          } else {

            let parent = findCurrentParent(elem, $pointer.class);

            if (parent) {

              e.preventDefault();
              $module.__findElems();
              $module.__goToSection(elem);

            }

          }

        });

      }

    }

  }

  __findElems() {

    let $pointer = this.info.pointer;
    let $section = this.info.section;

    $pointer.elems = findElemsClass($pointer.class, document);
    $section.elems = findElemsClass($section.class, document);

  }

  __goToSection(pointer) {

    if (pointer && typeof pointer === "object") {

      let $section = this.info.section;
      let $header = this.info.header;
      let $fps = this.info.options.fps;
      let $speed = this.info.options.speed;
      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;
      let sectionName = pointer.getAttribute($dataAttrs.section);
      let top = getWindowScroll();

      if (sectionName) {

        for (let $sectionElem of $section.elems) {

          if ($sectionElem.getAttribute($dataAttrs.section) == sectionName) {

            this.__applyFuncs(sectionName, "before");
            top += parseInt($sectionElem.getBoundingClientRect().top);

            if ($header.el) {

              let headerHeight = parseInt($header.el.offsetHeight);

              if ($header.minWidth && $header.minWidth > window.innerWidth) {

                $helpFuncs.scrollTo(top, $fps, $speed);

              } else if (!$header.minWidth || ($header.minWidth && $header.minWidth <= window.innerWidth)) {

                if ($header.mode == "fixed") {

                  $helpFuncs.scrollTo(top - headerHeight, $fps, $speed);

                } else if ($header.mode == "lurking") {

                  if (top > scroll) {

                    $helpFuncs.scrollTo(top - headerHeight, $fps, $speed);

                  } else {

                    $helpFuncs.scrollTo(top, $fps, $speed);

                  }

                } else if ($header.mode == "default") {

                  $helpFuncs.scrollTo(top, $fps, $speed);

                }

              }

            } else {

              $helpFuncs.scrollTo(top, $fps, $speed);

            }

            this.__applyFuncs(sectionName, "after");

          }

        }

      }

    }

  }

  addFuncs(funcs, event, sectionsName) {

    if (funcs && (event && typeof event === "string")) {

      let $funcs = this.info.funcs;
      let sectionsNameArray = [];
      let addSectionName = function() {

        if (sectionsName === "string") {

          sectionsNameArray.push(sectionsName);

        } else if (Array.isArray(sectionsName)) {

          for (let sectionName of sectionsName) {

            if (typeof sectionName === "string") {

              sectionsNameArray.push(sectionName);

            }

          }

        }

      };

      if (typeof funcs === "function") {

        if (sectionsName) {

          addSectionName();
          $funcs[event].push([funcs, sectionsNameArray]);


        } else {

          $funcs[event].push(funcs);

        }

      } else if (Array.isArray(funcs)) {

        for (let func of funcs) {

          if (typeof func === "function") {

            if (sectionsName) {

              addPopupsName();
              $funcs[event].push([func, sectionsNameArray]);

            } else {

              $funcs[event].push(func);

            }

          }

        }

      }

    }

  }

  __applyFuncs(sectionName, event) {

    let $funcs = this.info.funcs;

    if ($funcs[event] && $funcs[event].length != 0) {

      for (let item of $funcs[event]) {

        if (item.length == 2) {

          for (let section of item[1]) {

            if (section == sectionName) {

              let func = item[0];

              func();

            }

          }

        } else {

          item();

        }

      }

    }

  }

};