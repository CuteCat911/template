// ToTop - ver. 1.0.0

// Description
// * * * = * * *

// Функция конструктор для кнопок "наверх" на сайте;

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. elems (обязательный) (тип string) - класс элементов (кнопок).
// 2. fps (не обязательный) (тип number) - количество кадров во время прокрутки страницы.
// 3. speed (не обязательный) (тип number) - скорость прокрутки страницы.
// 4. hide (не обязательный) (тип boolean) - флаг отвечающий за скрытие кнопки вверху страницы.
// 5. hideIndent (не обязательный) (тип number или string) - размер отступа от верха страницы после которого нужно показать кнопку.

//Пример передаваемого объекта:
// {
//  elems: "to-class",
//  speed: 2,
//  hide: true,
//  hideIndent: "screenX2"
// }

// Параметр hideIndent (тип string) - записывается со значение screen или screenX3.
// Где screen - обозначение высоты экрана пользователя, а X3 количество экранов.

// * * * = * * *
// End Description

import {findElemsClass} from "./find";
import {hideClass} from "./state-classes";
import {windowScroll, getWindowScroll} from "./window-scroll";

export let ToTop = function(params) {

    if (params.elems && typeof params.elems === "string") {

        let module = this;
        let moduleInfo =  {
            elems: findElemsClass(params.elems, document),
            fps: 60,
            speed: 1.5,
            hide: {
                active: false,
                indent: "screen"
            }
        };

        if (moduleInfo.elems) {

            module.setParams = function() {

                for (let item of ["fps", "speed"]) {

                    if (params[item] && typeof params[item] === "number") {

                        moduleInfo[item] = Math.abs(params[item]);

                    }

                }

                if (params.hide == true) {

                    moduleInfo.hide.active = params.hide;

                }

                if (params.hideIndent && typeof params.hideIndent !== "object") {

                    moduleInfo.hide.indent = params.hideIndent;

                }

            };
            module.top = function() {

                setTimeout(function() {

                    let idAnimation = requestAnimationFrame(module.top);
                    let scroll = getWindowScroll();

                    window.scrollTo(0, scroll - 50 * moduleInfo.speed);

                    if (scroll <= 0) {

                        window.cancelAnimationFrame(idAnimation);

                    }

                }, 1000 / moduleInfo.fps);

            };
            module.hide = function() {

                let scroll = getWindowScroll();
                let indent;

                if (typeof moduleInfo.hide.indent === "number") {

                    indent = moduleInfo.hide.indent;

                } else if (moduleInfo.hide.indent.split("X")[0] == "screen") {

                    let windowHeight = window.innerHeight;
                    let factor = moduleInfo.hide.indent.split("X")[1];

                    if (!factor || typeof +factor !== "number") {

                        factor = 1;

                    }

                    indent = windowHeight * factor;

                }

                if (indent) {

                    if (scroll >= indent) {

                        for (let item of moduleInfo.elems) {

                            item.classList.remove(hideClass);

                        }

                    } else {

                        for (let item of moduleInfo.elems) {

                            item.classList.add(hideClass);

                        }

                    }

                }

            };

            module.setParams();

            windowScroll(module.hide);

            for (let item of moduleInfo.elems) {

                item.addEventListener("click", function() {

                    module.top();

                });

            }

        } else {

            console.error();
            return false;

        }

    } else {

        console.error();
        return false;

    }

};