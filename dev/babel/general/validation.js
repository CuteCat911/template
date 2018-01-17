// // Validation - ver. 1.1.7

// // Description
// // * * * = * * *

// // Функция конструктор реализующая функционал валидации форм, сбора данных с формы и проверки на заполненность форм.

// // Принимает в себя объект с параметрами.
// // Описание параметров:
// // 1. container (обязательный) (тип string) - класс элементов выступающих в роли форм (не обязательно чтобы это был тег <form>).
// // 2. inputs (обязательный) (тип string) - класс элементов отвечающих за ввод данных, обязательно должны быть в container-е. (У каждой формы своя видимость полей ввода).
// // 3. submitBtns (не обязательный) (тип string) - класс элементов выступающих в роли кнопок отправки формы. (Проверяет форму, смотрит на её валидность, собирает данные, но не отправляет форму. В случае успешной проверки очишает форму.).
// // 4. warnBlocks (не обязательный) (тип string) - класс элементов которые будут отвечать за вывод предупреждений. (С некоторыми типами полей ввода лучше обязательно их использовать).
// // 5. dynamic (не обязательный) (тип boolean) - включает или выключает работу с динамическими элементами (подгружаемые ajax-ом).
// // 6. ajax (не обязательный) (тип boolean) - включает или выключает работу форм с ajax отправкой. Если выключен, то форма после прохождения валидации сразу отправляет на адрес указаный в action.
// // 7. defaultSuccessClass (не обязательный) (тип boolean) - если включен то всем полям прошедшим валидацию будет присваиваться класс is-success (по-умолчанию выключен и применяются дефолтные стили).
// // 8. defaultErrorClass (не обязательный) (тип boolean) - если включен то всем полям не прошедшим валидацию будет присваиваться класс is-error (по-умолчанию выключен и применяются дефолтные стили).
// // 9. defaultClasses (не обязательный) (тип boolean) - если включен то одновременно включает параметры defaultSuccessClass и defaultErrorClass.
// // 10. successClass (не обязательный) (тип string) - класс который будет добваляться всем полям прошедшим валидацию (если включен defaultSuccessClass, то successClass его перекрывает).
// // 11. errorClass (не обязательный) (тип string) - класс который будет добваляться всем полям не прошедшим валидацию (если включен defaultErrorClass, то errorClass его перекрывает).
// // 12. sendTimeout (не обязательный) (тип number) - время после которого страница будет перезагружена после отправки формы (если ajax выключен). Задается в миллисикундах.
// // 13. clearTimeout (не обязательный) (тип number) - время после которого страница будет очищена после того как успешно пройдет валидацию (если ajax включен). Задается в миллисикундах. (по-умолчанию 200).
// // 14. rules (не обязательный) (тип object) - список правил которые будут применяться к полям ввода. Позволяют задавать текст сообщений об ошибках, успешных проверках валидации и дефолтные значения для полей (Можно хранить в json файле). data атрибуты перекрывают значения правил.

// // Пример объекта с параметрами:
// // {
// //  container: "js-form",
// //  inputs: "js-input",
// //  submitBtns: "js-submit",
// //  warnBlocks: "js-warn-block",
// //  ajax: true,
// //  defaultClasses: true,
// //  clearTimeout: 350
// // }

// // Доступные атрибуты:
// // 1. data-form-name - содержит название формы. По этому названию кнопки проверки взаимодействуют с формами. (Применимо к формам и кнопкам проверки.)
// // 2. data-input-name - содержит название поля ввода. Не обязательно указывать для тех элементов у которых есть атрибут name. Без этого атрибута или атрибута name данные с поля не будут собираться. (Применимо к полям ввода.)
// // 3. data-warn-name - содерижит название элемента с предупреждением. Относиться к тому полю ввода, у которого значение аттрибута data-input-name или name идентично. (Применимо к элементам предупреждения.)
// // 4. data-success-text - содержит текст успешной проверки для поля ввода. Значение этого атрибута перекрывает значения из правил (rules). (Применимо к полям ввода.)
// // 5. data-error-text - содержит текст ошибки при непрохождении валидации полем. Значение этого атрибута перекрывает значения из правил (rules). (Применимо к полям ввода.)
// // 6. data-error-regtext - содержит текст ошибки при непрохождении валидации полем по регулярному выражению. Значение этого атрибута перекрывает значения из правил (rules). (Применимо к полям ввода.)
// // 7. data-default-text - содержит дефолтный текст поля. Применятся после сброса введеных значений формы. Значение этого атрибута перекрывает значения из правил (rules). (Применимо к полям ввода.)
// // 8. data-error-min-text - содержит текст ошибки при непрохождении валидации полем по наименьшему количеству символов. Значение этого атрибута перекрывает значения из правил (rules). (Применимо к полям ввода.)
// // 9. data-error-max-text - содержит текст ошибки при непрохождении валидации полем по наибольшему количеству символов. Значение этого атрибута перекрывает значения из правил (rules). (Применимо к полям ввода.)
// // 10. data-no-valid - указывает на элемент который не нужно валидировать, но собрать с него данные необходимо. (Применимо к полям ввода.)
// // 11. data-min-check - позволяет задать минимальное количество отмеченных чекбоксов для прохождения валидации. (Применимо ко всем <input type="checkbox"> одинаковой группы.)
// // 12. data-min-value - позволяет задать минимальное количество символов для прохождения валидации. (Применимо к полям ввода.)
// // 13. data-max-value - позволяет задать максимальное количество символов для прохождения валидации. (Применимо к полям ввода.)
// // 14. data-custom-value - позволяет задать данные для кастомных полей ввода. (Применимо ко всем полям ввода, которые не содержат теги: <select>, <input>, <textarea>.)
// // 15. data-reg-exp - позвоялет задать регулярное выражение по которому будет происходить проверка поля. (Применимо к полям ввода.)
// // 16. data-clear-form - указывает очищать ли форму после валидации. При значении "false" - ворма не будет очищена. (Применимо к форме.)

