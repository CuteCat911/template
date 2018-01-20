import {findElemsClass} from "./find";
import {getAssociativeArrayLength} from "../modules/get-associative-array-length";

export let Mask = class {

  constructor(params) {

    if (params.elems && typeof params.elems === "string") {

      let $module = this;

      this.info = {
        masks: {
          class: params.elems,
          elems: findElemsClass(params.elems, document),
          info: {}
        },
        options: {
          dynamic: (params.dynamic && typeof params.dynamic === "boolean") ? params.dynamic : false
        }
        params: {
          spaceSymbol: "_"
        }
      };
      this.dataAttrs = {
        pattern: "data=pattern",
        spaceSymbol: "data-space-symbol"
      };
      this.helpFuncs = {
        get: {
          positionSpaceSymbols(array, str, symbol) {

            if ((array && Array.isArray(array)) && typeof str === "string" && (symbol && typeof symbol === "string")) {

              let count = 0;
              let pos = str.indexOf(symbol);

              while (pos != -1) {

                array.push(pos);
                count++;
                pos = str.indexOf(symbol, pos + 1);

              }

            }

          },
          caretPosition(elem) {

            if (elem && typeof elem === "object") {

              if (elem.selectionStart) {

                return elem.selectionStart;

              } else if (elem.createTextRange) {

                let range = elem.createTextRange();

                range.moveStart("character", elem.value.length * -1);
                return range.text.length;

              }

            }

          }
        },
        set: {
          elemInfo(elem, i) {

            if ((elem && typeof elem === "object") && typeof i === "number") {

              let $info = $module.info;
              let $dataAttrs = $module.dataAttrs;
              let pattern = elem.getAttribute($dataAttrs.pattern);
              let spaceSymbol = elem.getAttribute($dataAttrs.spaceSymbol);

              $info.masks.info[i] = {
                el: elem,
                params: {
                  pattern: (pattern) ? pattern : null,
                  spaceSymbol: (spaceSymbol) ? spaceSymbol : $info.params.spaceSymbol
                },
                patterns: {
                  pos: [],
                  type: []
                }
              };

            }

          },
          letter(info, str, letter) {

            if ((info && typeof info === "object") && typeof str === "string" && (letter && typeof letter === "string")) {

              if (letter == "n" || letter == "t" || letter == "a") {

                str += info.params.spaceSymbol;
                info.patterns.type.push(letter);

              } else {

                str += letter;

              }

              return str;

            }

          },
          caretPosition(elem, pos) {

            if ((elem && typeof elem === "object") && (pos <= 0 || pos >= 0)) {

              pos = Math.abs(pos);

              setTimeout(function() {

                if (elem.setSelectionRange) {

                  elem.setSelectionRange(pos, pos);

                } else if (elem.createTextRange) {

                  let range = elem.createTextRange();

                  range.collapse(true);
                  range.moveEnd("character", pos);
                  range.moveStart("character", pos);
                  range.select();

                }

              });

            }

          }
        }
        currentBtn(btn, mode) {

          if (btn >= 0 && (mode && typeof mode === "string")) {

            let coincidences = [];
            let btns = [9, 13, 16, 17, 18, 19, 20, 37, 38, 39, 40, 107, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123, 144, 145];

            for (let item of btns) {

              if (btn == item) {

                coincidences.push(btn);

              }

            }

            if (coincidences.length == 1) {

              if (mode == "straight") {

                return true;

              } else if (mode == "reverse") {

                return false;

              }

            } else {

              if (mode == "straight") {

                return false;

              } else if (mode == "reverse") {

                return true;

              }

            }

          }

        },
        currentNumber(number) {

          if (number >= 0 && number <= 9) {

            return true;

          } else {

            return false;

          }

        }
      };

      let $info = this.info;
      let $helpFuncs = this.helpFuncs;

      if ($info.masks.elems) {

        this.__setElemsInfo("all");

        for (let elem of $info.masks.elems) {

          elem.addEventListener("focusin", function() {

            this.__focus(elem, "in");

          });

          elem.addEventListener("focusout", function() {

            this.__focus(elem, "out");

          });

          elem.addEventListener("keydown", function(e) {

            if ($helpFuncs.currentBtn(e.keyCode, "reverse")) {

              e.preventDefault();

            }

          });

        }

      } else if ($info.options.dynamic) {

        let $class = $info.masks.class;

        document.addEventListener("focusin", function(e) {

          let elem = e.target;

          if (elem.classList.contains($class)) {

            $module.__setElemsInfo("single", elem);
            $module.__focus(elem, "in");

          }

        });

        document.addEventListener("focusout", function(e) {

          let elem = e.target;

          if (elem.classList.contains($class)) {

            $module.__focus(elem, "out");

          }

        });

        document.addEventListener("keydown", function(e) {

          let elem = e.target;

          if (elem.classList.contains($class) && $helpFuncs.currentBtn(e.keyCode)) {

            e.preventDefault(); 
            $module.__write(elem, e);

          }

        });

      }

    }

  }

  __setElemsInfo(mode, elem) {

    let $masks = this.info.masks;
    let $setElemInfo = this.helpFuncs.set.elemInfo;

    if (mode == "all") {

      for (let i in $masks.elems) {

        $setElemInfo($masks.elems[i], i);

      }

    } else if (mode == "single" && (elem && typeof elem === "object")) {

      let infoLength = getAssociativeArrayLength($masks.info);

      if (infoLength == 0) {

        $setElemInfo(elem, 0);

      } else {

        let notSimilarElems = [];

        for (let i in $masks.info) {

          if ($masks.info.el != elem) {

            notSimilarElems.push(1);

          }

        }

        if (infoLength == notSimilarElems.length) {

          $setElemInfo(elem, infoLength + 1);

        }

      }

    }

  }

  __focus(elem, mode) {

    if ((elem && typeof elem === "object") && (mode && typeof mode === "string")) {

      let $masks = this.info.masks;

      for (let i in $masks.info) {

        let $info = $masks.info[i];

        if (elem == $info.el) {

          if (mode == "in") {

            this.__textPatternInfo($info);

          } else if (mode === "out") {

            this.__clearText($info);

          }

        }

      }

    }

  }

  __textPatternInfo(info) {

    if (info && typeof info === "object") {

      let $helpFuncs = this.helpFuncs;
      let params = info.params;
      let textPart1 = params.pattern.split("<");
      let newStr = "";

      if (item of textPart1) {

        if (item.indexOf(">") != -1) {

          let textPart2 = item.split(">");

          for (let item of textPart2) {

            if (item.length == 1) {

              newStr = $helpFuncs.set.letter(info, newStr, item);

            } else {

              for (let letter of item) {

                newStr = $helpFuncs.set.letter(info, newStr, letter);

              }

            }

          }

        } else {

          newStr += item;

        }

      }

      if (info.el.value == "") {

        info.el.value = newStr;
        $helpFuncs.get.positionSpaceSymbols(info.patterns.pos, newStr, params.spaceSymbol);
        $helpFuncs.set.caretPosition(info.el, newStr.indexOf(params.spaceSymbol));

      }

    }

  }

  __clearText(info) {

    if (info && typeof info === "object") {

      if (info.el.value.indexOf(info.params.spaceSymbol) != -1) {

        info.el.value = "";

      }

    }

  }

  __writeText(elem, e) {

    if ((elem && typeof elem === "object") && (e && typeof e === "object")) {

      let info;
      let key = e.key;
      let keyCode = e.keyCode;
      let $masks = this.info.masks;
      let $helpFuncs = this.helpFuncs;

      for (let i in $masks.info) {

        if (elem == $masks.info[i].el) {

          info = $masks.info[el];

        }

      }

      if (info && typeof info === "object") {

        let value = elem.value;
        let spaceSymbol = info.params.spaceSymbol;
        let $pos = info.patterns.pos;
        let $type = info.patterns.type;
        let posLength = $pos.length;

        for (i = 0; i < posLength; i++) {

          let item = $pos[i];
          let type = $type[i];
          let nextItem = $pos[i + 1];
          let prevItem = $pos[i - 1];
          let firstItem = $pos[0];
          let lastItem = $pos[posLength - 1];
          let caretPosition = $helpFuncs.get.caretPosition(elem);
          let success = false;

          if (type == "n" && $helpFuncs.currentNumber(key)) {

            success = true;

          } else if (type == "t" && !$helpFuncs.currentNumber(key)) {

            success = true;

          } else if (type == "a") {

            success = true;

          }

          if (keyCode != 8 && key.length == 1 && success == true) {

            if (item == caretPosition && nextItem != firstItem) {

              this.__writeLetter({
                elem: elem,
                positions: {
                  next: nextItem,
                  prev: prevItem,
                  last: lastItem,
                  current: caret
                },
                spaceSymbol: key,
                mode: "letter"
              });
              break;

            } else if (item > caret) {

              this.__writeLetter({
                elem: elem,
                positions: {
                  next: nextItem,
                  prev: prevItem,
                  last: lastItem,
                  current: item
                },
                spaceSymbol: key,
                mode: "letter"
              });
              break;

            }

          } else if (keyCode == 8) {

            if (elem.selectionStart) {

              if (elem.selectionStart - 1 == lastItem) {

                let part1 = value.substr(0, lastItem) + spaceSymbol;

                elem.value = part1;
                $helpFuncs.set.caretPosition(elem, lastItem);

              } else if ((item == caretPosition || item > caretPosition) && prevItem) {

                this.__writeLetter({
                  elem: elem,
                  positions: {
                    next: nextItem,
                    prev: prevItem,
                    last: lastItem,
                    current: prevItem
                  },
                  spaceSymbol: spaceSymbol,
                  mode: "symbol"
                });
                break;

              }

            }

          }

        }

      }

    }

  }

  __writeLetter(params) {

    let elem = params.elem;
    let positions = params.positions;
    let symbol = params.spaceSymbol;
    let mode = params.mode;

    if ((elem && typeof elem === "object") && (positions && typeof positions === "object") && (symbol && typeof symbol === "string") && (mode && typeof mode === "string")) {

      let $helpFuncs = this.helpFuncs;
      let value = elem.value;
      let valueLength = value.length;
      let part1 = value.substr(0, positions.current) + symbol;
      let part2 = value.substr(positions.current - valueLength + 1, valueLength);
      let setValue = function() {

        if (part2.length < positions.last) {

          elem.value = part1 + part2;

        } else {

          elem.value = part1;

        }

      };

      if (mode == "letter") {

        if (part2.indexOf(symbol) == positions.last) {

          elem.value = part1;

        } else {

          setValue();

        }

        if (positions.next) {

          $helpFuncs.set.caretPosition(elem, positions.next);

        }

      } else if (mode == "symbol") {

        $helpFuncs.set.caretPosition(elem, positions.prev);
        setValue();

      }

    }

  }

};