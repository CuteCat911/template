// WindowResize - ver. 1.1.0

// Description
// * * * = * * *

// Функция выполнения скриптов после ресайза страницы;

// Принимает в себя функцию (func) которая будет выполнена после ресайза страницы.

// * * * = * * *
// End Description

import {debounce} from "./debounce";

let eventArray = [];

export let windowResize = function(func) {

	if (func && typeof func === "function") {

		eventArray.push(func);

	} else if (func && typeof func === "object") {

		for (let item of func) {

			if (typeof item === "function") {

				eventArray.push(item);

			}

		}

	} else {

		console.error();
		return false;

	}

};
let applyFunc = function() {

	for (let item of eventArray) {

		item();

	}

};

window.addEventListener("resize", function() {

	debounce(applyFunc, 250);

});