// // Доступные методы:
// // 1. errorValidation - отработает в случае не прохождения валидации формы.
// // Принимает в себя функцию или массив функций, которые будут выполнены. Во все функции первым параметром передеется информация по форме не прошедшей проверку.
// // 2. successValidation - отработает в случае успешной валидации формы.
// // Принимает в себя функцию или массив функций, которые будут выполнены. Во все функции первым параметром передеется информация по форме прошедшей проверку.
// // 3. clearForm - очищает указанную форму.
// // Принимает в себя название формы, которую нужно очистить.
// // 4. findContainers - находит все формы (рекомендуется использовать после динамической подгрузки контента).
// // 5. findInputs - находит все поля ввода и соотносит их к найденым формам (рекомендуется использовать после динамической подгрузки контента).
// // 6. findWarnBlocks - находит все элементы с предупрежедниями и соотносит их к найденым формам (рекомендуется использовать после динамической подгрузки контента).
// // 7. findSubmitBtns - находит все кнопки проверок (рекомендуется использовать после динамической подгрузки контента).
// // 8. findAllElements - выполняет одновременно методы: findContainers, findInputs, findWarnBlocks, findSubmitBtns (рекомендуется использовать после динамической подгрузки контента).
// // 9. validate - в зависимости от переданных параметров выполняет различный функционал.
// // Принимает в себя имя формы и режим работы:
// // 1. validate - валидирует указанную форму.
// // 2. valid - проверяет на заполненность указанныую форму и возвращает true или false.
// // 3. data - возвращает данные собранные с формы в виде объекта, вне зависимости свалидирована она или нет.
// // 10. removeErrorFuncs - удаляет все функции записанные в массив ошибок.
// // 11. removeSuccessFuncs - удаляет все функции записанные в массив успеха.

// // Описание правил (rules):
// // Правила представляют из себя объект с параметрами:
// // 1. Сначала указываются названия форм для которых будут применяться правила или можно указать все формы сразу параметром global (чтобы правила корректно применялись, важно чтобы global стоял в самом верху).
// // 2. Потом у форм указываются теги к которым будут применяться правила. (Правила для имен и типов приоритетней чем правила для тегов).
// // 3. У тегов указываются правила для типов (type) или имен (name). (Правила для имен приоритетней чем для типов).
// // 4. У имен или тегов задаются возможные значения имен или типов, для которых будут применяться определенные правила.
// // 5. У заданых значений могут быть заданы параметры:
// //  5.1 text c возможными параметрами:
// //    i success - задает текст успешной проверки
// //    ii error - задает текст ошибки
// //    iii errorReg - задает текст ошибки по регулярному выражению
// //    iv default - задает дефолтный текст
// //  5.2 regExp с возможными параметрами:
// //    i pattern - задает регулярное выражение для проверки поля
// // Пример правил:
// // {
// //  global: {
// //    div:{
// //      text: {
// //        success: "Успешно"
// //        error: "Провально"
// //      }
// //    },
// //    input: {
// //      type: {
// //        text: {
// //          text: {
// //            success: "Гуд",
// //            error: "Не заполено",
// //            errorReg: "Не корректно заполнено"
// //          },
// //          regExp: {
// //            pattern: "^[^a-zA-Zа-яёА-ЯЁ]{11,}$, i"
// //          }
// //        }
// //      }
// //    }
// //  },
// //  form1: {
// //    input: {
// //      type: {
// //        text: {
// //          text: {
// //            error: "Ахтунг"
// //          }
// //        },
// //        email: {
// //          text: {
// //            error: "Двойной ахтунг"
// //          }
// //        }
// //      }
// //    }
// //  },
// //  form2: {
// //    textarea: {
// //      name: {
// //        message: {
// //          text: {
// //            success: "Усе заполнено"
// //          }
// //        }
// //      }
// //    }
// //  }
// // }

// // Validation поддерживает валидацию тегов:
// // 1. input type:
// //  1.1 text
// //  1.2 email
// //  1.3 tel
// //  1.4 number
// //  1.5 password
// //  1.6 hidden
// //  1.7 search
// //  1.8 url
// //  1.9 checkbox
// //  1.10 radio
// //  1.11 file
// //  1.12 range
// // 2. select
// // 3. textarea
// // 4. любого другого, если его значение записано в атрибут data-custom-value и у него есть атрибут data-input-name

// // Описание функционала валидации.
// // Проверка формы может быть осуществлена как при помощи специальных кнопок, которые указываются в параметрах (submitBtns), так и с помощью метода (validate).
// // У каждой формы должен быть атрибут data-form-name с её названием, так же у кнопок, которые будет её валидировать должен такойже атрибут с таким же названием.
// // Если в данных собраных с формы содержаться картинки, то такие данные отправлять c кодировкой multipart/form-data (объект FormData).

// // * * * = * * *
// // End Description

// import {findFirstClass, findElemsClass} from "./find";
// import {applyClasses} from "./apply-classes";
// import {applyStyle} from "./apply-style";
// import {successClass, errorClass} from "./state-classes";
// import {findCurrentParent} from "./find-current-parent";

// export let Validation = function(params) {

//   if ((params.container && typeof params.container === "string") && (params.inputs && typeof params.inputs === "string")) {

//     let module = this;
//     let moduleInfo = {
//       elems: {
//         containers: findElemsClass(params.container, document),
//         inputs: findElemsClass(params.inputs, document),
//         btns: null
//       },
//       containers: {},
//       elemsClasses: {
//         container: params.container,
//         input: params.inputs,
//         submitBtn: null,
//         warnBlock: null
//       },
//       options: {
//         dynamic: false,
//         ajax: false,
//         classes: {
//           success: null,
//           error: null,
//         },
//         timeouts: {
//           send: 0,
//           clear: 200
//         }
//       },
//       funcs: {
//         error: [],
//         success: []
//       },
//       rules: null
//     };
//     let dataAttr = {
//       noValidate: "data-no-valid",
//       clearForm: "data-clear-form",
//       minCheck: "data-min-check",
//       customValue: "data-custom-value",
//       regExp: {
//         pattern: "data-reg-exp"
//       },
//       name: {
//         form: "data-form-name",
//         input: "data-input-name",
//         warn: "data-warn-name"
//       },
//       text: {
//         success: "data-success-text",
//         error: "data-error-text",
//         errorReg: "data-error-regtext",
//         default: "data-default-text",
//         errorMin: "data-error-min-text",
//         errorMax: "data-error-max-text"
//       },
//       value: {
//         min: "data-min-value",
//         max: "data-max-value"
//       }
//     };
//     let colors = {
//       green: "#257400",
//       lightGreen: "rgba(37,116,0,0.3)",
//       red: "#ef0505",
//       lightRed: "rgba(239,5,5,0.3)"
//     };
//     let styles = {
//       success: {
//         color: colors.green,
//         backgroundColor: colors.lightGreen,
//         border: "1px solid " + colors.green
//       },
//       error: {
//         color: colors.red,
//         backgroundColor: colors.lightRed,
//         border: "1px solid " + colors.red
//       }
//     };

