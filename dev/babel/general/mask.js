import {findElemsClass} from "./find";
import {getAssociativeArrayLength} from "../modules/getAssociativeArrayLength";

export let Mask = function(params) {

  if (params.elems && typeof params.elems === "string") {

    let module = this;
    let moduleInfo = {
      elemsInfo: {},
      elems: findElemsClass(params.elems, document),
      elemsClass: params.elems,
      dynamic: false,
      symbol: "_"
    };
    let dataAttr = {
      pattern: "data-pattern",
      symbol: "data-symbol"
    };

    let elems = moduleInfo.elems;
    let elemsClass = moduleInfo.elemsClass;

    module.setParams = function() {

      if (params.dynamic == true) {

        moduleInfo.dynamic = params.dynamic;

      }

    };

    module.setParams();

    if (elems || moduleInfo.dynamic == true) {

      let helpFunc = {
        setOptions: function(elem, info) {

          if ((elem && typeof elem === "object") && (info && typeof info === "object")) {

            for (let i in info.options) {

              if (i == "symbol") {

                info.options[i] = elem.getAttribute(dataAttr[i]) || moduleInfo.symbol;

              } else {

                info.options[i] = elem.getAttribute(dataAttr[i]);

              }

            }

          }

        },
        currentNumber: function(numb) {

          if (numb) {

            if (typeof +numb === "number" && (numb == 0 || numb == 1 || numb == 2 || numb == 3 || numb == 4 || numb == 5 || numb == 6 || numb == 7 || numb == 8 || numb == 9)) {

              return true;

            } else {

              return false;

            }

          }

        },
        currentBtn: function(btn, mode) {

          if ((btn && typeof btn === "number") && (mode && typeof mode === "string")) {

            let answer;
            let coincidence = [];

            for (let item of [9, 13, 16, 17, 18, 19, 20, 37, 38, 39, 40, 107, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123, 144, 145]) {

              if (btn == item) {

                coincidence.push(item);

              }

            }

            if (coincidence.length == 1) {

              if (mode == "straight") {

                answer = true;

              } else if (mode == "reverse") {

                answer = false;

              }

            } else {

              if (mode == "straight") {

                answer = false;

              } else if (mode == "reverse") {

                answer = true;

              }

            }

            return answer;

          } else {

            return false;

          }

        },
        caret: {
          setPosition: function(elem, pos) {

            if ((elem && typeof elem === "object") && (pos && typeof pos === "number")) {

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

          },
          getPosition: function(elem) {

            if (elem && typeof elem === "object") {

              let pos;

              if (elem.selectionStart) {

                pos = elem.selectionStart;

              } else if (elem.createTextRange) {

                let range = elem.createTextRange();

                range.moveStart("character", elem.value.length * -1);
                pos = range.text.length;

              }

              return pos;

            }

          }
        },
        text: {
          setCaretPosition: function(elem, pos) {

            if ((elem && typeof elem === "object") && (pos && typeof pos === "number")) {

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

              }, 0.001);

            }

          },
          findPositionSymbols: function(info, str, symbol) {

            if ((info && typeof info === "object") && (str && typeof str === "string") && (symbol && typeof symbol === "string")) {

              let count = 0;
              let pos = str.indexOf(symbol);

              while (pos != -1) {

                info.patternPos.push(pos);
                count++;
                pos = str.indexOf(symbol, pos + 1);

              }

            }

          },
          pattern: function(info) {

            if (info && typeof info === "object") {

              let symbol = info.options.symbol;
              let newStr = "";
              let textPart1 = info.options.pattern.split("<");
              let writeLetter = function(letter) {

                if (letter && typeof letter === "string") {

                  if (letter == "n" || letter == "t" || letter == "a") {

                    newStr += symbol;
                    info.patternType.push(letter);

                  } else {

                    newStr += letter;

                  }

                }

              }

              for (let item of textPart1) {

                if (item.indexOf(">") != -1) {

                  let textPart2 = item.split(">");

                  for (let item of textPart2) {

                    if (item.length == 1) {

                      writeLetter(item);

                    } else {

                      for (let letter of item) {

                        writeLetter(letter);

                      }

                    }

                  }

                } else {

                  newStr += item;

                }

              }

              if (info.element.value == "") {

                info.element.value = newStr;
                helpFunc.text.findPositionSymbols(info, newStr, symbol);
                helpFunc.caret.setPosition(info.element, newStr.indexOf(symbol));

              }

            };

          },
          write: function(elem, event) {

            if ((elem && typeof elem === "object") && (event && typeof event === "object")) {

              let info;
              let key = event.key;
              let keyCode = event.keyCode;

              for (let i in moduleInfo.elemsInfo) {

                if (elem == moduleInfo.elemsInfo[i].element) {

                  info = moduleInfo.elemsInfo[i];

                }

              }

              if (info && typeof info === "object") {

                let value = elem.value;
                let symbol = info.options.symbol;

                  for (let i = 0; i < info.patternPos.length; i++) {

                    let item = info.patternPos[i];
                    let type = info.patternType[i];
                    let nextItem = info.patternPos[i + 1];
                    let prevItem = info.patternPos[i - 1];
                    let firstItem = info.patternPos[0];
                    let lastItem = info.patternPos[info.patternPos.length - 1];
                    let caret = helpFunc.caret.getPosition(elem);
                    let success = false;
                    let writeLetter = function(pos, symbol, mode) {

                      if ((pos && typeof pos) && (symbol && typeof symbol === "string") && (mode && typeof mode === "string")) {

                        if (mode == "symbol") {

                          helpFunc.caret.setPosition(elem, prevItem);

                        }

                        let part1 = value.substr(0, pos) + symbol;
                        let part2 = value.substr(pos - value.length + 1, value.length);

                        if (mode == "letter") {

                          if (part2.indexOf(info.options.symbol) == lastItem) {

                            elem.value = part1;

                          } else {

                            if (part2.length <= lastItem) {

                              elem.value = part1 + part2;

                            } else {

                              elem.value = part1;

                            }

                          }

                        } else if (mode == "symbol") {

                          if (part2.length <= lastItem) {

                            elem.value = part1 + part2;

                          } else {

                            elem.value = part1;

                          }

                        }

                        if (mode == "letter" && nextItem) {

                          helpFunc.caret.setPosition(elem, nextItem);

                        }

                      }

                    };

                    if (type == "n" && helpFunc.currentNumber(key)) {

                      success = true;

                    } else if (type == "t" && !helpFunc.currentNumber(key)) {

                      success = true;

                    } else if (type == "a") {

                      success = true;

                    }

                    if (keyCode != 8 && key.length == 1 && success == true) {

                      if (item == caret && nextItem != firstItem) {

                        writeLetter(caret, key, "letter");
                        break;

                      } else if (item > caret) {

                        writeLetter(item, key, "letter");
                        break;

                      }

                    } else if (keyCode == 8) {

                      if (elem.selectionStart - 1 == lastItem) {

                        let part1 = value.substr(0, lastItem) + symbol;

                        elem.value = part1;
                        helpFunc.text.setCaretPosition(info.element, lastItem);

                      } else if ((item == caret || item > caret) && prevItem) {

                        writeLetter(prevItem, symbol, "symbol")
                        break;

                      }

                    }

                  }

              }

            }

          },
          clear: function(info) {

            if (info && typeof info === "object") {

              let value = info.element.value;
              let symbol = info.options.symbol;

              if (value.indexOf(symbol) != -1) {

                info.element.value = "";

              }

            }

          }
        },
        focus: function(elem, mode) {

          if ((elem && typeof elem === "object") && mode) {

            for (let i in moduleInfo.elemsInfo) {

              let info = moduleInfo.elemsInfo[i];

              if (elem == moduleInfo.elemsInfo[i].element) {

                if (mode == "in") {

                  helpFunc.text.pattern(info);

                } else if (mode == "out") {

                  helpFunc.text.clear(info);

                }

              }

            }

          }

        }
      };

      module.setElemsInfo = function(mode, elem) {

        let setParams = function(elem, i) {

          if ((elem && typeof elem === "object") && typeof i === "number") {

            moduleInfo.elemsInfo[i] = {
              element: elem,
              options: {
                pattern: null,
                symbol: null
              },
              patternPos: [],
              patternType: []
            };

            helpFunc.setOptions(elem, moduleInfo.elemsInfo[i]);

          }

        };

        if (mode == "all") {

          for (let i = 0; i < elems.length; i++) {

            let elem = elems[i];

            setParams(elem, i);

          }

        } else if (mode == "single") {

          if (elem && typeof elem === "object") {

            let infoLength = getAssociativeArrayLength(moduleInfo.elemsInfo);
            let notSimilarElems = [];

            if (infoLength == 0) {

              setParams(elem, infoLength);

            } else {

              let nextIndex = infoLength + 1;

              for (let i in moduleInfo.elemsInfo) {

                if (moduleInfo.elemsInfo[i].element != elem) {

                  notSimilarElems.push(1);

                };

              };

              if (notSimilarElems.length == infoLength) {

                setParams(elem, nextIndex);

              }

            }

          }

        }

      };

      if (moduleInfo.dynamic == true) {

        document.addEventListener("focusin", function(e) {

          let elem = e.target;

          if (elem.classList.contains(elemsClass)) {

            module.setElemsInfo("single", elem);
            helpFunc.focus(elem, "in");

          }

        });

        document.addEventListener("focusout", function(e) {

          let elem = e.target;

          if (elem.classList.contains(elemsClass)) {

            helpFunc.focus(elem, "out");

          }

        });

        document.addEventListener("keydown", function(e) {

          let elem = e.target;

          if (elem.classList.contains(elemsClass)) {

            if (helpFunc.currentBtn(e.keyCode)) {

              e.preventDefault();
              helpFunc.text.write(elem, e);

            }

          }

        });

      } else {

        module.setElemsInfo("all");

        for (let item of elems) {

          item.addEventListener("focusin", function() {

            helpFunc.focus(item, "in");

          });

          item.addEventListener("focusout", function() {

            helpFunc.focus(item, "out");

          });

          item.addEventListener("keydown", function(e) {

            if (helpFunc.currentBtn(e.keyCode, "reverse")) {

              e.preventDefault();
              helpFunc.text.write(item, e);

            }

          });

        }

      }

    }

  }

};
