// PageLoad - ver. 1.1.1

// Description
// * * * = * * *

// Функция выполнения скриптов после полной загрузки страницы;

// Принимает в себя функцию или массив с функциями которые будут выполнены после полной загрузки страницы.

// * * * = * * *
// End Description

let eventArray = [];

export let pageLoad = function(func) {

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

window.onload = function() {

	applyFunc();

};