//     // Сокращение часто используемых частей объекта moduleInfo

//     let elems = moduleInfo.elems;
//     let elemsClasses = moduleInfo.elemsClasses;
//     let options = moduleInfo.options;
//     let funcs = moduleInfo.funcs;

//     // End Сокращение часто используемых частей объекта moduleInfo

//     // Вспомогательные функции

//     let helpFuncs = {
//       getNameInput: function(input) {

//         if (input && typeof input === "object") {

//           let name = input.getAttribute("name") || input.getAttribute(dataAttr.name.input);

//           if (name) {

//             return name;

//           } else {

//             return null;

//           }

//         }

//       },
//       // Установка всех параметров у поля ввода которые указаны у него в опциях
//       getOptions: function(params) {

//         let input = params.input;
//         let inputInfo = params.inputInfo;
//         let formName = params.formName;
//         let option = params.option;

//         if ((input && typeof input === "object") && (inputInfo && typeof inputInfo === "object") && (formName && typeof formName === "string") && (option && typeof option === "string")) {

//           let setOption = inputInfo.options[option];
//           let rules = moduleInfo.rules;

//           if (setOption) {

//             for (let i in setOption) {

//               if (input.hasAttribute(dataAttr[option][i])) {

//                 // Взятие значения из data атрибутов

//                 setOption[i] = input.getAttribute(dataAttr[option][i]);

//               } else if (rules) {

//                 // Взятие значения из правил

//                 for (let j in rules) {

//                   let tagRules = rules[j][inputInfo.tag];

//                   if ((j == formName || j == "global") && tagRules) {

//                     let nameRules = tagRules.name;
//                     let typeRules = tagRules.type;

//                     if (nameRules && typeRules) {

//                       if (nameRules[inputInfo.name]) {

//                         if (nameRules[inputInfo.name][option]) {

//                           if (nameRules[inputInfo.name][option][i]) {

//                             setOption[i] = nameRules[inputInfo.name][option][i];

//                           }

//                         }

//                       } else if (typeRules[inputInfo.type]) {

//                         if (typeRules[inputInfo.type][option]) {

//                           if (typeRules[inputInfo.type][option][i]) {

//                             setOption[i] = typeRules[inputInfo.type][option][i];

//                           }

//                         }

//                       }

//                     } else if (nameRules && !typeRules) {

//                       if (nameRules[inputInfo.name]) {

//                         if (nameRules[inputInfo.name][option]) {

//                           if (nameRules[inputInfo.name][option][i]) {

//                             setOption[i] = nameRules[inputInfo.name][option][i];

//                           }

//                         }

//                       }

//                     } else if (!nameRules && typeRules) {

//                       if (typeRules[inputInfo.type]) {

//                         if (typeRules[inputInfo.type][option]) {

//                           if (typeRules[inputInfo.type][option][i]) {

//                             setOption[i] = typeRules[inputInfo.type][option][i];

//                           }

//                         }

//                       }

//                     } else if (!nameRules && !typeRules) {

//                       if (tagRules[option]) {

//                         if (tagRules[option][i]) {

//                           setOption[i] = tagRules[option][i];

//                         }

//                       }

//                     }

//                   }

//                 }

//               }

//             }

//           }

//         }

//       },
//       text: {
//         // Вывод текста в зависимости от его типа
//         writeText: function(params) {

//           let input = params.input;
//           let elem = params.elem;
//           let textOptions = params.textOptions;
//           let typeText = params.typeText;
//           let elemPlace = params.elemPlace;
//           let inputPlace = params.inputPlace;

//           if ((input && typeof input === "object") && (elem && typeof elem === "object") && (textOptions && typeof textOptions === "object") && (typeText && typeof typeText === "string") && (elemPlace && typeof elemPlace === "string")) {

//             let currentOption = textOptions[typeText];
//             let errorOption = textOptions.error;
//             let setDefaultValue = function(elem, place, value) {

//               if ((elem && typeof elem === "object") && (place && typeof place === "string")) {

//                 if (elem.hasAttribute(dataAttr.customValue)) {

//                   elem.setAttribute(dataAttr.customValue, value);

//                 } else {

//                   elem[place] = value;

//                 }

//               }

//             };
//             let setDefaultOtherValue = function(elem, place) {

//               // Очистка значения только для тех элементов которые принадлежат к: спискам, чекбоксам, радио кнопкам, файлам и ползункам

//               if ((elem && typeof elem === "object") && (place && typeof place === "string")) {

//                 if (place == "option") {

//                   elem.options[0].selected = true;

//                 } else if (place == "checked") {

//                   elem.checked = false;

//                 } else if (place == "file" || place == "range") {

//                   elem.value = null;

//                 }

//               }

//             };
//             let clearInputPlace = function() {

//               // Если есть элемент для вывода ошибок

//               if (inputPlace && typeof inputPlace === "string") {

//                 if (inputPlace != "option" && inputPlace != "checked" && inputPlace != "file" && inputPlace != "range") {

//                   // Очистка значения только для тех элементов которые не принадлежат к: спискам, чекбоксам, радио кнопкам, файлам и ползункам

//                   setDefaultValue(input, inputPlace, "");

//                 } else {

//                   setDefaultOtherValue(input, inputPlace);

//                 }

//               }

//             };

//             if (typeText == "errorReg" || typeText == "errorMin" || typeText == "errorMax") {

//               // Если есть какая-то ошибка связаная с определенными параметрами

//               if (elemPlace != "option" && elemPlace != "checked" && elemPlace != "file" && elemPlace != "range") {

//                 // Вывод ошибки только для тех элементов которые не принадлежат к: спискам, чекбоксам, радио кнопкам, файлам и ползункам

