// findElemsClass - ver. 1.0.1

export let findElemsClass = function(elemsClass, lookPlace) {

	if ((elemsClass && typeof elemsClass === "string") && (lookPlace && typeof lookPlace === "object")) {

		let array = lookPlace.getElementsByClassName(elemsClass);

		if (array.length > 0) {

			return Array.prototype.slice.call(array);

		}

	}

};

// findFirstClass - ver. 1.0.1

export let findFirstClass = function(elemClass, lookPlace) {

	if ((elemClass && typeof elemClass === "string") && (lookPlace && typeof lookPlace === "object")) {

		let elem = lookPlace.getElementsByClassName(elemClass)[0];

		if (elem) {

			return elem;

		}

	}

};

// findElemsClasses - ver. 1.0.1

export let findElemsClasses = function(elemsClassesArray, lookPlace) {

	if ((elemsClassesArray && Array.isArray(elemsClassesArray)) && (lookPlace && typeof lookPlace === "object")) {

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

	}

};

// findElemsTag - ver. 1.0.1

export let findElemsTag = function(elemsTag, lookPlace) {

	if ((elemsTag && typeof elemsTag === "string") && (lookPlace && typeof lookPlace === "object")) {

		let array = lookPlace.getElementsByTagName(elemsTag);

		if (array.length > 0) {

			return Array.prototype.slice.call(array);

		}

	}

};

// findFirstTag - ver. 1.0.1

export let findFirstTag = function(elemTag, lookPlace) {

	if ((elemTag && typeof elemTag === "string") && (lookPlace && typeof lookPlace === "object")) {

		let elem = lookPlace.getElementsByTagName(elemTag)[0];

		if (elem) {

			return elem;

		}

	}

};

// findElemsTags - ver. 1.0.1

export let findElemsTags = function(elemsTagsArray, lookPlace) {

	if ((elemsTagsArray && Array.isArray(elemsTagsArray)) && (lookPlace && typeof lookPlace === "object")) {

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

	}

};

