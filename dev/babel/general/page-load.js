// PageLoad - ver. 1.0.1

let eventArray = [];

export let pageLoad = function(funcs) {

	if (funcs && typeof funcs === "function") {

		eventArray.push(funcs);

	} else if (funcs && Array.isArray(funcs)) {

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