//                 if (currentOption) {

//                   // Если есть значение для ошибки по параметру

//                   elem[elemPlace] = currentOption;

//                 } else if (!currentOption && errorOption) {

//                   // Если нет значения для ошибки по параметру
//                   // Вывод дефолтной ошибки

//                   elem[elemPlace] = errorOption;

//                 }

//                 clearInputPlace();

//               };

//             } else if (typeText == "default") {

//               // Если нужно привести поле к дефолтному состоянию

//               if (elemPlace != "option" && elemPlace != "checked" && elemPlace != "file" && elemPlace != "range") {

//                 // Вывод ошибки только для тех элементов которые не принадлежат к: спискам, чекбоксам, радио кнопкам, файлам и ползункам

//                 if (currentOption) {

//                   setDefaultValue(elem, elemPlace, currentOption);

//                 } else {

//                   setDefaultValue(elem, elemPlace, "");

//                 };

//                 clearInputPlace();

//               } else {

//                 setDefaultOtherValue(elem, elemPlace);

//               }

//             } else if (typeText == "notClear") {

//               // Если с текстом в поле ничео не должно происходить

//             } else {

//               // Вывод остальных типов текстов

//               if (currentOption && (elemPlace != "option" && elemPlace != "checked" && elemPlace != "file" && elemPlace != "range")) {

//                 elem[elemPlace] = currentOption;
//                 clearInputPlace();

//               }

//             };

//           };

//         },
//         // Установка места вывода текста в зависимости от типа элемента
//         setText: function(params) {

//           let input = params.input;
//           let elem = params.currentElem;
//           let inputInfo = params.inputInfo;
//           let typeText = params.typeText;

//           if ((input && typeof input === "object") && (elem && typeof elem === "object") && (inputInfo && typeof inputInfo === "object") && (typeText && typeof typeText === "string")) {

//             let type = inputInfo.type;
//             let applyWriteText = function(place) {

//               if (place && typeof place === "string") {

//                 let params = {
//                   input: input,
//                   elem: elem,
//                   textOptions: inputInfo.options.text,
//                   typeText: typeText,
//                   elemPlace: null,
//                   inputPlace: null
//                 };

//                 if (elem.classList.contains(elemsClasses.warnBlock)) {

//                   // Если есть блок для предупреждения

//                   params.elemPlace = "innerText";
//                   params.inputPlace = place;

//                 } else {

//                   // Если нет блока для предупреждения

//                   params.elemPlace = place;

//                 }

//                 helpFuncs.text.writeText(params);

//               }

//             };

//             switch (inputInfo.tag) {
//               case "input":

//                 if (type == "text" || type == "email" || type == "tel" || type == "number" || type == "password" || type == "hidden" || type == "search" || type == "url") {
//                   applyWriteText("value");
//                 } else if (type == "checkbox" || type == "radio") {
//                   applyWriteText("checked");
//                 } else if (type == "file") {
//                   applyWriteText("file");
//                 } else if (type == "range") {
//                   applyWriteText("range");
//                 }

//                 break;
//               case "textarea":
//                 applyWriteText("value");
//                 break;
//               case "select":
//                 applyWriteText("option");
//                 break;
//               default:
//                 applyWriteText("innerText");
//                 break;
//             }

//           };

//         }
//       },
//       errors: {
//         // Добавление стилей и текстов для прошедших или не прошедших проверку полей
//         addErrorSuccess: function(params) {

//           let input = params.input;
//           let inputInfo = params.inputInfo;
//           let warnBlocks = params.warnBlocks;
//           let errorParams = params.errorParams;

//           if ((input && typeof input == "object") && (inputInfo && typeof inputInfo === "object")) {

//             let currentElem = input;
//             let classes = options.classes;

//             if (warnBlocks) {

//               // Проверка наличия блока для предупреждения и в случае успеха установка его в роли дефолтного элемента

//               for (let warnBlock of warnBlocks) {

//                 let name = warnBlock.getAttribute(dataAttr.name.warn);

//                 if (name == inputInfo.name) {

//                   currentElem = warnBlock;

//                 }

//               }

//             }

//             let applySetText = function(typeText) {

//               if (typeText && typeof typeText === "string") {

//                 helpFuncs.text.setText({
//                   input: input,
//                   currentElem: currentElem,
//                   inputInfo: inputInfo,
//                   typeText: typeText
//                 });

//               }

//             };

//             if (errorParams) {

//               let error = errorParams.error;
//               let errorRegExp = errorParams.errorRegExp;
//               let errorMin = errorParams.errorMin;
//               let errorMax = errorParams.errorMax;

//               if (error) {

//                 // Если есть ошибка

//                 if (classes.success && classes.error) {

//                   applyClasses(currentElem, [classes.success], "remove");
//                   applyClasses(currentElem, [classes.error], "add");

//                 } else {

//                   applyStyle(currentElem, styles.success, "remove");
//                   applyStyle(currentElem, styles.error, "add");

//                 }

//                 if (errorRegExp) {

//                   // Установка текста ошибки по регулярному выражению

//                   applySetText("errorReg");

//                 } else if (errorMin) {

//                   // Установка текста ошибки по минимальному количеству символов

//                   applySetText("errorMin");

//                 } else if (errorMax) {

//                   // Установка текста ошибки по максимальному количеству символов

//                   applySetText("errorMax");

//                 } else {

//                   // Установка текста ошибки

//                   applySetText("error");

//                 }

//               } else {

//                 // Если нет ошибки

//                 if (classes.success && classes.error) {

//                   applyClasses(currentElem, [classes.error], "remove");
//                   applyClasses(currentElem, [classes.success], "add");

//                 } else {

//                   applyStyle(currentElem, styles.error, "remove");
//                   applyStyle(currentElem, styles.success, "add");

//                 }

//                 applySetText("success");

//               }

//             } else {

//               // Если нужно очистить поле

//               if (classes.success && classes.error) {

//                 applyClasses(currentElem, [classes.success], "remove");
//                 applyClasses(currentElem, [classes.error], "remove");

//               } else {

//                 applyStyle(currentElem, styles.success, "remove");
//                 applyStyle(currentElem, styles.error, "remove");

//               }

