// getWindowScroll - ver. 1.0.0

// Description
// * * * = * * *

// Функция возвращающая текущую прокрутку страницы;

// * * * = * * *
// End Description

export let getWindowScroll = function() {

    let scroll = window.pageYOffset || document.documentElement.scrollTop;

    return scroll;

};

// getScrollHeight - ver 1.0.0

// // Description
// * * * = * * *

// Функция возвращающая высоту прокрутки страницы;

// * * * = * * *
// End Description

export let getScrollHeight = function() {

    let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);

    return height;

};

// WindowScroll - ver. 1.2.0

// Description
// * * * = * * *

// Функция выполнения скриптов после прокрутки страницы;

// Принимает в себя функцию (func) которая будет выполнена после прокрутки страницы.

// Дополнительно задает стиль "pointer-events" со значением "none" для того чтобы убрать лишнее наведение на элементы во время скроллинга.
// После того как страница закончила скроллится, значение "pointer-events" сбрасывается до дефолтного.

// * * * = * * *
// End Description

import {debounce} from "./debounce";

let eventArray = [];

export let windowScroll = function(func) {

	if (func && typeof func === "function") {

		eventArray.push(func);

	} else if (func && typeof func === "object") {

        for (let item of func) {

            if (typeof item === "function") {

                eventArray.push(item);

            };

        };

    } else {

        console.error();
        return false;

    };

};
let applyFunc = function() {

    for (let item of eventArray) {

        item();

    };

};
let clearBody = function() {

    setTimeout(function() {

        if (getComputedStyle(document.body).pointerEvents == "none") {

            document.body.style.pointerEvents = "";

        };

    }, 350);

};

window.addEventListener("scroll", function() {

    if (getComputedStyle(document.body).pointerEvents != "none") {

        document.body.style.pointerEvents = "none";

    };

    applyFunc();

    return debounce(clearBody);

});

document.addEventListener("click", function() {

    if (getComputedStyle(document.body).pointerEvents == "none") {

        document.body.style.pointerEvents = "";

    };

});

// scrollTo - ver 1.1.0

// Description
// * * * = * * *

// Функция прокрутки страницы к указанным координатам.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. position (обязательный) (тип number) - координаты на которые нужно проскролить страницу.
// 2. fps (не обязательный) (тип number) - количество кадров во время прокрутки страницы.
// 3. speed (не обязательный) (тип number) - скорость прокрутки страницы.

// * * * = * * *
// End Description

export let scrollTo = function(params) {

    if (typeof params.position === "number" && (params.position <= 0 || params.position >= 0)) {

        let moduleInfo = {
            position: params.position,
            fps: 60,
            speed: 1.5,
            calibration: true,
            options: {
                startScroll: getWindowScroll(),
                mode: null,
                documentHeight: null,
                windowHeight: null
            }
        };
        let options = moduleInfo.options;
        let setParams = function() {

            for (let item of ["fps", "speed"]) {

                if (params[item] && typeof params[item] === "number") {

                    moduleInfo[item] = Math.abs(params[item]);

                };

            };

            if (params.calibration == false) {

                moduleInfo.calibration = params.calibration;

            };

        };
        let setMode = function() {

            if (options.startScroll < moduleInfo.position) {

                options.mode = "bottom";
                options.documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
                options.windowHeight = window.innerHeight;

            } else if (options.startScroll > moduleInfo.position) {

                options.mode = "top";

            };

        };
        let calibration = function() {

            if (moduleInfo.calibration == true) {

                let scroll = getWindowScroll();

                if (scroll != moduleInfo.position) {

                    window.scrollTo(0, moduleInfo.position);

                };

            };

        };
        let scrollToPosition = function() {

            let mode = options.mode;

            if (mode && typeof mode === "string") {

                setTimeout(function() {

                    let idScroll = requestAnimationFrame(scrollToPosition);
                    let scroll = getWindowScroll();

                    if (mode == "top") {

                        window.scrollTo(0, scroll - 50 * moduleInfo.speed);

                        if (scroll <= moduleInfo.position || scroll <= 0) {

                            window.cancelAnimationFrame(idScroll);
                            calibration();

                        };

                    } else if (mode == "bottom") {

                        window.scrollTo(0, scroll + 50 * moduleInfo.speed);

                        if (scroll >= moduleInfo.position || scroll >= options.documentHeight - options.windowHeight) {

                            window.cancelAnimationFrame(idScroll);
                            calibration();

                        };

                    };

                }, 1000 / moduleInfo.fps);

            };

        };

        setParams();
        setMode();
        scrollToPosition();

    };

};