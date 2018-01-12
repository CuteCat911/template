// Popups - ver. 1.0.0

import {findFirstTag, findElemsClass, findElemsClasses} from "./find";
import {findCurrentParent} from "./find-current-parent";
import {applyStyle} from "./apply-style";
import {windowResize} from "./window-resize";

export let Popups = class {

  constructor(params) {

    if (params.popup && typeof params.popup === "string") {

      let $module = this;

      this.info = {
        elems: {
          popups: null,
          btnsOpen: null,
          btnsClose: null,
          wrapper: {
            el: null,
            tag: "div"
          },
          overlay: {
            el: null,
            tag: "div"
          },
          lap: {
            el: null,
            tag: "div"
          },
          html: {
            el: findFirstTag("html", document)
          },
          fixed: {
            margin: (params.fixedElemsMargin && Array.isArray(params.fixedElemsMargin)) ? findElemsClasses(params.fixedElemsMargin, document) : null,
            padding: (params.fixedElemsPadding && Array.isArray(params.fixedElemsPadding)) ? findElemsClasses(params.fixedElemsPadding, document) : null
          }
        },
        elemsClasses: {
          popups: params.popup,
          btnsOpen: (params.btnOpen && typeof params.btnOpen === "string") ? params.btnOpen : null,
          btnsClose: (params.btnClose && typeof params.btnClose === "string") ? params.btnClose : null
        },
        params: {
          popup: {
            margin: {
              top: null,
              bottom: null
            },
            indent: {
              top: (params.popupTopIndent && typeof params.popupTopIndent === "number") ? params.popupTopIndent : 32,
              bottom: (params.popupBottomIndent && typeof params.popupBottomIndent === "number") ? params.popupBottomIndent : 48
            },
            top: null,
            height: null,
            timeout: null
          },
          overlay: {
            height: null,
            hide: (params.overlayHide && typeof params.overlayHide === "boolean") ? params.overlayHide : false
          },
          clickCoords: {
            top: 0,
            left: 0
          },
          window: {
            width: null,
            height: null
          },
          html: {
            width: null
          },
          timeout: null,
          diffWidth: null,
          opened: [],
          closed: false
        },
        options: {
          dynamic: (params.dynamic && typeof params.dynamic === "boolean") ? params.dynamic : false,
          mode: (params.mode && typeof params.mode === "string") ? params.mode : null,
          classes: {
            open: ((params.openClass && typeof params.openClass === "string") && (params.closeClass && typeof params.closeClass === "string")) ? params.openClass : null,
            close: ((params.openClass && typeof params.openClass === "string") && (params.closeClass && typeof params.closeClass === "string")) ? params.closeClass : null
          }
        },
        funcs: {
          afterOpen: [],
          beforeOpen: [],
          afterClose: [],
          beforeClose: []
        }
      };
      this.dataAttrs = {
        open: "data-open-popup",
        close: "data-close-popup",
        popup: "data-popup"
      };
      this.styles = {
        wrapper: {
          default: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            overflowY: "auto",
            opacity: 0,
            zIndex: -9999
          },
          open: {
            opacity: 1,
            zIndex: 9999
          },
          close: {
            opacity: 0,
            zIndex: -9999
          }
        },
        overlay: {
          default: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: (params.overlayColor && typeof params.overlayColor === "string") ? params.overlayColor : "#000",
            willChange: "opacity",
            overflow: "hidden",
            opacity: 0,
            cursor: (params.overlayHide && typeof params.overlayHide === "boolean") ? "pointer" : "default",
            transition: (params.overlayTransitionTime && typeof params.overlayTransitionTime === "string") ? "opacity " + params.overlayTransitionTime : "opacity 0.3s",
            zIndex: 0
          },
          open: {
            height: null,
            opacity: (params.overlayOpacity && (params.overlayOpacity >= 0 && params.overlayOpacity < 1)) ? params.overlayOpacity : 1
          },
          close: {
            opacity: 0
          },
          reOpen: {
            height: null
          }
        },
        lap: {
          default: {
            position: "absolute",
            width: 0,
            height: 0,
            backgroundColor: (params.overlayColor && typeof params.overlayColor === "string") ? params.overlayColor : "#000",
            borderRadius: "50%",
            willChange: "width, height, transform, opacity",
            transform: "translate(-50%, -50%) scale(0)",
            transition: (params.overlayTransitionTime && typeof params.overlayTransitionTime === "string") ? "width " + params.overlayTransitionTime + ", height " + params.overlayTransitionTime + ", opacity 0s " + params.overlayTransitionTime + ", transform " + params.overlayTransitionTime : "width 0.3s, height 0.3s, opacity 0s 0.3s, transform 0.3s",
            opacity: 0,
            zIndex: 0
          },
          open: {
            top: null,
            left: null,
            width: null,
            height: null,
            transform: "translate(-50%, -50%) scale(1)",
            transition: (params.overlayTransitionTime && typeof params.overlayTransitionTime === "string") ? "width " + params.overlayTransitionTime + ", height " + params.overlayTransitionTime + ", opacity 0s 0s, transform " + params.overlayTransitionTime : "width 0.3s, height 0.3s, opacity 0s 0s, transform 0.3s",
            opacity: 1
          },
          close: {
            width: 0,
            height: 0,
            transform: "translate(-50%, -50%) scale(0)",
            transition: (params.overlayTransitionTime && typeof params.overlayTransitionTime === "string") ? "width " + params.overlayTransitionTime + ", height " + params.overlayTransitionTime + ", opacity 0s " + params.overlayTransitionTime + ", transform " + params.overlayTransitionTime : "width 0.3s, height 0.3s, opacity 0s 0.3s, transform 0.3s",
            opacity: 0
          },
          reOpen: {
            width: null,
            height: null
          }
        },
        popups: {
          default: {
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            willChange: "opacity",
            transition: (params.popupTransitionTime && typeof params.popupTransitionTime === "string") ? "opacity " + params.popupTransitionTime + ", z-index " + params.popupTransitionTime : "opacity 0.3s, z-index 0.3s",
            opacity: 0,
            zIndex: -1
          },
          open: {
            opacity: 1
          },
          close: {
            opacity: 0,
            zIndex: -1
          }
        },
        body: {
          open: {
            overflow: "hidden"
          }
        },
        fixedElems: {
          margin: {
            marginRight: null
          },
          padding: {
            paddingRight: null,
            boxSizing: "border-box"
          }
        }
      };
      this.helpFuncs = {
        btnsClick(type, func) {

          if ((type && typeof type === "string") && (func && typeof func === "function")) {

            let mode = type.replace("btns", "").toLowerCase();
            let applyClick = function(elem, e) {

              if ((elem && typeof elem === "object") && (e && typeof e === "object")) {

                let popupName = elem.getAttribute($dataAttrs[mode]);

                if (popupName) {

                  e.preventDefault();

                  if (mode == "close" && elem.getAttribute($dataAttrs["open"])) {

                    $module.__applyFuncs(popupName, "before" + mode[0].toUpperCase() + mode.substr(1));

                    func({
                      popupName: popupName,
                      reOpen: elem.getAttribute($dataAttrs["open"]),
                      module: $module
                    });

                    $module.__applyFuncs(popupName, "after" + mode[0].toUpperCase() + mode.substr(1));
                    $module.__applyFuncs(elem.getAttribute($dataAttrs["open"]), "beforeOpen");
                    $module.__applyFuncs(elem.getAttribute($dataAttrs["open"]), "afterOpen");

                  } else {

                    if (mode == "open" && $options.mode == "lap") {

                      $module.info.params.clickCoords.top = e.clientY;
                      $module.info.params.clickCoords.left = e.clientX;

                    }

                    $module.__applyFuncs(popupName, "before" + mode[0].toUpperCase() + mode.substr(1));

                    func({
                      popupName: popupName,
                      module: $module
                    });

                    $module.__applyFuncs(popupName, "after" + mode[0].toUpperCase() + mode.substr(1));

                  }

                }

              }

            };

            if ($options.dynamic) {

              document.addEventListener("click", function(e) {

                let $class = $elemsClasses[type];

                if ($class) {

                  let elem = e.target;

                  if (elem.classList.contains($class)) {

                    applyClick(elem, e);

                  } else {

                    let parent = findCurrentParent(elem, $class);

                    if (parent) {

                      applyClick(parent, e);

                    }

                  }

                }

              });

            } else if ($elems[type] && $elems[type].length != 0) {

              for (let item of $elems[type]) {

                item.addEventListener("click", function(e) {

                  applyClick(item, e);

                });

              }

            }

          }

        },
        closePopup(popup) {

          if (popup && typeof popup === "object") {

            let $elems = $module.info.elems;
            let $params = $module.info.params;
            let $options = $module.info.options;
            let $styles = $module.styles;

            if ($params.opened.length == 1) {

              applyStyle(document.body, $styles.body.open, "remove");
              $params.closed = true;
              applyStyle($elems.overlay.el, $styles.overlay.close, "add");
              this.set.indentFixedElems("margin", "remove");
              this.set.indentFixedElems("padding", "remove");

              if ($options.mode == "lap") {

                applyStyle($elems.lap.el, $styles.lap.close, "add");

              }

              setTimeout(function() {

                applyStyle($elems.wrapper.el, $styles.wrapper.close, "add");
                $params.closed = false;

              }, $params.timeout);

            }

            if ($options.classes.open && $options.classes.close) {

              popup.classList.remove($options.classes.open);
              popup.classList.add($options.classes.close);

            } else {

              applyStyle(popup, $styles.popups.close, "add");

            }

            this.set.closePopupHeight(popup);

            $params.opened.pop();

          }

        },
        set: {
          currentZIndex(popup) {

            if (popup && typeof popup === "object") {

              let $opened = $params.opened;
              let openedLength = $opened.length;

              if (openedLength != 0) {

                let lastOpenPopup = $opened[openedLength - 1];

                popup.style.zIndex = parseInt(getComputedStyle(lastOpenPopup).zIndex) + 2;

              } else {

                popup.style.zIndex = 2;

              }

            }

          },
          currentSize(size) {

            if (size && (size <= 0 || size >= 0)) {

              return size;

            } else {

              return 0;

            }

          },
          currentTimeout(time) {

            if (time && typeof time === "string") {

              let lastLetter = time[time.length - 1];
              let preLastLetter = time[time.length - 2];

              if (preLastLetter == "m" && lastLetter == "s") {

                time = Math.abs(+parseInt(time));

              } else if (preLastLetter != "m" && lastLetter == "s") {

                time = Math.abs(+parseFloat(time)) * 1000;

              }

              return time;

            }

          },
          indentFixedElems(type, mode) {

            if ((type && typeof type === "string") && (mode && typeof mode === "string")) {

              let $elems = $module.info.elems;
              let $params = $module.info.params;
              let $styles = $module.styles;

              $styles.fixedElems[type][type + "Right"] = $params.diffWidth + "px";

              if ($elems.fixed[type]) {

                for (let item of $elems.fixed[type]) {

                  for (let elem of item) {

                    applyStyle(elem, $styles.fixedElems[type], mode);

                  }

                }

              }

            }

          },
          resizeOverlayHeight() {
            $module.__setOverlayHeight(false, true);
          },
          closePopupHeight(popup) {

            if (popup && typeof popup === "object") {

              setTimeout(function() {

                popup.style.height = 0;

              }, $module.info.params.popup.timeout);

            }

          }
        }
      };

      let $elems = this.info.elems;
      let $elemsClasses = this.info.elemsClasses;
      let $options = this.info.options;
      let $params = this.info.params;
      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;

      $params.timeout = (params.overlayTransitionTime && typeof params.overlayTransitionTime === "string") ? this.helpFuncs.set.currentTimeout(params.overlayTransitionTime) : this.helpFuncs.set.currentTimeout("0.3s");
      $params.popup.timeout = (params.popupTransitionTime && typeof params.popupTransitionTime === "string") ? this.helpFuncs.set.currentTimeout(params.popupTransitionTime) : this.helpFuncs.set.currentTimeout("0.3s");
      this.findElems();
      this.__createOverlay();
      $helpFuncs.btnsClick("btnsOpen", this.open);
      $helpFuncs.btnsClick("btnsClose",  this.close);
      this.__overlayClose();
      windowResize($helpFuncs.set.resizeOverlayHeight);

    }

  }

  get dataAttr() {

    return this.dataAttrs;

  }

  get elems() {

    return this.info.elems;

  }

  set dataAttr(params) {

    if ((params.type && typeof params.type === "string") && (params.value && typeof params.value === "string")) {

      if (this.dataAttrs[params.type]) {

        this.dataAttrs[params.type] = params.value;

      }

    }

  }

  findElems(typeElem) {

    let $elems = this.info.elems;
    let $elemsClasses = this.info.elemsClasses;

    if (typeElem && typeof typeElem === "string") {

      let elems = findElemsClass($elemsClasses[typeElem], document);

      $elems[typeElem] = elems ? elems : null;

    } else {

      for (let i in $elems) {

        if (i == "popups" || i == "btnsOpen" || i == "btnsClose") {

          let elems = findElemsClass($elemsClasses[i], document);

          $elems[i] = elems ? elems : null;

        }

      }

    }

  }

  __createOverlay() {

    let $elems = this.info.elems;
    let $options = this.info.options;
    let $params = this.info.params;
    let $styles = this.styles;

    for (let i in $elems) {

      if (i == "wrapper" || i == "overlay" || (i == "lap" && $options.mode == "lap")) {

        $elems[i].el = document.createElement($elems[i].tag);

        if ($styles[i].default) {

          applyStyle($elems[i].el, $styles[i].default, "add");

        }

      }

    }

    if ($options.mode == "lap") {

      $elems.overlay.el.appendChild($elems.lap.el);
      $elems.overlay.el.style.backgroundColor = "transparent";

    }

    $elems.wrapper.el.appendChild($elems.overlay.el);
    $elems.html.el.appendChild($elems.wrapper.el);

    if ($elems.popups && $elems.popups.length != 0) {

      for (let popup of $elems.popups) {

        this.__addPopupToWrapper(popup);

      }

    }

  }

  __addPopupToWrapper(popup) {

    let $wrapper = this.info.elems.wrapper.el;
    let $closeClass = this.info.options.classes.close;
    let $styles = this.styles;

    if ((popup && typeof popup === "object") && ($wrapper && typeof $wrapper === "object")) {

      if ($closeClass) {

        popup.classList.add($closeClass);

      } else {

        applyStyle(popup, $styles.popups.default, "add");
        popup.style.height = 0;

      }

      $wrapper.appendChild(popup);

    }

  }

  addPopups() {

    let $popups = this.info.elems.popups;
    let popups = findElemsClass(this.info.elemsClasses.popups, document);
    let matchs = [];
    let currentPopup;
    
    for (let popup of popups) {

      if ($popups.indexOf(popup) != -1) {

        matchs.push(1);

      } else {

        currentPopup = popup;

      }

    }

    if (matchs.length == popups.length - 1) {

      this.__addPopupToWrapper(currentPopup);
      $popups.push(currentPopup);

    }

  }

  removePopup(popupName) {

    if (popupName && typeof popupName === "string") {

      let $elems = this.info.elems;
      let $dataAttrs = this.dataAttrs;

      for (let $popup of $elems.popups) {

        if ($popup && ($popup.getAttribute($dataAttrs.popup) && $popup.getAttribute($dataAttrs.popup) == popupName)) {

          let parent = $popup.parentNode;

          parent.removeChild($popup);
          this.findElems("popups");

        }

      }

    }

  }

  __setOverlayHeight(popup, resize) {

    let $params = this.info.params;

    if ((popup && typeof popup === "object") || ($params.opened.length != 0)) {

      let $elems = this.info.elems;
      let $popup = $params.popup;
      let $options = this.info.options;
      let $styles = this.styles;
      let $helpFuncs = this.helpFuncs;
      let currentPopup;
      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;

      $params.window.width = windowWidth;
      $params.window.height = windowHeight;
      $params.html.width = $elems.html.el.offsetWidth;
      $params.diffWidth = windowWidth - $params.html.width;
      $styles.body.open.paddingRight = $params.diffWidth + "px";

      if (popup) {

        currentPopup = popup;

      } else {

        let lastOpenPopup = $params.opened[$params.opened.length - 1];

        if (lastOpenPopup) {

          currentPopup = lastOpenPopup;

        }

      }

      if (currentPopup) {

        $popup.margin.top = $helpFuncs.set.currentSize(Math.abs(parseFloat(getComputedStyle(currentPopup).marginTop)));
        $popup.margin.bottom = $helpFuncs.set.currentSize(Math.abs(parseFloat(getComputedStyle(currentPopup).marginBottom)));
        $popup.top = $helpFuncs.set.currentSize(currentPopup.offsetTop);
        $popup.height = $helpFuncs.set.currentSize(Math.abs(currentPopup.offsetHeight));

        let fullPopupHeight = $popup.margin.top + $popup.margin.bottom + $popup.height;
        let fullPopupHeightWithTop = $popup.margin.top + $popup.margin.bottom + $popup.height + $popup.top;
        let popupIndentTop = $popup.indent.top;
        let popupIndentBottom = $popup.indent.bottom;

        if ($options.classes.open) {

          if (fullPopupHeightWithTop > windowHeight) {

            $styles.overlay.open.height = fullPopupHeightWithTop + popupIndentBottom + "px";
            $styles.overlay.reOpen.height = $styles.overlay.open.height;
            $params.overlay.height = parseInt($styles.overlay.open.height);

          } else {

            $styles.overlay.open.height = "100%";
            $styles.overlay.reOpen.height = "100%";
            $params.overlay.height = windowHeight;

          }

        } else {

          if (fullPopupHeight > windowHeight) {

            currentPopup.style.top = popupIndentTop + "px";
            $styles.overlay.open.height = fullPopupHeight + popupIndentTop + popupIndentBottom + "px";
            $styles.overlay.reOpen.height = $styles.overlay.open.height;
            $params.overlay.height = parseInt($styles.overlay.open.height);

          } else {

            currentPopup.style.top = "46%";
            $styles.overlay.open.height = "100%";
            $styles.overlay.reOpen.height = "100%";
            $params.overlay.height = windowHeight;

          }

        }

        if (resize) {

          if ($options.mode == "lap") {

            this.__setLapSizePosition();
            applyStyle($elems.lap.el, $styles.lap.reOpen, "add");

          }

          applyStyle($elems.overlay.el, $styles.overlay.reOpen, "add");

        }

      }

    }

  }

  __setClickCoords(coords) {

    if (coords && typeof coords === "object") {

      this.info.params.clickCoords.top = (coords.top && (coords.top <= 0 || coords.top >= 0)) ? coords.top : 0;
      this.info.params.clickCoords.left = (coords.left && (coords.left <= 0 || coords.left >= 0)) ? coords.left : 0;

    }

  }

  __setLapSizePosition() {

    let $params = this.info.params;
    let $lapStyle = this.styles.lap;
    let overlayHeight = $params.overlay.height;
    let windowWidth = $params.window.width;
    let windowHeight = $params.window.height;
    let setSize = function(size) {

      if (size && typeof size === "string") {

        for (let item of ["open", "reOpen"]) {

          $lapStyle[item].width = size;
          $lapStyle[item].height = size;

        }

      }

    };

    $lapStyle.open.top = $params.clickCoords.top + "px";
    $lapStyle.open.left = $params.clickCoords.left + "px";

    if ((overlayHeight >= windowHeight) && (overlayHeight >= windowWidth)) {

      setSize((overlayHeight * 4) + "px");

    } else if ((overlayHeight > windowHeight) && (overlayHeight <= windowWidth)) {

      setSize((windowWidth * 4) + "px");

    } else if (overlayHeight <= windowHeight) {

      if (windowWidth >= windowHeight) {

        setSize((windowWidth * 4) + "px");

      } else {

        setSize((windowHeight * 4) + "px");

      }

    }

  } 

  open(params) {

    if (params.popupName && typeof params.popupName === "string") {

      let $this = this ? this : params.module;
      let $elems = $this.info.elems;
      let $params = $this.info.params;
      let $options = $this.info.options;
      let $dataAttrs = $this.dataAttrs;
      let $styles = $this.styles;
      let $helpFuncs = $this.helpFuncs;

      $this.addPopups();
      $this.__setClickCoords(params.clickCoords);

      for (let $popup of $elems.popups) {

        let currentName = $popup.getAttribute($dataAttrs.popup);

        if (currentName && currentName == params.popupName) {

          $popup.style.height = "";
          $this.__setOverlayHeight($popup);

          if ($params.opened.length == 0) {

            applyStyle(document.body, $styles.body.open, "add");
            applyStyle($elems.wrapper.el, $styles.wrapper.open, "add");
            applyStyle($elems.overlay.el, $styles.overlay.open, "add");
            $helpFuncs.set.indentFixedElems("margin", "add");
            $helpFuncs.set.indentFixedElems("padding", "add");

            if ($options.mode == "lap") {

              $this.__setLapSizePosition();
              applyStyle($elems.lap.el, $styles.lap.open, "add");

            }

          }

          if ($options.classes.open && $options.classes.close) {

            $popup.classList.remove($options.classes.close);
            $popup.classList.add($options.classes.open);
            $this.__setOverlayHeight($popup);

          } else {

            applyStyle($popup, $styles.popups.open, "add");

          }

          $helpFuncs.set.currentZIndex($popup);

          if ($params.opened.indexOf($popup) == -1) {

            $params.opened.push($popup);

          }

        }

      }

    }

  }

  close(params) {

    let $this = this ? this : params.module;
    let $elems = $this.info.elems;
    let $params = $this.info.params;
    let $options = $this.info.options;
    let $dataAttrs = $this.dataAttrs;
    let $styles = $this.styles;
    let $helpFuncs = $this.helpFuncs;

    if (params && (params.popupName && typeof params.popupName === "string")) {

      for (let $popup of $elems.popups) {

        let currentName = $popup.getAttribute($dataAttrs.popup);

        if (params.popupName == currentName && !params.reOpen && $params.opened.length != 0) {

          $helpFuncs.closePopup($popup);

        } else if (params.reOpen) {

          if (currentName == params.popupName) {

            if ($options.classes.open && $options.classes.close) {

              $popup.classList.remove($options.classes.open);
              $popup.classList.add($options.classes.close);

            } else {

              applyStyle($popup, $styles.popups.close, "add");

            }

            $helpFuncs.set.closePopupHeight($popup);

            $params.opened.pop();

          } else if (currentName == params.reOpen) {

            if ($options.classes.open && $options.classes.close) {

              $popup.classList.remove($options.classes.close);
              $popup.classList.add($options.classes.open);

            } else {

              $helpFuncs.set.currentZIndex($popup);
              $popup.style.height = "";
              applyStyle($popup, $styles.popups.open, "add");
              $this.__setOverlayHeight($popup);

            }

            $params.opened.push($popup);
            $elems.wrapper.el.scrollTop = 0;

          }

        }

      }

    } else {

      let lastOpenPopup = $params.opened[$params.opened.length - 1];

      $helpFuncs.closePopup(lastOpenPopup);

    }

  }

  __overlayClose() {

    let $module = this;
    let $elems = this.info.elems;
    let $params = this.info.params;
    let $dataAttrs = this.dataAttrs;

    if ($elems.overlay.el && $params.overlay.hide) {

      $elems.overlay.el.addEventListener("click", function() {

        if ($params.closed == false) {

          let lastOpenPopupName = $params.opened[$params.opened.length - 1].getAttribute($dataAttrs.popup);

          $module.__applyFuncs(lastOpenPopupName, "beforeClose");
          $module.close();
          $module.__applyFuncs(lastOpenPopupName, "afterClose");

        }

      });

    }

  }

  addFuncs(funcs, event, popupsName) {

    if (funcs && (event && typeof event === "string")) {

      let $funcs = this.info.funcs;
      let popupsNameArray = [];
      let addPopupsName = function() {

        if (popupsName === "string") {

          popupsNameArray.push(popupsName);

        } else if (Array.isArray(popupsName)) {

          for (let popupName of popupsName) {

            if (typeof popupName === "string") {

              popupsNameArray.push(popupName);

            }

          }

        }

      };

      if (typeof funcs === "function") {

        if (popupsName) {

          addPopupsName();
          $funcs[event].push([funcs, popupsNameArray]);


        } else {

          $funcs[event].push(funcs);

        }

      } else if (Array.isArray(funcs)) {

        for (let func of funcs) {

          if (typeof func === "function") {

            if (popupsName) {

              addPopupsName();
              $funcs[event].push([func, popupsNameArray]);

            } else {

              $funcs[event].push(func);

            }

          }

        }

      }

    }

  }

  __applyFuncs(popupName, event) {

    let $funcs = this.info.funcs;

    if ($funcs[event] && $funcs[event].length != 0) {

      for (let item of $funcs[event]) {

        if (item.length == 2) {

          for (let popup of item[1]) {

            if (popup == popupName) {

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