//               if (inputInfo.clear == "clear" || !inputInfo.clear) {

//                 // Установка текста в дефолтное значение или очистка

//                 applySetText("default");

//               } else if (inputInfo.clear == "notClear") {

//                 // Текст не очищается, остается таким же каким ввел его пользователь

//                 applySetText("notClear");

//               }

//             }

//           }

//         },
//         // Запись ошибок для проверки валидности формы и установка стилей для проверенных элементов
//         setErrors: function(params) {

//           let input = params.input;
//           let inputInfo = params.inputInfo;
//           let warnBlocks = params.warnBlocks;
//           let errors = params.errors;
//           let mode = params.mode;

//           if ((input && typeof input === "object") && (inputInfo && typeof inputInfo === "object") && (errors && typeof errors === "object") && (mode && typeof mode === "string")) {

//             let successText = inputInfo.options.text.success;
//             let errorText = inputInfo.options.text.error;
//             let errorRegText = inputInfo.options.text.errorReg;
//             let errorMinText = inputInfo.options.text.errorMin;
//             let errorMaxText = inputInfo.options.text.errorMax;
//             let inputs = inputInfo.otherInputs;
//             let value = inputInfo.value;
//             let applyErrorSuccess = function(params) {

//               let error = params.error;
//               let errorRegExp = params.errorRegExp;
//               let errorMin = params.errorMin;
//               let errorMax = params.errorMax;

//               if (mode == "validate") {
                
//                 let options = {
//                   input: input,
//                   inputInfo: inputInfo,
//                   warnBlocks: warnBlocks
//                 };
//                 let errorArray = [error, errorRegExp, errorMin, errorMax];
//                 let errorNameArray = ["error", "errorRegExp", "errorMin", "errorMax"];

//                 if (typeof error === "boolean") {

//                   options.errorParams = {
//                     error: null,
//                     errorRegExp: null,
//                     errorMin: null,
//                     errorMax: null
//                   }

//                   for (let i = 0; i < errorArray.length; i++) {

//                     if (errorArray[i] == true) {

//                       options.errorParams[errorNameArray[i]] = errorArray[i];

//                     }

//                   }

//                 }

//                 helpFuncs.errors.addErrorSuccess(options);

//               }

//             };

//             if (inputInfo.type == "checkbox" || inputInfo.type == "radio") {

//               // Проверка для чекбоксов и радио кнопок

//               let values;
//               let min;
//               let successSituation = function() {

//                 if (input.checked && !input.hasAttribute(dataAttr.noValidate)) {

//                   applyErrorSuccess({
//                     error: false
//                   });

//                 } else {

//                   applyErrorSuccess();

//                 }

//               }

//               if (inputInfo.type == "checkbox") {

//                 values = [];
//                 min = input.getAttribute(dataAttr.minCheck);

//               }

//               for (let item of inputs) {

//                 let name = helpFuncs.getNameInput(item);
//                 let type = item.getAttribute("type");

//                 if (name == inputInfo.name && type == inputInfo.type && item.checked) {

//                   if (type == "checkbox" && !item.hasAttribute(dataAttr.noValidate)) {

//                     values.push(item.value);

//                   } else if (type == "radio") {

//                     values = item.value;

//                   }

//                 }

//               }

//               if (min) {

//                 // Если есть минимальное допустимое количество отмеченных чекбоксов

//                 if (values.length < min) {

//                   applyErrorSuccess({
//                     error: true
//                   });
//                   errors.push(1);

//                 } else {

//                   successSituation();

//                 }

//               } else {

//                 // Если нет минимального допустимого количества отмеченных чекбоксов

//                 if (inputInfo.type == "checkbox") {

//                   if (values.length > 0 ) {

//                     successSituation();

//                   } else if (values.length == 0 && !input.hasAttribute(dataAttr.noValidate)) {

//                     applyErrorSuccess({
//                       error: true
//                     });
//                     errors.push(1);

//                   }

//                 } else if (inputInfo.type == "radio") {

//                   if (values) {

//                     successSituation();

//                   } else {

//                     applyErrorSuccess({
//                       error: true
//                     });
//                     errors.push(1);

//                   }

//                 }

//               }

//             } else {

//               // Проверка остальных элементов

//               if (!value && !input.hasAttribute(dataAttr.noValidate)) {

//                 // Если нет значения и нет атрибута позволяющего не валидировать поле

//                 applyErrorSuccess({
//                   error: true
//                 });
//                 errors.push(1);

//               } else if (value && !input.hasAttribute(dataAttr.noValidate)) {

//                 // Если есть значение и нет атрибута позволяющего не валидировать поле

//                 if ((input.hasAttribute(dataAttr.value.min) || input.hasAttribute(dataAttr.value.max)) && (value != successText && value != errorText && value != errorRegText && value != errorMinText && value != errorMaxText)) {

//                   // Если есть минимальное или максимальное количество символов у значения

//                   let min;
//                   let max;

//                   if (input.getAttribute(dataAttr.value.min)) {

//                     min = Math.abs(parseInt(input.getAttribute(dataAttr.value.min)));

//                   };

//                   if (input.getAttribute(dataAttr.value.max)) {

//                     max = Math.abs(parseInt(input.getAttribute(dataAttr.value.max)));

//                   }

//                   let applyErrorMin = function() {

//                     applyErrorSuccess({
//                       error: true,
//                       errorMin: true
//                     });
//                     errors.push(1);

//                   };
//                   let applyErrorMax = function() {

//                     applyErrorSuccess({
//                       error: true,
//                       errorMax: true
//                     });
//                     errors.push(1);

//                   };

//                   if (min && max) {

//                     if (value.length < min) {

//                       applyErrorMin();

//                     } else if (value.length > max) {

//                       applyErrorMax();

//                     } else if (value.length >= min && value.length <= max) {

//                       applyErrorSuccess({
//                         error: false
//                       });

//                     }

//                   } else if (min && !max) {

//                     if (value.length < min) {

//                       applyErrorMin();

//                     } else {

//                       applyErrorSuccess({
//                         error: false
//                       });

//                     }

//                   } else if (max && !min) {

//                     if (value.length > max) {

//                       applyErrorMax();

//                     } else {

//                       applyErrorSuccess({
//                         error: false
//                       });

//                     }

