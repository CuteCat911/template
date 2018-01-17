// import {findElemsClass, findFirstTag} from "./find";
// import {windowResize} from "./window-resize";
// import {pageLoad} from "./page-load";
// import {inspectMobile} from "./inspect-mobile";

// export let hoverSvg = function(params) {

// 	if (params.icons != undefined && typeof params.icons === "string") {

// 		let module = this;
// 		let $svg = {
// 			icons: findElemsClass(params.icons, document),
// 			svgIconDocument: undefined,
// 			svgIcon: undefined,
// 			eventStart: "mouseover",
// 			eventEnd: "mouseout"
// 		};

// 		if ($svg.icons != undefined && typeof $svg.icons === "object") {

// 			let mobile = inspectMobile();
// 			let reWriteEvent = function() {

// 				mobile = inspectMobile();

// 				if (mobile == true) {

// 					$svg.eventStart = "touchstart";
// 					$svg.eventEnd = "touchend";

// 				}

// 				else {

// 					$svg.eventStart = "mouseover";
// 					$svg.eventEnd = "mouseout";

// 				}

// 			};

// 			if (mobile == true) {

// 				$svg.eventStart = "touchstart";
// 				$svg.eventEnd = "touchend";

// 			};

// 			let mobileResize = new windowResize(reWriteEvent);

// 			module.hover = function(event, elem) {

// 				$svg.svgIconDocument = findFirstTag("object", elem);

// 				if ($svg.svgIconDocument != false) {

// 					$svg.svgIconDocument = $svg.svgIconDocument.contentDocument;
// 					$svg.svgIcon = findFirstTag("svg", $svg.svgIconDocument);

// 					if ($svg.svgIcon != false) {

// 						let elemClassesLength = $svg.svgIcon.classList.length;

// 						if (elemClassesLength != 0) {

// 							let firstClass = $svg.svgIcon.classList[0];
// 							let hoverClass = firstClass + "--hover";

// 							if (event == "add") {

// 								$svg.svgIcon.classList.add(hoverClass);

// 							}

// 							else {

// 								$svg.svgIcon.classList.remove(hoverClass);

// 							}

// 						}

// 						else {

// 							if (event == "add") {

// 								$svg.svgIcon.classList.add("hovered");

// 							}

// 							else {

// 								$svg.svgIcon.classList.remove("hovered");

// 							}

// 						}

// 					}

// 				}

// 			};

// 			let iconsEvent = function() {

// 				for (let item of $svg.icons) {

// 					item.addEventListener($svg.eventStart, function() {

// 						module.hover("add", item);

// 					});

// 					item.addEventListener($svg.eventEnd, function() {

// 						module.hover("remove", item);

// 					});

// 				}

// 			};

// 			let hover = new pageLoad(iconsEvent);

// 		}

// 		else {

// 			console.error();
// 			return false;

// 		}

// 	}

// 	else {

// 		console.error();
// 		return false;

// 	}

// }