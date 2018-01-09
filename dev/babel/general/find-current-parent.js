// findCurrentParent - ver. 1.0.0

// Description
// * * * = * * *

// Функция для поиска родителя с определенным классом у элемента;

// Возвращает найденного родителя или false, если родителя с нужным классом нет;

// Принимает в себя элемент у которого нужно искать родителя (elem) и класс родителя по которому будет идти поиск (parentClass).

// * * * = * * *
// End Description

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

	} else {

		console.error();
		return false;

	}

};