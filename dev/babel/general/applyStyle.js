// applyStyle - ver. 1.0.1

// Description
// * * * = * * *

// Функция для добавления или удаления css стилей у элемента;

// Принимает в себя:
// 1. Элемент (elem);
// 2. Объект в котором записаны названия стилей со значениями (style);
// 3. Событие которое должно быть сделано (event);

// Пример объекта style:
// style = {
// 	width: "100px",
// 	height: "20px",
// 	backgroundColor: "#fff",
// 	fontSize: "15px"
// };

// Возможные значения параметра event:
// 1. add - добавление стилей;
// 2. remove - удаление стилей;

// * * * = * * *
// End Description

export let applyStyle = function(elem, style, event) {

	if ((elem && typeof elem === "object") && (style && typeof style === "object") && (event && typeof event === "string")) {

		for (let i in style) {

			if (event == "add") {

				elem.style[i] = style[i];

			} else if (event == "remove") {

				elem.style[i] = "";

			}

		}

	}

};