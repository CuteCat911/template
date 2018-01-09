import {findElemsClass} from "./find";
import {onClass, offClass} from "./state-classes";

export let stateBtns = function(elemsClass) {

	if (elemsClass != undefined && typeof elemsClass === "string") {

		let elems = findElemsClass(elemsClass, document);

		if (elems != undefined && elems != false) {

			for (let item of elems) {

				item.addEventListener("click", function() {

					if (!item.hasAttribute("data-stop")) {

						if (item.classList.contains(onClass)) {

							item.classList.remove(onClass);
							item.classList.add(offClass);

						}

						else {

							item.classList.remove(offClass);
							item.classList.add(onClass);

						}

					}

				});

			}

		}

	}

	else {

		console.error();
		return false;

	}

}