import {findElemsClass} from "./find";
import {pageLoad} from "./page-load";

export let removeLoaders = function(loadersClass) {

	if ((loadersClass != undefined && typeof loadersClass === "string")) {

		let module = this;

		module.removeLoaders = function() {

			let loaders = findElemsClass(loadersClass, document);

			if (loaders != undefined) {

				for (let i in loaders) {

					let item = loaders[0];

					if (item != undefined) {

						item.remove();

					}

				}

			}

		}

		let load = new pageLoad(module.removeLoaders);

	}

	else {

		console.error();
		return false;

	}

}