//                   } else if (!min && !mix) {

//                     console.error();

//                   }

//                 } else {

//                   // Если нет минимального или максимального количества символов у значения

//                   if (value == successText || value == errorText || value == errorRegText || value == errorMinText || value == errorMaxText) {

//                     // Если значение похоже на тексты ошибок

//                     applyErrorSuccess({
//                       error: true
//                     });
//                     errors.push(1);

//                   } else {

//                     // Если значение не похоже на тексты ошибок

//                     let pattern = inputInfo.options.regExp.pattern;

//                     if (pattern) {

//                       // Если есть проверка значения по регулярному выражению

//                       let regRules = pattern.split(", ");
//                       let regExp = new RegExp(regRules[0], regRules[1]);

//                       if (regExp.test(value)) {

//                         // Если значение удовлетворяет регулярному выражению

//                         applyErrorSuccess({
//                           error: false
//                         });

//                       } else {

//                         // Если значение не удовлетворяет регулярному выражению

//                         applyErrorSuccess({
//                           error: true,
//                           errorRegExp: true
//                         });
//                         errors.push(1);

//                       }

//                     } else {

//                       // Если поле заполенено и нет проверки по регулярному выражению

//                       applyErrorSuccess({
//                         error: false
//                       });

//                     }

//                   }

//                 }

//               }

//             }

//           }

//         }
//       },
//       clear: {
//         // Очистка поля ввода
//         clearInput: function(input, formName, mode) {

//           if ((input && typeof input === "object") && (formName && typeof formName === "string") && (mode && typeof mode === "string")) {

//             let inputInfo = {
//               tag: input.tagName.toLowerCase(),
//               type: null,
//               name: helpFuncs.getNameInput(input),
//               value: null,
//               clear: null,
//               options: {
//                 text: {
//                   success: null,
//                   error: null,
//                   errorReg: null,
//                   default: null,
//                   errorMin: null,
//                   errorMax: null
//                 }
//               }
//             };
//             let warnBlocks;
//             let getWarnBlocks = function() {

//               let warnBlocks;

//               for (let i in moduleInfo.containers) {

//                 let containerInfo = moduleInfo.containers[i];
//                 let currentFormName = containerInfo.element.getAttribute(dataAttr.name.form);

//                 if (currentFormName == formName) {

//                   warnBlocks = containerInfo.warnBlocks;

//                 }


//               }

//               return warnBlocks;

//             };
//             let clearValue = function(place) {

//               if (place && typeof place === "string") {

//                 let successText = inputInfo.options.text.success;
//                 let errorText = inputInfo.options.text.error;
//                 let errorRegText = inputInfo.options.text.errorReg;
//                 let errorMinText = inputInfo.options.text.errorMin;
//                 let errorMaxText = inputInfo.options.text.errorMax;
//                 let value;

//                 if (place != "custom") {

//                   value = input[place];

//                 } else {

//                   value = input.getAttribute(dataAttr.customValue);

//                 }

//                 if (mode == "all") {

//                   // Режим для очистки всей формы

//                   inputInfo.clear = "clear";

//                 } else if (mode == "single") {

//                   // Режим для очистки одного поля

//                   if (!value || (value && (value == successText || value == errorText || value == errorRegText || value == errorMinText || value == errorMaxText))) {

//                     // Если значение поля отсутствует или идентично сообщениям об ошибке

//                     inputInfo.clear = "clear";

//                   } else {

//                     // Если значение поля уникально

//                     inputInfo.clear = "notClear";

//                   }

//                 }

//               }

//             };

//             switch (inputInfo.tag) {
//               case "input":
//                 inputInfo.type = input.getAttribute("type");
//                 break;
//               case "textarea":
//                 inputInfo.type = "textarea";
//                 break;
//               case "select":
//                 inputInfo.type = "select";
//                 break;
//               default:
//                 inputInfo.type = "custom";
//                 break;
//             }

//             helpFuncs.getOptions({
//               input: input,
//               inputInfo: inputInfo,
//               formName: formName,
//               option: "text"
//             });

//             switch (inputInfo.tag) {
//               case "input":
//                 clearValue("value");
//                 break;
//               case "textarea":
//                 clearValue("value");
//                 break;
//               case "select":
//                 clearValue("value");
//                 break;
//               default:
//                 clearValue("custom");
//                 break;
//             }

//             warnBlocks = getWarnBlocks();
//             helpFuncs.errors.addErrorSuccess({
//               input: input,
//               inputInfo: inputInfo,
//               warnBlocks: warnBlocks
//             });

//           }

//         },
//         clearForm: function(form) {

//           if (form && typeof form === "object") {

//             for (let input of form.info.inputs) {

//               helpFuncs.clear.clearInput(input, form.name, "all");

//             }

//           }

//         },
//         applyClear: function() {

//           if (elems.inputs) {

//             for (let input of elems.inputs) {

//               input.addEventListener("focus", function() {

//                 let form = findCurrentParent(input, elemsClasses.container);
//                 let formName = form.getAttribute(dataAttr.name.form);

//                 helpFuncs.clear.clearInput(input, formName, "single");

//               });

//             }

//           }

//         }
//       },
//       // Запись значения поля в объект с данными формы
//       setData: function(inputInfo, data) {

//         if ((inputInfo && typeof inputInfo === "object") && (data && typeof data === "object") && inputInfo.name) {

//           let successText = inputInfo.options.text.success;
//           let errorText = inputInfo.options.text.error;
//           let errorRegText = inputInfo.options.text.errorReg;
//           let value = inputInfo.value;

//           if (inputInfo.type == "checkbox" || inputInfo.type == "radio") {

//             let inputs = inputInfo.otherInputs;
//             let values;

//             if (inputInfo.type == "checkbox") {

//               values = [];

//             };

//             for (let input of inputs) {

//               let name = helpFuncs.getNameInput(input);
//               let type = input.getAttribute("type");

//               if (name == inputInfo.name && type == inputInfo.type && input.checked) {

//                 if (type == "checkbox") {

//                   values.push(input.value);

//                 } else if (type == "radio") {

//                   values = input.value;

//                 }

//               }

//             }

//             data.inputs[inputInfo.name] = values;

//           } else {

//             if (value == successText || value == errorText || value == errorRegText) {

