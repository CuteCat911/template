// Tabs - ver. 1.0.1

import {findElemsClass} from "./find";
import {activeClass, openClass} from "./state-classes";
import {findCurrentParent} from "./find-current-parent";
import {attr} from "./attr";

export let Tabs = class {

  constructor(params) {

    if ((params.container && typeof params.container === "string") && (params.tab && typeof params.tab === "string") && (params.content && typeof params.content)) {

      let $module = this;

      this.info = {
        classes: {
          container: params.container,
          tab: params.tab,
          content: params.content
        },
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
            content: (params.contentOpenClass && typeof params.contentOpenClass === "string") ? params.contentOpenClass : openClass
          }
        }
      };
      this.dataAttrs = {
        tabName: "data-tab-name",
        contentName: "data-content-name"
      };

      let $classes = this.info.classes;
      let $elems = this.info.elems;
      let $options = this.info.options;

      if ($elems.containers && $elems.tabs && $elems.contents && !$options.dynamic) {

        for (let $tab of $elems.tabs) {

          $tab.addEventListener("click", function() {

            $module.changeTab(this);

          });

        }

      } else if ($options.dynamic) {

        document.addEventListener("click", function(e) {

          let elem = e.target;

          if (elem.classList.contains($classes.tab)) {

            $module.changeTab(elem);

          } else {

            let parent = findCurrentParent(elem, $classes.tab);

            if (parent) {

              $module.changeTab(parent);

            }

          }

        });

      }

    }

  }

  changeTab(tab) {

    if (tab) {

      let $module = this;
      let $classes = this.info.classes;
      let $elems = this.info.elems;
      let $options = this.info.options;
      let $dataAttrs = this.dataAttrs;

      if (typeof tab === "object") {

        let info = this.__getTabInfo(tab);

        this.__changeState(info.tabs.current, info.tabs.all, $options.activeClass.tab);
        this.__changeState(info.contents.current, info.contents.all, $options.activeClass.content);

      } else if (tab === "string") {

        let $tabs;

        if ($options.dynamic) {

          $tabs = findElemsClass($classes.tab, document);

        } else {

          $tabs = $elems.tabs;

        }

        if ($tabs) {

          for (let $tab of $tabs) {

            if (tab == attr($tab, $dataAttrs.tabName)) {

              let info = $module.__getTabInfo($tab);

              $module.__changeState(info.tabs.current, info.tabs.all, $options.activeClass.tab);
              $module.__changeState(info.contents.current, info.contents.all, $options.activeClass.content);

            }

          }

        }

      }

    }

  }

  __getTabInfo(tab) {

    if (tab && typeof tab === "object") {

      let $classes = this.info.classes;
      let $dataAttrs = this.dataAttrs;
      let tabName = attr(tab, $dataAttrs.tabName);
      let parent = findCurrentParent(tab, $classes.container);
      let info = {
        tabs: {
          current: tab,
          all: null
        },
        contents: {
          current: null,
          all: null
        }
      };
      let tabsInfo = info.tabs;
      let contentsInfo = info.contents;

      if (parent && tabName) {

        tabsInfo.all = findElemsClass($classes.tab, parent);
        contentsInfo.all = findElemsClass($classes.content, parent);

        if (tabsInfo.all && contentsInfo.all) {

          for (let content of contentsInfo.all) {

            if (tabName == attr(content, $dataAttrs.contentName)) {

              contentsInfo.current = content;

            }

          }

        }

        if ((tabsInfo.all && typeof tabsInfo.all === "object") && (contentsInfo.all && typeof contentsInfo.all === "object") && (contentsInfo.current && typeof contentsInfo.current === "object")) {

          return info;

        } else {

          return false;

        }

      }

    }

  }

  __changeState(elem, allElems, stateClass) {

    if ((elem && typeof elem === "object") && (allElems && typeof allElems === "object") && (stateClass && typeof stateClass === "string")) {

      let $params = this.info.params;

      for (let item of allElems) {

        item.classList.remove(stateClass);

      }

      setTimeout(function() {

        elem.classList.add(stateClass);

      }, $params.delay);

    }

  }

}