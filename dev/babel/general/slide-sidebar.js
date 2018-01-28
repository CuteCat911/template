// SlideSidebar - ver 1.0.2

import {findFirstClass, findElemsClass} from "./find";
import {getWindowScroll, windowScroll} from "./window-scroll";
import {applyStyle} from "./apply-style";
import {windowResize} from "./window-resize";

export let SlideSidebar = class {

  constructor(params) {

    if ((params.sidebarWrapper && typeof params.sidebarWrapper === "string") && (params.sidebar && typeof params.sidebar === "string") && (params.content && typeof params.content === "string")) {

      let $module = this;

      this.info = {
        classes: {
          sidebarWrapper: params.sidebarWrapper,
          sidebar: params.sidebar,
          content: params.content
        },
        elems: {
          sidebarWrapper: (findElemsClass(params.sidebarWrapper, document)) ? findElemsClass(params.sidebarWrapper, document) : null,
          sidebar: (findElemsClass(params.sidebar, document)) ? findElemsClass(params.sidebar, document) : null,
          content: (findFirstClass(params.content, document)) ? findFirstClass(params.content, document) : null
        },
        sidebarsInfo: {},
        params: {
          indent: {
            top: (params.indentTop <= 0 || params.indentTop >= 0) ? params.indentTop : 10,
            bottom: (params.indentBottom <= 0 || params.indentBottom >= 0) ? params.indentBottom : 10
          }
        },
        windowWidth: null,
        contentHeight: null,
        minWidth: (params.minWidth > 0) ? params.minWidth : null
      };
      this.dataAttrs = {
        indent: {
          top: "data-indent-top",
          bottom: "data-indent-bottom"
        }
      };
      this.styles = {
        fixed: {
          top: {
            marginTop: "",
            position: "fixed",
            top: "",
            width: ""
          },
          bottom: {
            position: "fixed",
            bottom: "",
            width: ""
          }
        },
        static: {
          marginTop: "",
          position: "static",
          top: "",
          bottom: "",
          width: ""
        }
      };
      this.helpFuncs = {
        scroll() {

          $module.__slide();

        },
        resize() {

          $module.__getSidebarsInfo();

          if ($module.info.params.windowWidth <= $module.info.params.minWidth) {

            $module.__clear();

          }

        }
      };

      let $elems = this.info.elems;
      let $helpFuncs = this.helpFuncs;

      if ($elems.sidebarWrapper && $elems.sidebar && $elems.content) {

        this.__getSidebarsInfo();
        windowScroll($helpFuncs.scroll);
        windowResize($helpFuncs.resize);

      }

    }

  }

  __setSizes() {

    this.info.params.windowWidth = window.innerWidth;
    this.info.params.contentHeight = this.info.elems.content.offsetHeight;

  }

  __getSidebarsInfo() {

    let $classes = this.info.classes;
    let $elems = this.info.elems;
    let $params = this.info.params;
    let $sidebarsInfo = this.info.sidebarsInfo;
    let $dataAttrs = this.dataAttrs;

    this.__setSizes();

    for (let i in $elems.sidebarWrapper) {

      let $wrapper = $elems.sidebarWrapper[i];

      $sidebarsInfo[i] = {
        wrapper: $wrapper,
        sidebar: findFirstClass($classes.sidebar, $wrapper),
        params: {
          indent: {
            top: null,
            bottom: null
          },
          margin: {
            top: null
          },
          width: null,
          height: null,
          offset: null,
          position: {
            top: null,
            bottom: null
          },
          lastScroll: 0
        }
      };

      let sidebar = $sidebarsInfo[i].sidebar;

      if (sidebar) {

        for (let j in $params.indent) {

          let size = sidebar.getAttribute($dataAttrs.indent[j]);

          if (size && (+size <= 0 || +size >= 0)) {

            $sidebarsInfo[i].params.indent[j] = +size;

          } else {

            $sidebarsInfo[i].params.indent[j] = $params.indent[j];

          }

        }

      }

    }

  }

  __slide() {

    let $elems = this.info.elems;
    let $params = this.info.params;
    let $sidebarsInfo = this.info.sidebarsInfo;
    let $fixedTop = this.styles.fixed.top;
    let $fixedBottom = this.styles.fixed.bottom;
    let $static = this.styles.static;

    if ($params.minWidth && $params.windowWidth >= $params.minWidth || !$params.minWidth) {

      let scroll = getWindowScroll();
      let windowHeight = window.innerHeight;
      let startLine = $elems.content.getBoundingClientRect().top + scroll;

      for (let i in $sidebarsInfo) {

        let info = $sidebarsInfo[i];
        let sidebar = $sidebarsInfo[i].sidebar;
        let params = info.params;
        let contentHeight = $params.contentHeight;

        params.margin.top = parseFloat(window.getComputedStyle(sidebar).marginTop);
        params.width = sidebar.offsetWidth;
        params.height = sidebar.offsetHeight;
        params.offset = sidebar.getBoundingClientRect().top + scroll;
        info.wrapper.style.height = contentHeight + "px";

        let marginTop = params.margin.top;
        let top = params.indent.top;
        let bottom = params.indent.bottom;
        let width = params.width;
        let height = params.height;
        let offset = params.offset;

        if (height < contentHeight || $params.windowWidth > $params.minWidth) {

          $fixedTop.top = params.indent.top + "px";
          $fixedTop.width = width + "px";
          $fixedBottom.bottom = params.indent.bottom + "px";
          $fixedBottom.width = width + "px";

          if (scroll > params.lastScroll) {

            if (height <= windowHeight) {

              if (scroll >= startLine - top) {

                applyStyle(sidebar, $fixedTop, "add");

              }

              if (scroll + windowHeight >= startLine + contentHeight - top + (windowHeight - height)) {

                $static.marginTop = contentHeight - height + "px";
                applyStyle(sidebar, $static, "add");

              }

            } else {

              if (scroll >= startLine + height + bottom - windowHeight && marginTop == 0) {

                params.position.bottom = "active";
                applyStyle(sidebar, $fixedBottom, "add");

              }

              if (scroll + windowHeight >= startLine + contentHeight + bottom && marginTop == 0) {

                params.position.bottom = null;
                $static.marginTop = contentHeight - height + "px";
                applyStyle(sidebar, $static, "add");

              }

              if (scroll >= offset - top && params.position.top == "active") {

                params.position.top == null;
                $static.marginTop = offset - startLine + "px";
                applyStyle(sidebar, $static, "add");

              }

              if (scroll >= offset + height + bottom - windowHeight && scroll + windowHeight < startLine + contentHeight && marginTop >= 1) {

                params.position.bottom = "active";
                $fixedBottom.marginTop = "";
                applyStyle(sidebar, $fixedBottom, "add");

              }

            }

          } else {

            if (height <= windowHeight) {

              if (scroll <= startLine - top) {

                $static.marginTop = "";
                applyStyle(sidebar, $static, "add");

              }

              if (scroll + windowHeight <= startLine + contentHeight - top + (windowHeight - height) && scroll > startLine - top) {

                applyStyle(sidebar, $fixedTop, "add");

              }

            } else {

              if (scroll + top <= offset) {

                params.position.top = "active";
                applyStyle(sidebar, $fixedTop, "add");

              }

              if (scroll + top <= startLine) {

                params.position.top = null;
                $static.marginTop = "";
                applyStyle(sidebar, $static, "add");

              }

              if (params.position.bottom == "active") {

                params.position.bottom = null;
                $static.marginTop = offset - startLine + "px";
                applyStyle(sidebar, $static, "add");

              }

            }

          }

          params.lastScroll = scroll;

        }

      }

    }

  }

  __clear() {

    let $sidebarsInfo = this.info.sidebarsInfo;

    for (let i in $sidebarsInfo) {

      this.styles.static.marginTop = "";
      applyStyle($sidebarsInfo[i].sidebar, this.styles.static, "add");

    }

  }

};