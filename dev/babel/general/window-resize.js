// windowResize - ver. 1.0.0

import {debounce} from "./debounce";

let eventArray = [];

export let windowResize = function(funcs) {

	if (funcs && typeof funcs === "function") {

		eventArray.push(funcs);

	} else if (funcs && typeof Array.isArray(funcs)) {

		for (let func of funcs) {

			if (typeof func === "function") {

				eventArray.push(func);

			}

		}

	}

};
let applyFunc = function() {

	for (let event of eventArray) {

		event();

	}

};

window.addEventListener("resize", function() {

	debounce(applyFunc, 150);

});