// Validation - ver. 1.1.0

import {findFirstClass, findElemsClass} from "./find";
import {applyClasses} from "./apply-classes";
import {applyStyle} from "./apply-style";
import {successClass, errorClass} from "./state-classes";
import {findCurrentParent} from "./find-current-parent";

export let Validation = class {

  constructor(params) {

    if ((params.container && typeof params.container === "string") && (params.inputs && typeof params.inputs === "string")) {

      let $module = this;

      this.info = {
        elemsClasses: {
          containers: params.container,
          inputs: params.inputs,
          submitBtns: (params.submitBtns && typeof params.submitBtns === "string") ? params.submitBtns : null,
          warnBlocks: (params.warnBlocks && typeof params.warnBlocks === "string") ? params.warnBlocks : null
        },
        elems: {
          containers: (findElemsClass(params.container, document)) ? findElemsClass(params.container) : null,
          inputs: (findElemsClass(params.inputs, document)) ? findElemsClass(params.inputs, document) : null,
          btns: null
        },
        containers: {},
        options: {
          dynamic: (params.dynamic && typeof params.dynamic === "boolean") ? params.dynamic : false,
          ajax: (params.ajax && typeof params.ajax === "boolean") ? params.ajax : false,
          classes: {
            success: null,
            error: null,
          },
          timeouts: {
            send: (params.sendTimeout >= 0) ? params.sendTimeout : 0,
            clear: (params.clearTimeout >= 0) ? params.clearTimeout : 200
          }
        },
        rules: (params.rules && typeof params.rules === "object") ? params.rules : null
      };
      this.dataAttrs = {
        noValidate: "data-no-valid",
        clearForm: "data-clear-form",
        minCheck: "data-min-check",
        customValue: "data-custom-value",
        regExp: {
          pattern: "data-reg-exp"
        },
        name: {
          form: "data-form-name",
          input: "data-input-name",
          warn: "data-warn-name"
        },
        text: {
          success: "data-success-text",
          error: "data-error-text",
          errorReg: "data-error-regtext",
          default: "data-default-text",
          errorMin: "data-error-min-text",
          errorMax: "data-error-max-text"
        },
        value: {
          min: "data-min-value",
          max: "data-max-value"
        }
      };
      this.colors = {
        green: "#257400",
        lightGreen: "rgba(37,116,0,0.3)",
        red: "#ef0505",
        lightRed: "rgba(239,5,5,0.3)"
      };
      this.styles = {
        success: {
          color: $module.colors.green,
          backgroundColor: $module.colors.lightGreen,
          border: "1px solid " + $module.colors.green
        },
        error: {
          color: $module.colors.red,
          backgroundColor: $module.colors.lightRed,
          border: "1px solid " + $module.colors.red
        }
      };
      this.helpFuncs = {
        get: {
          nameInput(input) {

            if (input && typeof input === "object") {

              let $dataAttrs = $module.dataAttrs;
              let name = input.getAttribute("name") || input.getAttribute($dataAttrs.name.input);

              return (name) ? name : null;

            }

          },
          warnBlocks(formName) {

            if (formName && typeof formName === "string") {

              let $containers = $module.info.containers;

              for (let i in $containers) {

                let currentFormName = $containers[i].el.getAttribute($module.dataAttrs.name.form);

                if (currentFormName == formName) {

                  return $containers[i].warnBlocks;

                }

              }

            }

          }
        },
        set: {
          inputParams(params) {

            let input = params.input;
            let inputInfo = params.inputInfo;
            let formName = params.formName;
            let param = params.param;

            if ((input && typeof input === "object") && (inputInfo && typeof inputInfo === "object") && (formName && typeof formName === "string") && (param && typeof param === "string")) {

              let setParam = inputInfo.params[param];
              let $rules = $module.info.rules;
              let $dataAttrs = $module.dataAttrs;

              if (setParam) {

                for (let i in setParam) {

                  if (input.hasAttribute($dataAttrs[param][i])) {

                    setParam[i] = input.getAttribute($dataAttrs[param][i]);

                  } else if ($rules) {

                    for (let j in $rules) {

                      let tagRules = $rules[j][inputInfo.tag];

                      if ((j == formName || j == "global") && tagRules) {

                        let nameRules = tagRules.name;
                        let typeRules = tagRules.type;
                        let $setParam = function(typeRules) {

                          if (typeRules && typeof typeRules === "object") {

                            if (typeRules[inputInfo.name]) {

                              if (typeRules[inputInfo.name][param]) {

                                setParam[i] = (typeRules[inputInfo.name][param][i]) ? typeRules[inputInfo.name][param][i] : null;

                              }

                            }

                          }

                        };

                        if (nameRules && typeRules) {

                          $setParam(nameRules);
                          $setParam(typeRules);

                        } else if (nameRules && !typeRules) {

                          $setParam(nameRules);

                        } else if (!nameRules && typeRules) {

                          $setParam(typeRules);

                        } else if (!nameRules && !typeRules) {

                          if (tagRules[param]) {

                            setParam[i] = (tagRules[param][i]) ? tagRules[param][i] : null;

                          }

                        }

                      }

                    }

                  }

                }

              }

            }

          }
        },
        findContainerElems(type) {

          if (type && typeof type === "string") {

            let $info = $module.info;

            for (let i in $info.containers) {

              if ($info.containers[i] && typeof $info.containers[i] === "object") {

                $info.containers[i][type] = (findElemsClass($info.elemsClasses[type], document)) ? findElemsClass($info.elemsClasses[type], document) : null;

              }

            }

          }

        },
        submit(btn, e) {

          if ((btn && typeof btn === "object") && e && typeof e === "object") {

            e.preventDefault();

            let formName = btn.getAttribute($module.dataAttrs.name.form);

            if (formName) {

              $module.validate(formName, "validate");

            }

          }

        },
        focusClear(input) {

          if (input && typeof input === "object") {

            let form = findCurrentParent(input, $module.info.elemsClasses.containers);
            let formName = form.getAttribute($module.dataAttrs.name.form);

            if (formName) {

              $module.__clearInput(input, formName, "single");

            }

          }

        }
      };

      let $elems = this.info.elems;
      let $elemsClasses = this.info.elemsClasses;
      let $options = this.info.options;
      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;

      this.__setClasses(params);
      this.findElems("all");

      if ($elemsClasses.submitBtns && $options.dynamic) {

        document.addEventListener("click", function(e) {

          let elem = e.target;

          if (elem.classList.contains($elemsClasses.submitBtns)) {

            $helpFuncs.submit(this, e);

          }

        });

      } else if ($elems.btns) {

        for (let $btn of $elems.btns) {

          $btn.addEventListener("click", function(e) {

            $helpFuncs.submit($btn, e);

          });

        }

      }

      if ($elemsClasses.inputs && $options.dynamic) {

        document.addEventListener("focus", function(e) {

          let elem = e.target;

          if (elem.classList.contains($elemsClasses.inputs)) {

            $helpFuncs.focusClear(this);

          }

        });

      } else if ($elems.inputs) {

        for (let $input of $elems.inputs) {

          $input.addEventListener("focus", function() {

            $helpFuncs.focusClear($input);

          });

        }

      }

    }

  }

  __setClasses(params) {

    if (params && typeof params === "object") {

      let $classes = this.info.options.classes;

      $classes.success = (params.defaultSuccessClass == true) ? successClass : null;
      $classes.error = (params.defaultErrorClass == true) ? errorClass : null;
      $classes.success = (params.defaultClasses == true) ? successClass : $classes.success;
      $classes.error = (params.defaultClasses == true) ? errorClass : $classes.error;
      $classes.success = (params.successClass && typeof params.successClass === "string") ? params.successClass : $classes.success;
      $classes.error = (params.errorClass && typeof params.errorClass === "string") ? params.errorClass : $classes.error;

    }

  }

  findElems(mode) {

    if (mode && typeof mode === "string") {

      let $info = this.info;
      let $elems = $info.elems;
      let $elemsClasses = $info.elemsClasses;
      let $helpFuncs = this.helpFuncs;

      if (mode == "containers") {

        $elems.containers = findElemsClass($elemsClasses.containers, document);

        if ($elems.containers) {

          for (let i in $elems.containers) {

            let container = $elems.containers[i];

            if (typeof container === "object") {

              $info.containers[i] = {
                el: container,
                inputs: null,
                warnBlocks: null
              };

            }

          }

        }

      } else if (mode == "inputs") {

        $elems.inputs = findElemsClass($elemsClasses.inputs, document);
        $helpFuncs.findContainerElems("inputs");

      } else if (mode == "warnBlocks") {

        if ($elemsClasses.warnBlocks) {

          $helpFuncs.findContainerElems("warnBlocks");

        }

      } else if (mode == "submitBtns") {

        if ($elemsClasses.submitBtns) {

          $elems.btns = (findElemsClass($elemsClasses.submitBtns, document)) ? findElemsClass($elemsClasses.submitBtns, document) : null;

        }

      } else if (mode == "all") {

        this.findElems("containers");
        this.findElems("inputs");
        this.findElems("warnBlocks");
        this.findElems("submitBtns");

      }

    }

  }

  __setData(inputInfo, data) {

    if ((inputInfo && typeof inputInfo === "object") && (data && typeof data === "object") && inputInfo.name) {

      let successText = inputInfo.params.text.success;
      let errorText = inputInfo.params.text.error;
      let errorRegText = inputInfo.params.text.errorReg;
      let value = inputInfo.value;
      let type = inputInfo.type;
      let $helpFuncs = this.helpFuncs;

      if (type == "checkbox" || type == "radio") {

        let inputs = inputInfo.otherInputs;
        let values;

        if (type == "checkbox") {

          values = [];

        }

        for (let input of inputs) {

          let name = $helpFuncs.get.nameInput(input);
          let type = input.getAttribute("type");

          if (name == inputInfo.name && type == inputInfo.type && input.checked) {

            if (type == "checkbox") {

              values.push(input.value);

            } else if (type == "radio") {

              values = input.value;

            }

          }

        }

        data.inputs[inputInfo.name] = values;

      } else {

        if (value == successText || value == errorText || value == errorRegText) {

          data.inputs[inputInfo.name] = "";

        } else {

          data.inputs[inputInfo.name] = value;

        }

      }

    }

  }

  __setErrors(params) {

    let input = params.input;
    let inputInfo = params.inputInfo;
    let warnBlocks = params.warnBlocks;
    let errors = params.errors;
    let mode = params.mode;

    if ((input && typeof input === "object") && (inputInfo && typeof inputInfo === "object") && (errors && typeof errors === "object") && (mode && typeof mode === "string")) {

      let $module = this;
      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;
      let successText = inputInfo.params.text.success;
      let errorText = inputInfo.params.text.error;
      let errorRegText = inputInfo.params.text.errorReg;
      let errorMinText = inputInfo.params.text.errorMin;
      let errorMaxText = inputInfo.params.text.errorMax;
      let inputs = inputInfo.otherInputs;
      let value = inputInfo.value;
      let applyErrorSuccess = function(params) {

        let error = params.error;
        let errorRegExp = params.errorRegExp;
        let errorMin = params.errorMin;
        let errorMax = params.errorMax;

        if (mode == "validate") {

          let $params = {
            input: input,
            inputInfo: inputInfo,
            warnBlocks: warnBlocks
          };
          let errorArray = [error, errorRegExp, errorMin, errorMax];
          let errorNameArray = ["error", "errorRegExp", "errorMin", "errorMax"];

          if (typeof error === "boolean") {

            $params.errorParams = {
              error: null,
              errorRegExp: null,
              errorMin: null,
              errorMax: null
            };

            for (let i in errorArray) {

              if (errorArray[i] == true) {

                $params.errorParams[errorNameArray[i]] = errorArray[i];

              }

            }

            $module.__addErrorSuccess($params);

          }

        }

      };

      if (inputInfo.type == "checkbox" || inputInfo.type == "radio") {

        let values;
        let min;
        let successSituation = function() {

        };

        if (inputInfo.type == "checkbox") {

          values = [];
          min = input.getAttribute($dataAttrs.minCheck);

        }

        for (let item of inputs) {

          let name = $helpFuncs.get.nameInput(item);
          let type = item.getAttribute("type");

          if (name == inputInfo.name && type == inputInfo.type && item.checked) {

            if (type == "checkbox" && !item.hasAttribute($dataAttrs.noValidate)) {

              values.push(item.value);

            } else if (type == "radio") {

              values = item.value;

            }

          }

        }

        if (min) {

          if (values.length < min) {

            applyErrorSuccess({error: true});
            errors.push(1);

          } else {

            successSituation();

          }

        } else {

          if (inputInfo.type == "checkbox") {

            if (values.length > 0) {

              successSituation();

            } else if (values.length == 0 && !input.hasAttribute($dataAttrs.noValidate)) {

              applyErrorSuccess({error: true});
              errors.push(1);

            }

          } else if (inputInfo.type == "radio") {

            if (values) {

              successSituation();

            } else {

              applyErrorSuccess({error: true});
              errors.push(1);

            }

          }

        }

      } else {

        if (!value && !input.hasAttribute($dataAttrs.noValidate)) {

          applyErrorSuccess({error: true});
          errors.push(1);

        } else if (value && !input.hasAttribute($dataAttrs.noValidate)) {

          if ((input.hasAttribute($dataAttrs.value.min) || input.hasAttribute($dataAttrs.value.max)) && (value != successText && value != errorText && value != errorRegText && value != errorMinText && value != errorMaxText)) {

            let min;
            let max;

            if (input.getAttribute($dataAttrs.value.min)) {

              min = Math.abs(parseInt(input.getAttribute($dataAttrs.value.min)));

            }

            if (input.getAttribute($dataAttrs.value.max)) {

              max = Math.abs(parseInt(input.getAttribute($dataAttrs.value.max)));

            }

            let applyErrorMin = function() {


              applyErrorSuccess({
                error: true,
                errorMin: true
              });
              errors.push(1);

            };
            let applyErrorMax = function() {

              applyErrorSuccess({
                error: true,
                errorMax: true
              });
              errors.push(1);

            };

            if (min && max) {

              if (value.length < min) {

                applyErrorMin();

              } else if (value.length > max) {

                applyErrorMax();

              } else if (value.length >= min && value.length <= max) {

                applyErrorSuccess({error: false});

              }

            } else if (min && !max) {

              if (value.length < min) {

                applyErrorMin();

              } else {

                applyErrorSuccess({
                  error: false
                });

              }

            } else if (max && !min) {

              if (value.length > max) {

                applyErrorMax();

              } else {

                applyErrorSuccess({
                  error: false
                });

              }

            } else if (!min && !max) {



            }

          } else {

            if (value == successText || value == errorText || value == errorRegText || value == errorMinText || value == errorMaxText) {

              applyErrorSuccess({
                error: true
              });
              errors.push(1);

            } else {

              let pattern = inputInfo.params.regExp.pattern;

              if (pattern) {

                let regRules = pattern.split(", ");
                let regExp = new RegExp(regRules[0], regRules[1]);

                if (regExp.test(value)) {

                  applyErrorSuccess({
                    error: false
                  });

                } else {

                  applyErrorSuccess({
                    error: true,
                    errorRegExp: true
                  });
                  errors.push(1);

                }

              } else {

                applyErrorSuccess({
                  error: false
                });

              }

            }

          }

        }

      }

    }

  }
  __validateInput(params) {

    let input = params.input;
    let form = params.form;
    let formParams = params.formParams;
    let mode = params.mode;

    if ((input && typeof input === "object") && (form && typeof form === "object") && (mode && typeof mode === "string")) {

      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;
      let inputInfo = {
        tag: input.tagName.toLowerCase(),
        type: null,
        value: null,
        name: $helpFuncs.get.nameInput(input),
        params: {
          text: {
            success: null,
            error: null,
            errorReg: null,
            default: null,
            errorMin: null,
            errorMax: null
          },
          regExp: {
            pattern: null
          }
        },
        otherInputs: form.info.inputs
      };

      switch (inputInfo.tag) {
        case "input":
          inputInfo.type = input.getAttribute("type");

          let type = inputInfo.type;

          if (type == "text" || type == "email" || type == "tel" || type == "number" || type == "password" || type == "hidden" || type == "range" || type == "search" || type == "url") {

            inputInfo.value = input.value;

          } else if (type == "file") {

            if (input.files.length > 0) {

              if (input.hasAttribute("multiple")) {

                inputInfo.value = {};

                for (let i in input.files) {

                  if (typeof input.files[i] === "object") {

                    inputInfo.value[i] = input.files[i];

                  }

                }

              } else {

                inputInfo.value = input.files[0];

              }

            }

          }

          break;
        case "textarea":
          inputInfo.type = "textarea";
          inputInfo.value = input.value;
          break;
        case "select":
          inputInfo.type = "select";
          inputInfo.value = input.value;
          break;
        default:
          inputInfo.type = "custom";
          inputInfo.value = input.getAttribute($dataAttrs.customValue);
          break;
      }

      for (let item of ["text", "regExp"]) {

        $helpFuncs.set.inputParams({
          input: input,
          inputInfo: inputInfo,
          formName: form.name,
          param: item
        });

      }

      if (mode == "validate" || mode == "data") {

        this.__setData(inputInfo, formParams.data);

      }

      if (mode != "data") {

        this.__setErrors({
          input: input,
          inputInfo: inputInfo,
          warnBlocks: form.info.warnBlocks,
          errors: formParams.errors,
          mode: mode
        });

      }

    }

  }

  validate(formName, mode) {

    if ((formName && typeof formName === "string") && (mode == "validate" || mode == "valid" || mode == "data")) {

      let $containers = this.info.containers;
      let $options = this.info.options;
      let $dataAttrs = this.dataAttrs;

      for (let i in $containers) {

        let $info = $containers[i];
        let currentFormName = $info.el.getAttribute($dataAttrs.name.form);
        let clearForm = $info.el.getAttribute($dataAttrs.clearForm);

        if (currentFormName == formName) {

          let params = {
            errors: [],
            valid: false,
            data: {
              name: formName,
              inputs: {}
            }
          };

          for (let input of $info.inputs) {

            this.__validateInput({
              input: input,
              form: {
                name: formName,
                info: $info
              },
              formParams: params,
              mode: mode
            });

          }

          if (params.errors.length == 0) {

            params.valid = true;

            if ($options.ajax == false && mode == "validate") {

              setTimeout(function() {

                location.reload();

              }, $options.timeouts.send);

            } else if ($options.ajax) {

              if (clearForm != "false") {

                setTimeout(function() {

                  this.clearForm({
                    name: formName,
                    info: $info
                  });

                }, $options.timeouts.send);

              }

            }

          } else {



          }

          if (mode == "valid") {

            return params.valid;

          } else if (mode == "data") {

            return params.data.inputs;

          }

        }

      }

    }

  }

  __writeText(params) {

    let input = params.input;
    let elem = params.elem;
    let textParams = params.textParams;
    let typeText = params.typeText;
    let elemPlace = params.elemPlace;
    let inputPlace = params.inputPlace;

    if ((input && typeof input === "object") && (elem && typeof elem === "object") && (textParams && typeof textParams === "object") && (typeText && typeof typeText === "string") && (elemPlace && typeof elemPlace === "string")) {

      let currentParam = textParams[typeText];
      let errorParam = textParams.error;
      let $dataAttrs = this.dataAttrs;
      let setDefaultValue = function(elem, place, value) {

        if ((elem && typeof elem === "object") && (place && typeof place === "string")) {

          if (elem.hasAttribute($dataAttrs.customValue)) {

            elem.setAttribute($dataAttrs.customValue, value);

          } else {

            elem[place] = value;

          }

        }

      };
      let setDefaultOtherValue = function(elem, place) {

        if ((elem && typeof elem === "object") && (place && typeof place === "string")) {

          if (place == "option") {

            elem.options[0].selected = true;

          } else if (place == "checked") {

            elem.checked = false;

          } else if (place == "file" || place == "range") {

            elem.value = null;

          }

        }

      };
      let clearInputPlace = function() {

        if (inputPlace && typeof inputPlace === "string") {

          if (inputPlace != "option" && inputPlace != "checked" && inputPlace != "file" && inputPlace != "range") {

            setDefaultValue(input, inputPlace, "");

          } else {

            setDefaultOtherValue(input, inputPlace);

          }

        }

      };

      if (typeText == "errorReg" || typeText == "errorMin" || typeText == "errorMax") {

        if (elemPlace != "option" && elemPlace != "checked" && elemPlace != "file" && elemPlace != "range") {

          if (currentParam) {

            elem[elemPlace] = currentParam;

          } else {

            elem[elemPlace] = errorParam;

          }

          clearInputPlace();

        }

      } else if (typeText == "default") {

        if (elemPlace != "option" && elemPlace != "checked" && elemPlace != "file" && elemPlace != "range") {

          if (currentParam) {

            setDefaultValue(elem, elemPlace, currentParam);

          } else {

            setDefaultValue(elem, elemPlace, "");

          }

          clearInputPlace();

        } else {

          setDefaultOtherValue(elem, elemPlace);

        }

      } else if (typeText == "notClear") {

      } else {

        if (currentParam && (elemPlace != "option" && elemPlace != "checked" && elemPlace != "file" && elemPlace != "range")) {

          elem[elemPlace] = currentParam;

        }

      }

    }

  }

  __setText(params) {

    let input = params.input;
    let elem = params.currentElem;
    let inputInfo = params.inputInfo;
    let typeText = params.typeText;

    if ((input && typeof input === "object") && (elem && typeof elem === "object") && (inputInfo && typeof inputInfo === "object") && (typeText && typeof typeText === "string")) {

      let $module = this;
      let $elemsClasses = this.info.elemsClasses;
      let applyWriteText = function(place) {

        if (place && typeof place === "string") {

          let params = {
            input: input,
            elem: elem,
            textParams: inputInfo.params.text,
            typeText: typeText,
            elemPlace: null,
            inputPlace: null
          };

          if (elem.classList.contains($elemsClasses.warnBlocks)) {

            params.elemPlace = "innerText";
            params.inputPlace = place;

          } else {

            params.elemPlace = place;

          }

          $module.__writeText(params);

        }

      };

      switch (inputInfo.tag) {
        case "input":

          let type = inputInfo.type;

          if (type == "text" || type == "email" || type == "tel" || type == "number" || type == "password" || type == "hidden" || type == "search" || type == "url") {

            applyWriteText("value");

          } else if (type == "checkbox" || type == "radio") {

            applyWriteText("checked");

          } else if (type == "file") {

            applyWriteText("file");

          } else if (type == "range") {

            applyWriteText("range");

          }

          break;
        case "textarea":
          applyWriteText("value");
          break;
        case "select":
          applyWriteText("option");
          break;
        default:
          applyWriteText("innerText");
          break;
      }

    }

  }

  __addErrorSuccess(params) {

    let input = params.input;
    let inputInfo = params.inputInfo;
    let warnBlocks = params.warnBlocks;
    let errorParams = params.errorParams;

    if ((input && typeof input === "object") && (inputInfo && typeof inputInfo === "object")) {

      let $module = this;
      let currentElem = input;
      let $classes = this.info.options.classes;
      let $dataAttrs = this.$dataAttrs;
      let $styles = this.styles;
      let applySetText = function(typeText) {

        if (typeText && typeof typeText === "string") {

          $module.__setText({
            input: input,
            currentElem: currentElem,
            inputInfo: inputInfo,
            typeText: typeText
          });

        }

      };

      if (warnBlocks) {

        for (let warnBlock of warnBlocks) {

          currentElem = (warnBlock.getAttribute($dataAttrs.name.warn) == inputInfo.name) ? warnBlock : input;

        }

      }

      if (errorParams) {

        let error = errorParams.error;
        let errorRegExp = errorParams.errorRegExp;
        let errorMin = errorParams.errorMin;
        let errorMax = errorParams.errorMax;

        if (error) {

          if ($classes.success && $classes.error) {

            applyClasses(currentElem, [$classes.success], "remove");
            applyClasses(currentElem, [$classes.error], "add");

          } else {

            applyStyle(currentElem, $styles.success, "remove");
            applyStyle(currentElem, $styles.error, "add");

          }

          if (errorRegExp) {

            applySetText("errorReg");

          } else if (errorMin) {

            applySetText("errorMin");

          } else if (errorMax) {

            applySetText("errorMax");

          } else {

            applySetText("error");

          }

        } else {

          if ($classes.success && $classes.error) {

            applyClasses(currentElem, [$classes.success], "add");
            applyClasses(currentElem, [$classes.error], "remove");

          } else {

            applyStyle(currentElem, $styles.success, "add");
            applyStyle(currentElem, $styles.error, "remove");

          }

          applySetText("success");

        }

      } else {

        if ($classes.success && $classes.error) {

          applyClasses(currentElem, [$classes.success, $classes.error], "remove");

        } else {

          applyStyle(currentElem, $styles.success, "remove");
          applyStyle(currentElem, $styles.error, "remove");

        }

        if (inputInfo.clear == "clear" || !inputInfo.clear) {

          applySetText("default");

        } else if (inputInfo.clear == "notClear") {

          applySetText("notClear");

        }

      }

    }

  }

  clearForm(form) {

    if (form) {

      let $module = this;
      let $dataAttrs = this.dataAttrs;

      if (typeof form === "string") {

        let $containers = this.info.containers;

        for (let i in $containers) {

          let $info = $containers[i];
          let currentFormName = $info.el.getAttribute($dataAttrs.name.form);

          if (form == currentFormName) {

            for (let input of $info.inputs) {

              $module.__clearInput(input, form, "all");

            }

          }

        }

      } else if (typeof form === "object") {

        for (let input of form.info.inputs) {

          $module.__clearInput(input, form.name, "all");

        }

      }

    }

  }

  __clearInput(input, formName, mode) {

    if ((input && typeof input === "object") && (formName && typeof formName === "string") && (mode && typeof mode === "string")) {

      let $dataAttrs = this.dataAttrs;
      let $helpFuncs = this.helpFuncs;
      let inputInfo = {
        tag: input.tagName.toLowerCase(),
        type: null,
        name: $helpFuncs.get.nameInput(input),
        value: null,
        clear: null,
        params: {
          text: {
            success: null,
            error: null,
            errorReg: null,
            default: null,
            errorMin: null,
            errorMax: null
          }
        }
      };
      let clearValue = function(place) {

        if (place && typeof place === "string") {

          let successText = inputInfo.params.text.success;
          let errorText = inputInfo.params.text.error;
          let errorRegText = inputInfo.params.text.errorReg;
          let errorMinText = inputInfo.params.text.errorMin;
          let errorMaxText = inputInfo.params.text.errorMax;
          let value = (place != "custom") ? input[place] : input.getAttribute($dataAttrs.customValue);

          if (mode == "all") {

            inputInfo.clear = "clear";

          } else if (mode == "single") {

            if (!value || (value && (value == successText || value == errorText || value == errorRegText || value == errorMinText || value == errorMaxText))) {


              inputInfo.clear = "clear";

            } else if (value) {

              inputInfo.clear = "notClear";

            }

          }

        }

      };

      switch (inputInfo.tag) {
        case "input":
          inputInfo.type = input.getAttribute("type");
          break;
        case "textarea":
          inputInfo.type = "textarea";
          break;
        case "select":
          inputInfo.type = "select";
          break;
        default:
          inputInfo.type = "custom";
          break;
      }

      $helpFuncs.set.inputParams({
        input: input,
        inputInfo: inputInfo,
        formName: formName,
        param: "text"
      });

      switch (inputInfo.tag) {
        case "input":
          clearValue("value");
          break;
        case "textarea":
          clearValue("value");
          break;
        case "select":
          clearValue("value");
          break;
        default:
          clearValue("custom");
          break;
      }

      this.__addErrorSuccess({
        input: input,
        inputInfo: inputInfo,
        warnBlocks: $helpFuncs.get.warnBlocks(formName)
      });

    }

  }

};