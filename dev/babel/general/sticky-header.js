// StickyHeader - ver 1.0.0

// Description
// * * * = * * *

// Функция конструктор, реализующая функционал фиксированной или абсолютно позиционированной шапки.

// Принимает в себя объект с параметрами.
// Описание параметров:
// 1. header (обязательный) (тип string) - класс шапки страницы.
// 2. mode (не обязательный) (тип string) - режим в котором будет работать шапка.
// 3. indent (не обязательный) (тип boolean или object или string) - отвечает за отступ на странице (нужно для того чтобы контент не залез под шапку в абсолютном и виксированном позиционировании).
// 4. indentAutoHeight (не обязательный) (тип boolean) - отвечает за изменения высоты отступа при скролле в случае изменения высоты шапки.
// 5. classOnScroll (не обязательный) (тип string) - класс который будет добавлен при скролле к шапке.
// 6. indentClassOnScroll (не обязательный) (тип number) - отступ после которого будет добавлен classOnScroll к шапке.
// 7. transitionTime (не обязательный) (тип string) - отвечает за скорость изменения высоты отступа и в некоторых случаях изменения анимации у шапки. (Записывается как в css "0.4s").
// 8. zIndex (не обязательный) (тип number) - значение z-index для различных стилей шапки.
// 9. minWidth (не обязательный) (тип number) - минимальная ширина экрана при котором будет работать плагин.

// Возможные значения параметра mode:
// 1. default - стандартное значение, стоит по-умолчанию, ни на что не влияет.
// 2. absolute - шапка будет спозиционирована абсолютом.
// 3. fixing - шапка будет фиксированная.
// 4. lurking - разновидность фиксированной шапки, только при скролле вниз она скрывается, а при скролле вверх появляется.

// Возможные значения параметра indent:
// 1. true - отступ будет создан плагином и вставлен после шапки (всегда будет отслеживать размер шапки).
// 2. object - можно передать уже готовый элемент, который будет вставлен после шапки (отслеживание высоты задается при помощи indentAutoHeight).
// 3. class - класс элемента, который уже есть на странице, он и будет выполнять роль отступа (отслеживание высоты задается при помощи indentAutoHeight).

// Пример объекта с параметрами:
// {
//     header: "sticky-header",
//     mode: "lurking",
//     indent: true,
//     transitionTime: "0.3s",
//     minWidth: 1024
// };

// * * * = * * *
// End Description

import {findFirstClass} from "./find";
import {applyStyle} from "./apply-style";
import {windowScroll, getWindowScroll} from "./window-scroll";
import {windowResize} from "./window-resize";

