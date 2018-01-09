// applyClasses - ver. 1.0.1

// Description
// * * * = * * *

// Функция для добавления или удаления списка классов у элемента.

// Принимает в себя:
// 1. Элемент (elem);
// 2. Массив с названиями классов (arrayClasses);
// 3. Событие которое должно быть сделано (event);

// Возможные значения параметра event:
// 1. add - добавление классов;
// 2. remove - удаление классов;

// * * * = * * *
// End Description

export let applyClasses = function(elem, arrayClasses, event) {

	if ((elem && typeof elem === "object") && (arrayClasses && typeof arrayClasses === "object") && (event && typeof event === "string")) {

		for (let item of arrayClasses) {

			if (event == "add") {

				if (item && typeof item === "string") {

					elem.classList.add(item);

				}

			} else if (event == "remove") {

				if (item && typeof item === "string") {

					elem.classList.remove(item);

				}

			}

		}

	}

};