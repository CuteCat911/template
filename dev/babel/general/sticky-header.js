// StickyHeader - ver 1.0.0

import {findFirstClass} from "./find";
import {applyStyle} from "./apply-style";
import {windowScroll, getWindowScroll} from "./window-scroll";
import {windowResize} from "./window-resize";

export let StickyHeader = class {

	constructor (params) {

		if (params.header && typeof params.header === "string") {

			let $module = this;

			this.info = {
				class: params.header,
				el: (findFirstClass(params.header, document)) ? findFirstClass(params.header, document) : null,
				indent: {
					mode: (params.indent && typeof params.indent === "string") ? params.indent : false,
					el: (params.indent == "element" && (params.indentElem && typeof params.indentElem === "object")) ? params.indentElem : null,
					class: (params.indent == "class" && (params.indentClass && typeof params.indentClass === "string")) ? params.indentClass : null,
					autoHeight: (params.indentAutoHeight && typeof params.indentAutoHeight) ? params.indentAutoHeight : false
				},
				params: {
					windowWidth: null,
					minWidth: (params.minWidth > 0) ? params.minWidth : null,
					scroll: false,
					lastScroll: 0,
					transitionTime: (params.transitionTime && typeof params.transitionTime === "string") ? params.transitionTime : null
				},
				options: {
					mode: (params.mode && typeof params.mode === "string") ? params.mode : "default"
				}
			};
			this.styles = {
				absolute: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					zIndex: (params.zIndex <= 0 || params.zIndex >= 0) ? params.zIndex : 100
				},
				fixed: {
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					zIndex: (params.zIndex <= 0 || params.zIndex >= 0) ? params.zIndex : 100
				},
				lurking: {
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					transition: (params.transitionTime && typeof params.transitionTime === "string") ? "transform " + params.transitionTime + " linear" : null
					zIndex: (params.zIndex <= 0 || params.zIndex >= 0) ? params.zIndex : 100
				},
				indent: {
					display: "block",
					width: "100%"
				}
			};
			this.helpFuncs = {
				resize() {

					$module.__checkScroll();
					$module.__createIndent();
					$module.applyHeaderMode();

				},
				scroll() {

					$module.__scroll();

				}
			};

			let $info = this.info;
			let $helpFuncs = this.helpFuncs;

			if ($info.el) {

				this.__checkScroll();
				this.__createIndent();
				this.applyHeaderMode();
				windowScroll($helpFuncs.scroll);
				windowResize($helpFuncs.resize);

			}

		}

	}

	__checkScroll() {

		let $params = this.info.params;

		$params.windowWidth = window.innerWidth;

		if ($params.minWidth) {

			if ($params.windowWidth >= $params.minWidth) {

				$params.scroll = true;

			} else if ($params.windowWidth < $params.minWidth) {

				$params.scroll = false;

			}

		} else {

			$params.scroll = true;

		}

	}

	__createIndent() {

		let $info = this.info;
		let $indent = $info.indent;
		let $params = $info.params;
		let $styles = this.styles;

		if ($params.scroll && !$indent.el) {

			let headerHeight = $info.el.offsetHeight;
			let parent = $info.el.parentNode;

			if ($indent.mode == "default") {

				$indent.el = document.createElement("div");
				$indent.el.style.height = headerHeight + "px";
				$indent.el.style.transition = "height " + $params.transitionTime + " linear";
				applyStyle($indent.el, $styles.indent, "add");
				parent.insertBefore($indent.el, $info.el.nextSibling);

			} else if ($indent.mode == "element") {

				if ($params.indentAutoHeight) {

					$indent.el.style.height = headerHeight + "px";
					$indent.el.style.transition = "height " + $params.transitionTime + " linear";

				}

				parent.insertBefore($indent.el, $info.el.nextSibling);

			} else if ($indent.mode == "class") {

				$indent.el = findFirstClass($indent.class, document);

				if ($params.indentAutoHeight) {

					$indent.el.style.height = headerHeight + "px";
					$indent.el.style.transition = "height " + $params.transitionTime + " linear";

				}

			}

		} else if (!$params.scroll && $indent.el) {

			if ($indent.mode != "class") {

				let parent = $indent.el.parentNode;

				if (parent) {

					parent.removeChild($indent.el);

				}

				$indent.el = null;

			}

		}

	}

	__applyHeaderMode() {

		let $info = this.info;
		let $mode = $info.options.mode;
		let $scroll = $info.params.scroll;
		let $styles = this.styles;

		if ($scroll) {

			applyStyle($info.el, $mode, "add");

		} else {

			applyStyle($info.el, $mode, "remove");

		}

	}

	__scroll() {

		let $info = this.info;
		let $params = $info.params;
		let $options - $info.options;

		if ($params.scroll && $info.el) {

			let scroll = getWindowScroll();

			this.__setCurrentIndentHeight();

			if ($options.mode == "lurking") {

				if (scroll > $params.lastScroll) {

					if (scroll >= $info.el.offsetHeight) {

						$info.el.style.transform = "translateY(-100%)";

					}

				} else {

					$info.el.style.transform = "";

				}

				$params.lastScroll = scroll;

			}

		}

	}

	__setCurrentIndentHeight() {

		let $info = this.info;

		if ($info.indent.el && $info.params.indentAutoHeight) {

			$info.indent.el.style.height = $info.el.offsetHeight + "px";

		}

	}

};