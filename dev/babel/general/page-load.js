// PageLoad - ver. 1.0.0

let eventArray = [];

export let pageLoad = function(funcs) {

	if (funcs && typeof funcs === "function") {

		eventArray.push(funcs);

	} else if (funcs && typeof funcs === "object") {

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

window.onload = function() {

	applyFunc();

};