// windowResize - ver. 1.1.0

import {debounce} from "./debounce";
import {inspectMobile} from "./inspect-mobile";

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

let windowHeight = window.innerHeight;

window.addEventListener("resize", function() {

	let $windowHeight = window.innerHeight;

	if (inspectMobile()) {

		if (Math.abs(windowHeight - $windowHeight) > 60) {

			debounce(applyFunc, 150);
			windowHeight = $windowHeight;

		}

	} else {

		debounce(applyFunc, 150);

	}

});