// debounce - ver. 1.0.0

// Description
// * * * = * * *

// Откладывание события на определенное время после первого исполнения.

// Принимает в себя функцию (func) и время задержки (time).

// * * * = * * *
// End Description

let state = null;
const FROZE = 1;

export let debounce = function(func, time) {

	if (func && typeof func === "function") {

		if (time == undefined && typeof time !== "number") {

			time = 300;

		}

		if (state) {

			return;

		}

		func.apply(this, arguments);
		state = FROZE;

		setTimeout(function() {

			state = null;

		}, time);

	} else {

		console.error();
		return false;

	}

};