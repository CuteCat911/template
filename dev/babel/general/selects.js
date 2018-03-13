// Selects - ver. 1.0.1

import {findFirstClass, findElemsClass, findElemsTag} from "./find";
import {findCurrentParent} from "./find-current-parent";
import {attr} from "./attr";
import {stateClasses} from "./state-classes";

export let Selects = class {

  constructor(params) {

    if (params.selects && typeof params.selects === "string") {

      let $module = this;

      this.info = {
        classes: {
          select: (params.selects != "default") ? params.selects : "select",
          selected: null,
          listWrapper: null,
          list: null,
          listItem: null,
          applyBtn: null
        },
        funcs: {
          afterOpen: [],
          afterClose: [],
          afterApply: [],
          beforeOpen: [],
          beforeClose: [],
          beforeApply: []
        }
      };
      this.dataAttrs = {
        multi: "data-multi",
        value: (params.valueAttr && typeof params.valueAttr === "string") ? params.valueAttr : "data-custom-value"
      };
      this.helpFuncs = {
        open: {
          select(select) {

            if (select && typeof select === "object") {

              let $classes = $module.info.classes;
              let $listWrapper = findFirstClass($classes.listWrapper, select);
              let $list = findFirstClass($classes.list, select);
              let $listParams = {
                margin: {
                  top: parseInt(getComputedStyle($list).marginTop),
                  bottom: parseInt(getComputedStyle($list).marginBottom) 
                },
                height: $list.offsetHeight
              };

              $helpFuncs.close.allSelects();
              $module.__applyFuncs("beforeOpen", select);
              select.classList.add(stateClasses.open);
              $listWrapper.style.height = $listParams.margin.top + $listParams.margin.bottom + $listParams.height + "px";
              $module.__applyFuncs("afterOpen", select);

            }

          }
        },
        close: {
          allSelects() {

            let $classes = $module.info.classes;
            let $selects = findElemsClass($classes.select, document);

            if ($selects) {

              for (let $select of $selects) {

                if ($select.classList.contains(stateClasses.open)) {

                  let $listWrapper = findFirstClass($classes.listWrapper, $select);

                  $module.__applyFuncs("beforeClose", $select);
                  $select.classList.remove(stateClasses.open);
                  $listWrapper.style.height = "";
                  $module.__applyFuncs("afterClose", $select);

                }

              }

            }

          }
        }
      };

      let $helpFuncs = this.helpFuncs;

      this.__setClasses();

      document.addEventListener("click", function(e) {

        let elem = e.target;

        $module.__events(elem);

      });

    }

  }

  __setClasses() {

    let $classes = this.info.classes;
    let mainClass = $classes.select;

    $classes.selected = mainClass + "__selected";
    $classes.listWrapper = mainClass + "__list-wrapper";
    $classes.list = mainClass + "__list";
    $classes.listItem = mainClass + "__list-item";
    $classes.applyBtn = mainClass + "__apply";

  }

  __events(elem) {

    if (elem && typeof elem === "object") {

      let $classes = this.info.classes;
      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;

      if (elem.classList.contains($classes.select) && !elem.classList.contains(stateClasses.open)) {

        $helpFuncs.open.select(elem);

      } else {

        let select = findCurrentParent(elem, $classes.select);

        if (select && !select.classList.contains(stateClasses.open)) {

          $helpFuncs.open.select(select);

        } else if (select && select.classList.contains(stateClasses.open) && elem.classList.contains($classes.selected)) {

          let $listWrapper = findFirstClass($classes.listWrapper, select);

          this.__applyFuncs("beforeClose", select);
          select.classList.remove(stateClasses.open);
          $listWrapper.style.height = "";
          this.__applyFuncs("afterClose", select);

        } else if (select && select.classList.contains(stateClasses.open) && elem.classList.contains($classes.listItem)) {

          if (!attr(select, $dataAttrs.multi)) {

            let $selected = findFirstClass($classes.selected, select);
            let $listWrapper = findFirstClass($classes.listWrapper, select);
            let $listItems = findElemsClass($classes.listItem, select);
            let value = attr(elem, $dataAttrs.value);
            let text = elem.innerText;

            if (value) {

              attr($selected, $dataAttrs.value, value);

            }

            for (let $item of $listItems) {

              $item.classList.remove(stateClasses.active);

            }

            this.__applyFuncs("beforeClose", select);
            elem.classList.add(stateClasses.active);
            $selected.innerText = text;
            select.classList.remove(stateClasses.open);
            $listWrapper.style.height = "";
            this.__applyFuncs("afterClose", select);

          }

        } else if (select && select.classList.contains(stateClasses.open) && elem.classList.contains($classes.applyBtn)) {

          let $listWrapper = findFirstClass($classes.listWrapper, select);

          this.__applyFuncs("beforeClose", select);
          this.__applyFuncs("beforeApply", select);
          select.classList.remove(stateClasses.open);
          $listWrapper.style.height = "";
          this.__applyFuncs("afterApply", select);
          this.__applyFuncs("afterClose", select);

        } else if (!select) {

          $helpFuncs.close.allSelects();

        }

      }

    }

  }

  addFuncs(funcs, event) {

    if (funcs && (event && typeof event === "string")) {

      let $funcs = this.info.funcs;

      if (typeof funcs === "function") {

        $funcs[event].push(funcs);

      } else if (Array.isArray(funcs)) {

        for (let func of funcs) {

          if (typeof func === "function") {

            $funcs[event].push(func);

          }

        }

      }

    }

  }

  __applyFuncs(event, select) {

    if ((event && typeof event === "string") && (select && typeof select === "object")) {

      let $funcs = this.info.funcs;

      if ($funcs[event].length) {

        for (let func of $funcs[event]) {

          func(select);

        }

      }

    }

  }

};