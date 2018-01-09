// ProgressBar - ver. 1.0.0

// Description
// * * * = * * *

// Функция конструктор реализующая работу процента просмотра элемента или страницы.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. progressElem (обязательный) (тип string) - класс элемента, отвечающий за прогрессбар.
// 2. observableElem (обязательный) (тип string) - класс элемента, отвечающий за наблюдаемый элемент.
// 3. filling (не обязательный) (тип string) - тип заполнения прогрессбара.

// Возможные значения параметра filling:
// 1. width - прогрессбар будет заполняться в ширину.
// 2. height - прогрессбар будет заполняться в высоту.

// Доступные методы:
// 1. afterProgress - выполнение функции после 100% просмотра наблюдаемого элемента.
// Принимает в себя функцию или массив с функциями.

// * * * = * * *
// End Description

import {findFirstClass} from "./find";
import {WindowResize} from "./windowResize";
import {WindowScroll, getWindowScroll} from "./windowScroll";

export let ProgressBar = function(params) {

	if ((params.progressElem && typeof params.progressElem === "string") && (params.observableElem && typeof params.observableElem === "string")) {

		let module = this;
		let moduleInfo = {
			progressElem: findFirstClass(params.progressElem, document),
			observableElem: findFirstClass(params.observableElem, document),
			parametrs: {
				observable: {
					top: null,
					bottom: null,
					height: null
				},
				filling: "width",
				windowHeight: null,
				scroll: 0,
				progress: 0
			},
			functions: []
		};

		let progressElem = moduleInfo.progressElem;
		let observableElem = moduleInfo.observableElem;
		let parametrs = moduleInfo.parametrs;
		let observTop = parametrs.observable.top;
		let observBottom = parametrs.observable.bottom;
		let observHeight = parametrs.observable.height;
		let filling = parametrs.filling;
		let windowHeight = parametrs.windowHeight;
		let scroll = parametrs.scroll;
		let progress = parametrs.progress;
		let setObservablePosition = function(scroll) {

			observTop = observableElem.getBoundingClientRect().top + scroll;
			observBottom = observableElem.getBoundingClientRect().bottom + scroll;

		};

		if (progressElem && observableElem) {

			module.setParams = function() {

				if (params.filling && typeof params.filling === "string") {

					filling = params.filling;

				}

				if (filling == "width") {

					progressElem.style.maxWidth = "100%";

				} else if (filling == "height") {

					progressElem.style.maxHeight = "100%";

				}

			};

			module.afterProgress = function(func) {

				if (func && typeof func === "function") {

					moduleInfo.functions.push(func);

				} else if (func && typeof func === "object") {

					for (let item of func) {

						if (typeof item === "function") {

							moduleInfo.functions.push(item);

						}

					}

				} else {

					console.error();
					return false;

				}

			};

			module.applyAfterProgress = function() {

				for (let func of moduleInfo.functions) {

					func();

				}

			};

			module.getPosition = function() {

				scroll = getWindowScroll();
				observHeight = observableElem.offsetHeight;
				setObservablePosition(scroll);
				windowHeight = window.innerHeight;

			};

			module.progress = function() {

				module.getPosition();

				if (scroll >= observTop && scroll < observBottom) {

					progress = ((scroll - observTop) / (observHeight + observTop - windowHeight)) * 100;

					if (progress >= 100) {

						if (filling == "width") {

							progressElem.style.width = "100%";

						} else if (filling == "height") {

							progressElem.style.height = "100%";

						}
					
						module.applyAfterProgress();

					} else {

						if (filling == "width") {

							progressElem.style.width = progress + "%";

						} else if (filling == "height") {

							progressElem.style.height = progress + "%";

						}

					}

				} else if (scroll < observTop) {

					if (filling == "width") {

						progressElem.style.width = "";

					} else if (filling == "height") {

						progressElem.style.height = "";

					}

				}

			};

			module.setParams();
			module.getPosition();

			let windowScroll = new WindowScroll(module.progress);
			let windowResize = new WindowResize(module.getPosition);

		} else {

			console.error();
			return false;

		}

	} else {

		console.error();
		return false;

	}

}