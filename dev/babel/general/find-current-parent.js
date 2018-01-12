// findCurrentParent - ver. 1.0.0

export let findCurrentParent = function(elem, parentClass) {

	if ((elem && typeof elem === "object") && (parentClass && typeof parentClass === "string")) {

		let parent = elem.parentNode;

		if (parent != document) {

			// Поиск родителя до тех пор пока не найдется элемент с нужным классом.
			while(typeof parent === "object" && !parent.classList.contains(parentClass)) {

				parent = parent.parentNode;

				if (parent == document) {

					parent = null;
					break;

				}

			}

		} else {

			parent = null;

		}

		if (parent != null) {

			return parent;

		} else {

			return false;

		}

	}

};