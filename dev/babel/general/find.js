// findElemsClass - ver. 1.1.1

// Description
// * * * = * * *

// Функция для поиска элементов на странице по заданному классу;

// Возвращает массив найденых элементов;

// Принимает в себя класс по которому будет искать элементы (elemsClass) и место где нужно эти элементы искать (lookPlace).

// * * * = * * *
// End Description

export let findElemsClass = function(elemsClass, lookPlace) {

	if ((elemsClass && typeof elemsClass === "string") && (lookPlace && typeof lookPlace === "object")) {

		let array = lookPlace.getElementsByClassName(elemsClass);

		if (array.length > 0) {

			return Array.prototype.slice.call(array);

		}

	} else {

		console.error();
		return false;

	}

};

// findFirstClass - ver. 1.0.1

// Description
// * * * = * * *

// Функция для поиска первого элемента на странице по заданному классу;

// Возвращает только один найденый элемент (самый первый который найдет);

// Принимает в себя класс по которому будет искать элемент (elemClass) и место где нужно этот элемент искать (lookPlace).

// * * * = * * *
// End Description

export let findFirstClass = function(elemClass, lookPlace) {

	if ((elemClass && typeof elemClass === "string") && (lookPlace && typeof lookPlace === "object")) {

		let elem = lookPlace.getElementsByClassName(elemClass)[0];

		if (elem) {

			return elem;

		}

	} else {

		console.error();
		return false;

	}

};

// findElemsClasses - ver. 1.1.2

// Description
// * * * = * * *

// Функция для поиска элементов на странице по заданным классам;

// Возвращает массив с ассивами найденых элементов;

// Принимает в себя массив с классами по которым будут искаться элементы (elemsClassesArray) и место где нужно искать элементы (lookPlace).

// * * * = * * *
// End Description

export let findElemsClasses = function(elemsClassesArray, lookPlace) {

	if ((elemsClassesArray && typeof elemsClassesArray === "object") && (lookPlace && typeof lookPlace === "object")) {

		let array = [];

		for (let item of elemsClassesArray) {

			if (typeof item === "string") {

				let arrayClass = lookPlace.getElementsByClassName(item);

				if (arrayClass.length > 0) {

					array.push(Array.prototype.slice.call(arrayClass));

				}

			}

		}

		if (array.length > 0) {

			return array;

		}

	} else {

		console.error();
		return false;

	}

};

// findElemsTag - ver. 1.1.1

// Description
// * * * = * * *

// Функция для поиска элементов на странице по заданному тегу;

// Возвращает массив найденых элементов;

// Принимает в себя тег по которому будет искать элементы (elemsTag) и место где нужно эти элементы искать (lookPlace).

// * * * = * * *
// End Description

export let findElemsTag = function(elemsTag, lookPlace) {

	if ((elemsTag && typeof elemsTag === "string") && (lookPlace && typeof lookPlace === "object")) {

		let array = lookPlace.getElementsByTagName(elemsTag);

		if (array.length > 0) {

			return Array.prototype.slice.call(array);

		}

	} else {

		console.error();
		return false;

	}

};

// findFirstTag - ver. 1.0.1

// Description
// * * * = * * *

// Функция для поиска первого элемента на странице по заданному тегу;

// Возвращает только один найденый элемент (самый первый который найдет);

// Принимает в себя тег по которому будет искать элемент (elemTag) и место где нужно этот элемент искать (lookPlace).

// * * * = * * *
// End Description

export let findFirstTag = function(elemTag, lookPlace) {

	if ((elemTag && typeof elemTag === "string") && (lookPlace && typeof lookPlace === "object")) {

		let elem = lookPlace.getElementsByTagName(elemTag)[0];

		if (elem) {

			return elem;

		}

	} else {

		console.error();
		return false;

	}

};

// findElemsTags - ver. 1.1.2

// Description
// * * * = * * *

// Функция для поиска элементов на странице по заданным тегам;

// Возвращает массив с массивами найденых элементов;

// Принимает в себя массив с тегами по которым будут искаться элементы (elemsTagsArray) и место где нужно искать элементы (lookPlace).

// * * * = * * *
// End Description

export let findElemsTags = function(elemsTagsArray, lookPlace) {

	if ((elemsTagsArray && typeof elemsTagsArray === "object") && (lookPlace && typeof lookPlace === "object")) {

		let array = [];

		for (let item of elemsTagsArray) {

			let arrayTag = lookPlace.getElementsByTagName(item);

			if (arrayTag.length > 0) {

				array.push(Array.prototype.slice.call(arrayTag));

			}

		}

		if (array.length > 0) {

			return array;

		}

	} else {

		console.error();
		return false;

	}

};