//               data.inputs[inputInfo.name] = "";

//             } else {

//               data.inputs[inputInfo.name] = value;

//             }

//           }

//         }

//       },
//       validateInput: function(params) {

//         let input = params.input;
//         let form = params.form;
//         let formParams = params.formParams;
//         let mode = params.mode;

//         if ((input && typeof input === "object") && (form && typeof form === "object") && (mode && typeof mode === "string")) {

//           let inputInfo = {
//             tag: input.tagName.toLowerCase(),
//             type: null,
//             value: null,
//             name: helpFuncs.getNameInput(input),
//             options: {
//               text: {
//                 success: null,
//                 error: null,
//                 errorReg: null,
//                 default: null,
//                 errorMin: null,
//                 errorMax: null
//               },
//               regExp: {
//                 pattern: null
//               }
//             },
//             otherInputs: form.info.inputs
//           };

//           switch (inputInfo.tag) {
//             case "input":
//               inputInfo.type = input.getAttribute("type");

//               let type = inputInfo.type;

//               if (type == "text" || type == "email" || type == "tel" || type == "number" || type == "password" || type == "hidden" || type == "range" || type == "search" || type == "url") {

//                 inputInfo.value = input.value;

//               } else if (type == "file") {

//                 if (input.files.length > 0) {

//                   if (input.hasAttribute("multiple")) {

//                     inputInfo.value = {};

//                     for (let i in input.files) {

//                       let file = input.files[i];

//                       if (typeof file === "object") {

//                         inputInfo.value[i] = file;

//                       }

//                     }

//                   } else {

//                     inputInfo.value = input.files[0];

//                   }

//                 }

//               }

//               break;
//             case "textarea":
//               inputInfo.type = "textarea";
//               inputInfo.value = input.value;
//               break;
//             case "select":
//               inputInfo.type = "select";
//               inputInfo.value = input.value;
//               break;
//             default:
//               inputInfo.type = "custom";
//               inputInfo.value = input.getAttribute(dataAttr.customValue);
//               break;
//           }

//           for (let item of ["text", "regExp"]) {

//             helpFuncs.getOptions({
//               input: input,
//               inputInfo: inputInfo,
//               formName: form.name,
//               option: item
//             });

//           }

//           if (mode == "validate" || mode == "data") {

//             helpFuncs.setData(inputInfo, formParams.data);

//           }

//           if (mode != "data") {

//             helpFuncs.errors.setErrors({
//               input: input,
//               inputInfo: inputInfo,
//               warnBlocks: form.info.warnBlocks,
//               errors: formParams.errors,
//               mode: mode
//             });

//           }

//         };

//       },
//       addFunc: function(func, nameArray) { // Функция, позволяющая записывать в массив функцию или массив с функциями

//         if (func && (nameArray && typeof nameArray === "string")) {

//           if (typeof func === "function") {

//             funcs[nameArray].push(func);

//           } else if (typeof func === "object") {

//             for (let item of func) {

//               if (typeof item === "function") {

//                 funcs[nameArray].push(item);

//               }

//             }

//           }

//         }

//       },
//       applyFunc: function(data, nameArray) { // Функция, позволяющая пробегаться по массиву с функциями и выполнять каждую из них.

//         if ((data && typeof data === "object") && (funcs[nameArray].length > 0)) {

//           for (let item of funcs[nameArray]) {

//             item(data);

//           }

//         }

//       }
//     };

//     // End Вспомогательные функции

//     // Добавление пользовательских функций, которые будут исполены если форма не прошла проверку

//     module.errorValidation = function(func) {

//       helpFuncs.addFunc(func, "error");

//     };

//     // End Добавления пользовательских функций, которые будут исполены если форма не прошла проверку

//     // Удаление пользовательских функций, которые исполеняются если форма не прошла проверку

//     module.removeErrorFuncs = function() {

//       funcs.error = [];

//     };

//     // End Удаление пользовательских функций, которые исполеняются если форма не прошла проверку

//     // Исполнение пользовательских функций, когда форма не прошла валидацию

//     module.applyErrorValidation = function(data) {

//       helpFuncs.applyFunc(data, "error");

//     };

//     // End Исполнение пользовательских функций, когда форма не прошла валидацию

//     // Добавление пользовательских функций, которые будут исполены если форма прошла проверку

//     module.successValidation = function(func) {

//       helpFuncs.addFunc(func, "success");

//     };

//     // End Добавление пользовательских функций, которые будут исполены если форма прошла проверку

//     // Удаление пользовательских функций, которые исполеняются если форма прошла проверку

//     module.removeSuccessFuncs = function() {

//       funcs.success = [];

//     };

//     // End Удаление пользовательских функций, которые исполеняются если форма прошла проверку

//     // Исполнение пользовательских функций, когда форма прошла валидацию

//     module.applySuccessValidation = function(data) {

//       helpFuncs.applyFunc(data, "success");

//     };

//     // End Исполнение пользовательских функций, когда форма прошла валидацию

//     // Очистка формы

//     module.clearForm = function(formName) {

//       if (formName && typeof formName === "string") {

//         for (let i in moduleInfo.containers) {

//           let currentFormName = moduleInfo.containers[i].element.getAttribute(dataAttr.name.form);

//           if (formName == currentFormName) {

//             helpFuncs.clear.clearForm({
//               name: formName,
//               info: moduleInfo.containers[i]
//             });

//           }

//         }

//       }

//     };

//     // End Очистка формы

//     // Установка дефолтных параметров

//     module.setParams = function() {

//       // WarnBlocks class

//       if (params.warnBlocks && typeof params.warnBlocks === "string") {

//         elemsClasses.warnBlock = params.warnBlocks;

//       }

//       // End WarnBlocks class

//       // SubmitBtns class

//       if (params.submitBtns && typeof params.submitBtns === "string") {

//         elemsClasses.submitBtn = params.submitBtns;

//       }

//       // End SubmitBtns class

//       // Dynamic

//       if (params.dynamic == true) {

//         options.dynamic = params.dynamic;

//       }

//       // End Dynaimc

//       // Ajax

//       if (params.ajax == true) {

//         options.ajax = params.ajax;

//       }

//       // End Ajax

//       // Classes