export let StickyHeader = function(params) {

	if (params.header && typeof params.header === "string") {

		let module = this;
		let moduleInfo = {
			header: findFirstClass(params.header, document),
			options: {
				mode: "default",
				classOnScroll: null,
				indentClassOnScroll: 0,
				transitionTime: 0,
				windowWidth: null,
				minWidth: null,
				scroll: false,
				lastScroll: 0
			},
			indent: {
				mode: false,
				elem: null,
				autoHeight: false
			}
		};
		let styles = {
			absolute: {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				zIndex: 100
			},
			fixed: {
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				zIndex: 100
			},
			lurking: {
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				zIndex: 100
			},
			indent: {
				display: "block",
				width: "100%"
			}
		};

		// Сокращение часто используемых частей объекта moduleInfo

		let header = moduleInfo.header;
		let options = moduleInfo.options;
		let indent = moduleInfo.indent;

		// End Сокращение часто используемых частей объекта moduleInfo

		if (header) {

			// Функция установки дефолтных или пользовательских параметров

			module.setParams = function() {

				if (params.mode && typeof params.mode === "string") {

					options.mode = params.mode;

				}

				if (params.indent) {

					indent.mode = params.indent;

				}

				if (params.indentAutoHeight == true) {

					indent.autoHeight = params.indentAutoHeight;

				}

				if (params.classOnScroll && typeof params.classOnScroll === "string") {

					options.classOnScroll = params.classOnScroll;

				}

				if (params.indentClassOnScroll && typeof params.indentClassOnScroll === "number") {

					options.indentClassOnScroll = Math.abs(params.indentClassOnScroll);

				}

				if (params.transitionTime && typeof params.transitionTime === "string") {

					options.transitionTime = params.transitionTime;
					styles.lurking.transition = "transform " + options.transitionTime + " linear";

				}

				if (params.zIndex && typeof params.zIndex === "number") {

					styles.absolute.zIndex = params.zIndex;
					styles.fixed.zIndex = params.zIndex;
					styles.lurking.zIndex = params.zIndex;

				}

				if (params.minWidth && typeof params.minWidth === "number") {

					options.minWidth = Math.abs(params.minWidth);

				}

			};

			// End Функция установки дефолтных или пользовательских параметров

			// Функция добавления или удаления стилей для различных режимов шапки

			module.applyHeaderMode = function(mode) {

				if (mode && typeof mode === "string") {

					if (mode == "add") {

						applyStyle(header, styles[options.mode], mode);

					} else if (mode == "remove") {

						applyStyle(header, styles[options.mode], mode);

					}

				}

			};

			// End Функция добавления или удаления стилей для различных режимов шапки

			// Функция создания отступа

			module.createIndent = function(mode) {

				if (mode && typeof mode === "string") {

					if (mode == "add" && !indent.elem) {

						let $indent;
						let headerHeight = header.offsetHeight;
						let parent = header.parentNode;

						if (indent.mode == true) {

							$indent = document.createElement("div");
							applyStyle($indent, styles.indent, "add");
							$indent.style.height = headerHeight + "px";
							parent.insertBefore($indent, header.nextSibling);

						} else if (typeof indent.mode === "object") {

							$indent = options.indent;

							if (options.indentAutoHeight == true) {

								$indent.style.height = headerHeight + "px";

							}

							parent.insertBefore($indent, header.nextSibling);

						} else if (typeof indent.mode === "string") {

							$indent = findFirstClass(options.indent, document);

							if (options.indentAutoHeight == true) {

								$indent.style.height = headerHeight + "px";

							}

						};

						if ($indent) {

							$indent.style.transition = "height " + options.transitionTime + " linear";
							indent.elem = $indent;

						}

					} else if (mode == "remove" && indent.elem) {

						if (indent.mode == true) {

							indent.elem.remove();

						} else if (typeof indent.mode === "object") {

							indent.elem.remove();

						}

						indent.elem = null;

					}

				}

			};

			// End Функция создания отступа

			// Функция отслеживания и установки корректной высоты для отступа

			module.setCurrentHeight = function() {

				let headerHeight = header.offsetHeight;

				if (options.indent == true) {

					options.indentElem.style.height = headerHeight + "px";

				} else if (options.indentAutoHeight == true) {

					if (options.indentElem) {

						options.indentElem.style.height = headerHeight + "px";

					}

				}

			};

			// End Функция отслеживания и установки корректной высоты для отступа

			// Функция проверки на возможность или не возможность работы плагина

			module.setOnScroll = function() {

				options.windowWidth = window.innerWidth;

				if (options.minWidth) {

					if (options.windowWidth >= options.minWidth) {

						options.scroll = true;

					} else if (options.windowWidth < options.minWidth) {

						options.scroll = false;

					}

				} else {

					options.scroll = true;

				}

			};

			// End Функция проверки на возможность или не возможность работы плагина

			// Функция, которая во время скролла работает с шапкой

			module.scroll = function() {

				if (options.scroll == true) {

					let scroll = getWindowScroll();

					module.setCurrentHeight();

					if (options.classOnScroll) {

						if (scroll > options.indentClassOnScroll) {

							header.classList.add(options.classOnScroll);

						} else {

							header.classList.remove(options.classOnScroll);

						}

					}

					if (options.mode == "lurking") {

						let headerHeight = header.offsetHeight;

						if (scroll > options.lastScroll) {

							if (scroll >= headerHeight) {

								header.style.transform = "translateY(-100%)";

							}

						} else {

							header.style.transform = "";

						}

						options.lastScroll = scroll;

					}

				}

			};

			// End Функция, которая во время скролла работает с шапкой

			// Функция, которая отслеживает ширину экрана и стирает или удаляет настройки, стили и элементы (нужно для того чтобы можно было выключать или включать плагин при ресайзе окна)

			module.controlWindowSize = function() {

				if (options.scroll == true) {

					module.applyHeaderMode("add");
					module.createIndent("add");
					module.setCurrentHeight();

				} else {

					module.applyHeaderMode("remove");
					module.createIndent("remove");

				}

			};

			// End Функция, которая отслеживает ширину экрана и стирает или удаляет настройки, стили и элементы (нужно для того чтобы можно было выключать или включать плагин при ресайзе окна)

			module.setOnScroll();
			module.setParams();
			module.applyHeaderMode("add");
			module.createIndent("add");
			module.setCurrentHeight();
			windowScroll(module.scroll);
			windowResize([module.setOnScroll, module.controlWindowSize]);

		} else {

			console.error();

		}

	} else {

		console.error();

	}

};