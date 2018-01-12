// applyClasses - ver. 1.0.0

export let applyClasses = function(elem, arrayClasses, event) {

	if ((elem && typeof elem === "object") && (arrayClasses &&  Array.isArray(arrayClasses)) && (event && typeof event === "string")) {

		for (let item of arrayClasses) {

			if (typeof item === "string") {

				if (event == "add") {

					elem.classList.add(item);

				} else if (event == "remove") {

					elem.classList.remove(item);

				}

			}

		}

	}

};