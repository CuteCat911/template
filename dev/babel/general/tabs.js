// Tabs - ver. 1.0.0 alpha

import {findElemsClass} from "find";
import {activeClass, openClass} from "state-classes";
import {findCurrentParent} from "find-current-parent";

export let Tabs = class {

  constructor(params) {

    if ((params.container && typeof params.container === "string") && (params.tab && typeof params.tab === "string") && (params.content && typeof params.content)) {

      let $module = this;

      this.info = {
        classes: {
          container: params.container,
          tab: params.tab,
          content: params.content
        }
        elems: {
          containers: findElemsClass(params.container, document),
          tabs: findElemsClass(params.tab, document),
          contents: findElemsClass(params.content, document)
        },
        params: {
          delay: (params.delay && typeof params.delay === "number") ? params.delay : 0
        },
        options: {
          dynamic: (params.dynamic && typeof params.boolean) ? params.dynamic : false,
          activeClass: {
            tab: (params.tabActiveClass && typeof params.tabActiveClass === "string") ? params.tabActiveClass : activeClass,
            container: (params.contentOpenClass && typeof params.contentOpenClass === "string") ? params.contentOpenClass : openClass
          }
        }
      };
      this dataAttrs = {
        tabName: "data-tab-name",
        contentName: "data-content-name"
      };
      this.helpFuncs = {

      };

      let $classes = this.info.classes;
      let $elems = this.info.elems;
      let $options = this.info.options;

      if ($elems.containers && $elems.tabs && $elems.contents && !$options.dynamic) {

        for ($tab of $elems.tabs) {

          $tab.addEventListener("click", function() {



          });

        }

      } else if ($options.dynamic) {

        document.addEventListener("click", function(e) {

          let elem = e.target;

          if (elem.classList.contains($classes.tab)) {

          } else {

            let parent = findCurrentParent(elem, $classes.tab);

            if (parent) {

              

            }

          }

        });

      }

    }

  }

}