//       if (params.defaultSuccessClass == true) {

//         options.classes.success = successClass;

//       }

//       if (params.defaultErrorClass == true) {

//         options.classes.error = errorClass;

//       }

//       if (params.defaultClasses == true) {

//         options.classes.success = successClass;
//         options.classes.error = errorClass;

//       }

//       if (params.successClass && typeof params.successClass === "string") {

//         options.classes.success = params.successClass;

//       }

//       if (params.errorClass && typeof params.errorClass === "string") {

//         options.classes.error = params.errorClass;

//       }

//       // End Classes

//       // Send timeout

//       if (params.sendTimeout && typeof params.sendTimeout === "number") {

//         options.timeouts.send = Math.abs(params.sendTimeout);

//       }

//       // End Send timeout

//       // Clear timeout

//       if (params.clearTimeout && typeof params.clearTimeout === "number") {

//         options.timeouts.clear = Math.abs(params.clearTimeout);

//       }

//       // End Clear timeout

//       // Ruless

//       if (params.rules && typeof params.rules === "object") {

//         moduleInfo.rules = params.rules;

//       }

//       // End Ruless

//     };

//     // End Установка дефолтных параметров

//     // Нахождение всех форм на странице

//     module.findContainers = function() {

//       let containers = findElemsClass(elemsClasses.container, document);

//       elems.containers = containers;

//       if (containers) {

//         for (let i in containers) {

//           let item = containers[i];

//           if (typeof item === "object") {

//             moduleInfo.containers[i] = {
//               element: item,
//               inputs: null,
//               warnBlocks: null
//             }

//           }

//         }

//       }

//     };

//     // End Нахождение всех форм на странице

//     // Нахождение всех полей ввода на странице

//     module.findInputs = function() {

//       elems.inputs = findElemsClass(elemsClasses.input, document);

//       for (let i in moduleInfo.containers) {

//         let containerInfo = moduleInfo.containers[i];

//         if (containerInfo && typeof containerInfo === "object") {

//           let inputs = findElemsClass(elemsClasses.input, containerInfo.element);

//           if (inputs) {

//             containerInfo.inputs = inputs;

//           }

//         }

//       }

//     };

//     // End Нахождение всех полей ввода на странице

//     // Нахождение всех блоков спредепреждениями на странице

//     module.findWarnBlocks = function() {

//       if (elemsClasses.warnBlock) {

//         for (let i in moduleInfo.containers) {

//           let containerInfo = moduleInfo.containers[i];

//           if (containerInfo && typeof containerInfo === "object") {

//             let warnBlocks = findElemsClass(elemsClasses.warnBlock, containerInfo.element);

//             if (warnBlocks) {

//               containerInfo.warnBlocks = warnBlocks;

//             }

//           }

//         }

//       }

//     };

//     // End Нахождение всех блоков спредепреждениями на странице

//     // Нахождение всех кнопок проверки на странице

//     module.findSubmitBtns = function() {

//       if (elemsClasses.submitBtn) {

//         let btns = findElemsClass(elemsClasses.submitBtn, document);

//         if (btns) {

//           elems.btns = btns;

//         }

//       }

//     };

//     // End Нахождение всех кнопок проверки на странице

//     // Нахождение всех необходимых элементов на странице

//     module.findAllElements = function() {

//       module.findContainers();
//       module.findInputs();
//       module.findWarnBlocks();
//       module.findSubmitBtns();
//       helpFuncs.clear.applyClear();

//     };

//     // End Нахождение всех необходимых элементов на странице

//     // Валидация формы

//     module.validate = function(formName, mode) {

//       if ((formName && typeof formName === "string") && (mode == "validate" || mode == "valid" || mode == "data")) {

//         let containers = moduleInfo.containers;

//         for (let i in containers) {

//           let containerInfo = containers[i];
//           let currentFormName = containerInfo.element.getAttribute(dataAttr.name.form);
//           let clearForm = containerInfo.element.getAttribute(dataAttr.clearForm);

//           if (currentFormName == formName) {

//             let formParams = {
//               errors: [],
//               valid: false,
//               data: {
//                 name: formName,
//                 inputs: {}
//               }
//             }

//             for (let input of containerInfo.inputs) {

//               helpFuncs.validateInput({
//                 input: input,
//                 form: {
//                   name: formName,
//                   info: containerInfo
//                 },
//                 formParams: formParams,
//                 mode: mode
//               });

//             }

//             if (formParams.errors.length == 0) {

//               formParams.valid = true;

//               if (options.ajax == false && mode == "validate") {

//                 setTimeout(function() {

//                   location.reload();

//                 }, options.timeouts.send);

//               } else if (options.ajax == true) {

//                 module.applySuccessValidation({
//                   valid: formParams.valid,
//                   form: formParams.data
//                 });

//                 if (clearForm != "false") {

//                   setTimeout(function() {

//                     helpFuncs.clear.clearForm({
//                       name: formName,
//                       info: containerInfo
//                     });

//                   }, options.timeouts.clear);

//                 }

//               }

//             } else {

//               module.applyErrorValidation({
//                 valid: formParams.valid,
//                 form: formParams.data
//               });

//             }

//             if (mode == "valid") {

//               return formParams.valid;

//             } else if (mode == "data") {

//               return formParams.data.inputs;

//             }

//           }

//         }

//       }

//     };

//     // End Валидация формы

//     module.setParams();
//     module.findAllElements();

//     if (elemsClasses.submitBtn && options.dynamic == true) {

//       document.addEventListener("click", function(e) {

//         let elem = e.target;

//         if (elem.classList.contains(elemsClasses.submitBtn)) {

//           e.preventDefault();

//           let btn = this;
//           let formName = btn.getAttribute(dataAttr.name.form);

//           if (formName) {

//             module.validate(formName, "validate");

//           }

//         }

//       });

//     } else if (elems.btns && options.dynamic == false) {

//       for (let btn of elems.btns) {

//         btn.addEventListener("click", function(e) {

//           e.preventDefault();

//           let formName = btn.getAttribute(dataAttr.name.form);

//           if (formName) {

//             module.validate(formName, "validate");

//           }

//         });

//       }

//     }

//     helpFuncs.clear.applyClear();

//   } else {

//     console.error();
//     return false;

//   }

// };