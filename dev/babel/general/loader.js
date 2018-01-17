import {findElemsClass, findFirstClass} from "./find";
import {applyClasses} from "./apply-classes";
import {hideClass} from "./state-classes";

// loader - ver. 1.1.0

export let loader = {
	info: {
		local: {
			block: "loader",
			indicator: "loader__indicator"
		},
		page: {
			block: "page-loader",
			indicator: "page-loader__indicator"
		}
	},
	create(mode, params) {

		if (mode && typeof mode === "string") {

			let info = {
				block: {
					el: null,
					tag: "div",
					classes: (params && (params.blockClasses && Array.isArray(params.blockClasses))) ? params.blockClasses : [this.info[mode].block]
				},
				indicator: {
					el: null,
					tag: "div",
					classes: (params && (params.indicatorClasses && Array.isArray(params.indicatorClasses))) ? params.indicatorClasses : [this.info[mode].indicator]
				}
			};

			let block = info.block;
			let indicator = info.indicator;
			let createLoader = function() {

				for (let i in info) {

					info[i].el = document.createElement(info[i].tag);
					applyClasses(info[i].el, info[i].classes, "add");

				}

				block.el.appendChild(indicator.el);

			};

			createLoader();
			return block.el;

		}

	},
	remove(mode, params) {

		if ((mode && typeof mode === "string")) {

			let info = {
				class: (params.loaderClass && typeof params.loaderClass) ? params.loaderClass : this.info[mode].block,
				loaders: null,
				type: (params.type && typeof params.type === "string") ? params.type : "hide",
				parent: (params.parent && typeof params.parent === "string") ? params.parent : null,
				timeout: (params.timeout > 0 && typeof params.timeout === "number") ? params.timeout : 0
			};
			let removeLoader = function() {

				setTimeout(function() {

					if (info.parent && mode == "local") {

						let parents = findElemsClass(info.parent, document);

						if (parents) {

							for (let parent of parents) {

								let loader = findFirstClass(info.class, parent);

								if (loader) {

									if (info.type == "hide") {

										loader.classList.add(hideClass);

									} else if (info.type == "remove") {

										parent.removeChild(loader);

									}

								}

							}

						}

					} else if (info.loaders && !info.parent) {

						for (let loader of info.loaders) {

							if (info.type == "hide") {

								loader.classList.add(hideClass);

							} else if (info.type == "remove") {

								let parent = loader.parentNode();

								parent.removeChild(loader);

							}

						}

					}

				}, info.timeout);

			}

			if (!info.parent) {

				info.loaders = findElemsClass(info.class, document);

			}

			removeLoader();

		}

	},
	getInfo(type, el) {
		
		if (type && typeof type === "string") {

			return this.info[type];

		} else if ((type && typeof type === "string") && (el && typeof el === "string")) {

			return this.info[type][el];

		} else {

			return this.info;

		}

	}
};