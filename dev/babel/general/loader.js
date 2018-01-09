import {findElemsClass, findFirstClass} from "./find";
import {applyClasses} from "./apply-classes";
import {pageLoad} from "./page-load";
import {lockClass, hideClass} from "./state-classes";

// Description
// * * * = * * *

// Список классов прелоадера. Можно выбирать как отдельными классами так и объектом с их полным списком.

// * * * = * * *
// End Description

let loaderBlockClass = "loader";
let loaderIndicatorClass = loaderBlockClass + "__indicator";
let pageLoaderBlockClass = "page-loader";
let pageLoaderIndicatorClass = pageLoaderBlockClass + "__indicator";

let loaderInfo = {
	local: {
		blockClass: loaderBlockClass,
		indicatorClass: loaderIndicatorClass
	},
	page: {
		blockClass: pageLoaderBlockClass,
		indicatorClass: pageLoaderIndicatorClass
	}
};

export {loaderBlockClass, loaderIndicatorClass, pageLoaderBlockClass, pageLoaderIndicatorClass, loaderInfo};

// createLoader - ver. 1.0.0

// Description
// * * * = * * *

// Функция создания блока с прелоудером.

// Возвращает элемент c прелоудером.

// * * * = * * *
// End Description

export let createLoader = function(blockClasses, indicatorClasses) {

	let $loaderInfo = {
		block: {
			element: null,
			tag: "div",
			classes: [loaderInfo.local.blockClass]
		},
		indicator: {
			element: null,
			tag: "div",
			classes: [loaderInfo.local.indicatorClass]
		}
	};

	let setParams = function() {

		if ((blockClasses && typeof blockClasses === "object") && (indicatorClasses && typeof indicatorClasses === "object")) {

			$loaderInfo.block.classes = blockClasses;
			$loaderInfo.block.indicator = indicatorClasses;

		}

	};
	let createLoaderElement = function() {

		for (let i in $loaderInfo) {

			let item = $loaderInfo[i];

			item.element = document.createElement(item.tag);
			applyClasses(item.element, item.classes, "add");

		}

		$loaderInfo.block.element.appendChild($loaderInfo.indicator.element);

	};

	setParams();
	createLoaderElement();

	return $loaderInfo.block.element;

};

// removeLoaders - ver. 1.0.0

// Description
// * * * = * * *

// * * * = * * *
// End Description

export let removeLoaders = function(mode, timeout, loadersClass) {

	if (mode && typeof mode === "string") {

		let $loadersInfo = {
			class: loaderInfo.local.blockClass,
			elements: null,
			timeout: 0
		};
		let setParams = function() {

			if (loadersClass && typeof loadersClass === "string") {

				$loadersInfo.class = loadersClass;

			}

			if (timeout && typeof timeout === "number") {

				$loadersInfo.timeout = Math.abs(timeout);

			}

		};
		let removeLoader = function() {

			setTimeout(function() {

				for (let i = 0; i < $loadersInfo.elements.length; i++) {

					let loader = $loadersInfo.elements[i];
					let firstLoader = $loadersInfo.elements[0];

					if (mode == "hide") {

						applyClasses(loader, [hideClass], "add");

					} else if (mode == "remove") {

						if (firstLoader.remove) {

							firstLoader.remove();

						} else {

							let parent = firstLoader.parentNode;

							parent.removeChild(firstLoader);

						}

					}

				}

			}, $loadersInfo.timeout);

		};

		setParams();
		$loadersInfo.elements = findElemsClass($loadersInfo.class, document);

		if ($loadersInfo.elements) {

			pageLoad(removeLoader);

		}

	};

};

// createPageLoader - ver. 1.0.0

// Description
// * * * = * * *

// * * * = * * *
// End Description

export let createPageLoader = function(blockClasses, indicatorClasses) {

	let $loaderInfo = {
		block: {
			element: null,
			tag: "div",
			classes: [loaderInfo.page.blockClass]
		},
		indicator: {
			element: null,
			tag: "div",
			classes: [loaderInfo.page.indicatorClass]
		}
	};

	let setParams = function() {

		if ((blockClasses && typeof blockClasses === "object") && (indicatorClasses && typeof indicatorClasses === "object")) {

			$loaderInfo.block.classes = blockClasses;
			$loaderInfo.block.indicator = indicatorClasses;

		}

	};
	let createLoaderElement = function() {

		for (let i in $loaderInfo) {

			let item = $loaderInfo[i];

			item.element = document.createElement(item.tag);
			applyClasses(item.element, item.classes, "add");

		}

		$loaderInfo.block.element.appendChild($loaderInfo.indicator.element);

	};

	setParams();
	createLoaderElement();

	return $loaderInfo.block.element;

};

// removePageLoader - ver. 1.0.0

// Description
// * * * = * * *

// * * * = * * *
// End Description

export let removePageLoader = function(mode, timeout, loaderClass) {

	if (mode && typeof mode === "string") {

		let $loaderInfo = {
			class: loaderInfo.page.blockClass,
			element: null,
			timeout: 0
		};
		let setParams = function() {

			if (loaderClass && typeof loaderClass === "string") {

				$loaderInfo.class = loaderClass;

			}

			if (timeout && typeof timeout === "number") {

				$loaderInfo.timeout = Math.abs(timeout);

			}

		};
		let removeLoader = function() {

			let loader = $loaderInfo.element;

			if (loader) {

				setInterval(function() {

					document.body.classList.remove(lockClass);

					if (mode == "remove") {

						loader.remove();

					} else if (mode == "hide") {

						loader.classList.add(hideClass);

					}

				}, $loaderInfo.timeout);

			}

		};

		setParams();
		$loaderInfo.element = findFirstClass($loaderInfo.class, document);
		pageLoad(removeLoader);

	};

};