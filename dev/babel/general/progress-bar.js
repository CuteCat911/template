// ProgressBar - ver. 1.0.0

import {findFirstClass} from "./find";
import {windowResize} from "./window-resize";
import {windowScroll, getWindowScroll} from "./window-scroll";

export let ProgressBar = class {

	constructor(params) {

		if ((params.progressElem && typeof params.progressElem === "string") && (params.observableElem && typeof params.observableElem === "string")) {

			let $module = this;

			this.info = {
				classes: {
					progress: params.progressElem,
					observable: params.observableElem
				},
				elems: {
					progress: (findFirstClass(params.progressElem, document)) ? findFirstClass(params.progressElem, document) : null,
					observable: (findFirstClass(params.observableElem, document)) ? findFirstClass(params.observableElem, document) : null
				},
				params: {
					observable: {
						top: null,
						bottom: null,
						height: null
					},
					windowHeight: null,
					scroll: 0,
					progress: 0
				},
				options: {
					filling: (params.filling && typeof params.filling) ? params.filling : null
				}
			};
			this.helpFuncs = {
				scroll() {

					$module.__progress();

				},
				resize() {

					$module.__getPosition();

				}
			};

			let $elems = this.info.elems;
			let $helpFuncs = this.helpFuncs;

			if ($elems.progress && $elems.observable) {

				this.__setMaxSize();
				this.getPosition();
				windowScroll($helpFuncs.scroll);
				windowResize($helpFuncs.resize);

			}

		}

	}

	__setMaxSize() {

		if (this.info.options.filling == "width") {

			this.info.elems.progress.style.maxWidth = "100%";

		} else if (this.info.options.filling == "height") {

			this.info.elems.progress.style.maxHeight = "100%";

		}

	}

	__getPosition() {

		let $elems = this.info.elems;
		let $params = this.info.params;

		$params.scroll = getWindowScroll();
		$params.observable.top = $elems.observable.getBoundingClientRect().top + $params.scroll;
		$params.observable.bottom = $elems.observable.getBoundingClientRect().bottom + $params.scroll;
		$params.observable.height = $elems.observable.offsetHeight;
		$params.windowHeight = window.innerHeight;

	}

	__progress() {

		let $elems = this.info.elems;
		let $params = this.info.params;
		let $scroll = $params.scroll;
		let $top = $params.observable.top;
		let $bottom = $params.observable.bottom;
		let $filling = this.info.options.filling;

		this.__getPosition();

		if ($scroll > $top && $scroll < $bottom) {

			$params.progress = (($scroll - $top) / ($params.observable.height + $top - $params.windowHeight)) * 100;

			if ($params.progress >= 0) {

				if ($filling == "width") {

					$elems.progress.style.width = "100%";

				} else if ($filling == "height") {

					$elems.progress.style.height = "100%";

				}

			} else {

				if ($filling == "width") {

					$elems.progress.style.width = progress = "%";

				} else if ($filling == "height") {

					$elems.progress.style.height = progress = "%";

				}

			}

		} else if ($scroll < $top) {

			if ($filling == "width") {

				$elems.progress.style.width = "";

			} else if ($filling == "height") {

				$elems.progress.style.height = "";

			}

		}

	}

}