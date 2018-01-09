// DragAndDrop V - 1.0.0

import {findFirstClass, findElemsClass} from "./find";
import {inspectMobile} from "./inspectMobile";
import {windowResize} from "./windowResize";
import {findCurrentParent} from "./findCurrentParent";
import {applyStyle} from "./applyStyle";
import {applyClasses} from "./applyClasses";

export let DragAndDrop = function(params) {

	if ((params.container != undefined && typeof params.container === "string") && (params.areas != undefined && typeof params.areas === "string") && (params.fields != undefined && typeof params.fields === "string") && (params.items != undefined && typeof params.items === "string")) {

		let module = this;
		let moduleInfo = {
			blocks: {
				container: findFirstClass(params.container, document),
				areas: undefined,
				fields: undefined,
				items: undefined,
				deleteFields: undefined
			},
			classes: {
				hoverField: undefined,
				hoverItem: undefined,
				activeItem: undefined,
				hoverDeleteField: undefined,
				stopDrag: undefined
			},
			blocksClasses: {
				container: params.container,
				areas: params.areas,
				fields: params.fields,
				items: params.items,
				deleteFields: undefined
			},
			dataAttr: {
				areaName: "data-area",
				fieldType: "data-field-type",
				stopEvent: "data-stop-event",
				deleteItem: "data-type-delete"
			},
			options: {
				window: {
					firstHeight: 0,
					secondHeight: 0,
					diffHeight: 0,
					activeArea: 0
				},
				events: {
					drag: "mousedown",
					move: "mousemove",
					drop: "mouseup"
				},
				mobile: {
					active: false,
					status: false 
				},
				targetEvents: {
					pageY: undefined,
					pageX: undefined,
					clientY: undefined,
					clientX: undefined
				},
				transfer: "local",
				grab: false,
				itemShift: 5,
				fps: 60,
				mobileScrollIndent: 30,
				move: false,
				eventScroll: undefined,
				scrollWindow: false
			},
			functions: {
				beforeDrag: [],
				afterDrag: [],
				onMove: [],
				afterDrop: [],
				beforeDrop: []
			},
			dropped: {
				field: undefined,
				item: undefined
			},
			elemInfo: {
				width: undefined,
				height: undefined,
				element: undefined,
				copyElement: undefined,
				event: undefined,
				coords: {
					top: null,
					left: null,
					right: null,
					bottom: null
				},
				area: {
					element: undefined,
					dataName: undefined,
					coords: {
						top: null,
						left: null,
						right: null,
						bottom: null
					}
				},
				field: {
					element: undefined,
					dataType: "transfer"
				},
				positionShift: undefined
			}
		};
		let positionsElems = {
			areas: {},
			fields: {},
			items: {},
			deleteFields: {}
		};
		let styles = {
			move: {
				body: {
					overflow: "hidden"
				},
				field: {
					position: "relative",
					userSelect: "none",
					zIndex: 5
				},
				item: {
					margin: 0,
					position: "absolute",
					transition: 0,
					zIndex: 10
				},
				shiftItem: {
					position: "relative"
				}
			},
			hide: {
				display: "none",
				zIndex: -9999
			}
		};
		let blocks = moduleInfo.blocks;
		let classes = moduleInfo.classes;
		let blocksClasses = moduleInfo.blocksClasses;
		let dataAttr = moduleInfo.dataAttr;
		let options = moduleInfo.options;
		let functions = moduleInfo.functions;
		let dropped = moduleInfo.dropped;
		let elemInfo = moduleInfo.elemInfo;

		if (blocks.container != undefined && blocks.container != false) {

			let container = blocks.container;

			blocks.areas = findElemsClass(blocksClasses.areas, container);

			if (blocks.areas != undefined && blocks.areas != false) {

				let checkCurrentParent = function(elem) {

					let transfer = options.transfer;
					let startArea = elemInfo.area.element;
					let parent = findCurrentParent(elem, blocksClasses.areas);
					let currentParent = false;

					if (transfer == "local") {

						if (parent == startArea) {

							currentParent = true;

						}

					} else if (transfer == "global") {

						currentParent = true;

					} else if (typeof transfer === "object") {

						let parentDataName = parent.getAttribute(dataAttr.areaName);
						let startAreaDataName = elemInfo.area.dataName;

						for (let part of transfer) {

							if (part.indexOf(startAreaDataName) != -1) {

								for (let item of part) {

									if (parentDataName == item) {

										currentParent = true;

									}

								}

							}

						}

					}

					return currentParent;

				};

				let removeShiftItem = function(elem) {

					if (elem != undefined && typeof elem === "object") {

						applyStyle(elem, styles.move.shiftItem, "remove");
						elem.style.top = "";
						elem.style.left = "";
						elem.style.right = "";
						elem.style.bottom = "";

					}

				};

				let setTargetEvents = function(event) {

					let targetEvents = options.targetEvents;

					if (elemInfo.event != undefined) {

						if (options.mobile.status == false) {

							targetEvents.pageY = elemInfo.event.pageY;
							targetEvents.pageX = elemInfo.event.pageX;
							targetEvents.clientY = elemInfo.event.clientY;
							targetEvents.clientX = elemInfo.event.clientX;

						} else {

							let $window = options.window;

							$window.secondHeight = window.innerHeight;
							$window.diffHeight = $window.firstHeight - $window.secondHeight;

							if (event == "move") {

								targetEvents.pageY = elemInfo.event.targetTouches[0].pageY;
								targetEvents.pageX = elemInfo.event.targetTouches[0].pageX;
								targetEvents.clientY = elemInfo.event.targetTouches[0].clientY;
								targetEvents.clientX = elemInfo.event.targetTouches[0].clientX;

							} else if (event == "drop") {

								targetEvents.pageY = elemInfo.event.changedTouches[0].pageY;
								targetEvents.pageX = elemInfo.event.changedTouches[0].pageX;
								targetEvents.clientY = elemInfo.event.changedTouches[0].clientY;
								targetEvents.clientX = elemInfo.event.changedTouches[0].clientX;

							}

						};

					}

				};

				let setFunction = function(nameFuncArray, func) {

					if (nameFuncArray != undefined && typeof nameFuncArray === "string") {

						if (func != undefined && typeof func === "function") {

							functions[nameFuncArray].push(func);

						} else if (func != undefined && typeof func === "object") {

							for (let item of func) {

								if (typeof item === "function") {

									functions[nameFuncArray].push(item);

								}

							}

						}

					}

				};

				let applyFunction = function(nameFuncArray) {

					if (nameFuncArray != undefined && typeof nameFuncArray === "string") {

						if (functions[nameFuncArray].length > 0) {

							for (let item of functions[nameFuncArray]) {

								item();

							}

						}

					}

				};

				module.getInfo = function() {

					return elemInfo;

				};

				module.clearElemInfo = function() {

					applyStyle(elemInfo.area.element, styles.move.field, "remove");
					applyStyle(elemInfo.element, styles.hide, "remove");
					elemInfo.area.element.removeChild(elemInfo.copyElement);

					for (let i in elemInfo) {

						if (i != "coords" && i != "area" && i != "field") {

							elemInfo[i] = undefined;

						}

					}

					for (let item of [elemInfo.coords, elemInfo.area.coords]) {

						for (let i in item) {

							item[i] = null;

						}

					}

					for (let item of [elemInfo.area, elemInfo.field]) {

						for (let i in item) {

							if (i != "coords" && i != "dataType") {

								item[i] = undefined;

							}

						}

					}

					elemInfo.field.dataType = "transfer";

				};

				module.clearDropElem = function() {

					removeShiftItem(dropped.item);

					if (classes.hoverItem != undefined && typeof classes.hoverItem === "string") {

						applyClasses(dropped.item, [classes.hoverItem], "remove");

					};

					if (classes.hoverField != undefined && typeof classes.hoverField === "string") {

						applyClasses(dropped.field, [classes.hoverField], "remove");

					};

					for (let i in dropped) {

						dropped[i] = undefined;

					}

				};

				module.clearBodyStyle = function() {

					applyStyle(document.body, styles.move.body, "remove");

				};

				module.getAllPosition = function() {

					let getPosition = function(array, nameArrayElems) {

						if ((array != undefined && typeof array === "object") && (nameArrayElems != undefined && typeof nameArrayElems === "string")) {

							for (let i in array[nameArrayElems]) {

								let item = array[nameArrayElems][i];

								if (typeof item === "object" && item != elemInfo.copyElement) {

									let coords = item.getBoundingClientRect();

									positionsElems[nameArrayElems][i] = {
										element: item,
										coords: {
											top: coords.top + pageYOffset,
											left: coords.left + pageXOffset,
											right: coords.right + pageXOffset,
											bottom: coords.bottom + pageYOffset
										}
									}

								}

							}

						}

					};

					getPosition(blocks, "areas");
					getPosition(blocks, "fields");
					getPosition(blocks, "items");

				};

				module.scrollWindow = function(diffTop) {

					let windowHeight = parseFloat(options.window.secondHeight);
					let documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
					let scroll = window.pageYOffset || document.documentElement.scrollTop;
					let activeArea = options.window.activeArea;
					let scrollScreen = function(event) {

						if (event != undefined && typeof event === "string") {

							if (event == "top" || event == "bottom") {

								if (options.scrollWindow == false) {

									let stopScroll = function() {

										options.scrollWindow = false;
										clearInterval(options.eventScroll);

									};

									options.scrollWindow = true;
									options.eventScroll = setInterval(function() {

										let scroll = window.pageYOffset || document.documentElement.scrollTop;

										if (event == "top") {

											if (scroll > 0 && (elemInfo.copyElement != undefined && typeof elemInfo.copyElement === "object")) {

												window.scrollBy(0, -6);

											} else {

												stopScroll();

											}

										} else if (event == "bottom") {

											if (scroll <= documentHeight - windowHeight && (elemInfo.copyElement != undefined && typeof elemInfo.copyElement === "object")) {

												window.scrollBy(0, 6);

											} else {

												stopScroll();

											}

										}

									}, 1000 / options.fps);

								};

							} else if (event == "stop") {

								options.scrollWindow = false;
								clearInterval(options.eventScroll);

							}

						};

					};

					activeArea = options.targetEvents.pageY - scroll;
					
					if (activeArea <= options.mobileScrollIndent) {

						scrollScreen("top");

					} else if (activeArea >= windowHeight - options.mobileScrollIndent) {

						scrollScreen("bottom");

					} else {

						scrollScreen("stop");

					}

				};

				module.beforeDrag = function(func) {

					setFunction("beforeDrag", func);

				};

				module.applyBeforeDrag = function() {

					applyFunction("beforeDrag");

				};

				module.afterDrag = function(func) {

					setFunction("afterDrag", func);

				};

				module.applyAfterDrag = function() {

					applyFunction("afterDrag");

				};

				module.onMove = function(func) {

					setFunction("onMove", func);

				};

				module.applyOnMove = function() {

					applyFunction("onMove");

				};

				module.beforeDrop = function(func) {

					setFunction("beforeDrop", func);

				};

				module.applyBeforeDrop = function() {

					applyFunction("beforeDrop");

				};

				module.afterDrop = function(func) {

					setFunction("afterDrop", func);

				};

				module.applyAfterDrop = function() {

					applyFunction("afterDrop");

				};

				module.move = function() {

					let diffTop = 0;
					let diffLeft = 0;
					let targetEvents = options.targetEvents;
					let hoverClass = function(elem, event, addClass) {

						if ((elem != undefined && typeof elem === "object") && (event != undefined && typeof event === "string")) {

							if (addClass != undefined && typeof addClass === "string") {

								applyClasses(elem, [addClass], event);

							}

						}

					};
					let shiftItem = function(elem, elemCoords) {

						if ((elem != undefined && typeof elem === "object") && (elemCoords != undefined && typeof elemCoords === "object")) {

							let elemWidth = elemCoords.right - elemCoords.left;
							let halfElemWidth = elemWidth / 2;
							let elemHeight = elemCoords.bottom - elemCoords.top;
							let halfElemHeight = elemHeight / 2;
							let parentField = findCurrentParent(elem, blocksClasses.fields);
							let parentFieldPaddingLeft = parseFloat(getComputedStyle(parentField).paddingLeft);
							let parentFieldPaddingRight = parseFloat(getComputedStyle(parentField).paddingRight);
							let parentFieldWidth = parentField.clientWidth;
							let parentFieldTotalWidth = parentFieldWidth - (parentFieldPaddingLeft + parentFieldPaddingRight);

							applyStyle(elem, styles.move.shiftItem, "add");

							if (elemWidth * 2 > parentFieldTotalWidth) {

								if (targetEvents.pageY >= elemCoords.top && targetEvents.pageY <= halfElemHeight + elemCoords.top) {

									elem.style.bottom = "";
									elem.style.top = options.itemShift + "px";

								} else if (targetEvents.pageY > halfElemHeight + elemCoords.top && targetEvents.pageY <= elemCoords.bottom) {

									elem.style.top = "";
									elem.style.bottom = options.itemShift + "px";

								}

							} else {

								if (targetEvents.pageX >= elemCoords.left && targetEvents.pageX <= halfElemWidth + elemCoords.left) {

									elem.style.right = "";
									elem.style.left = options.itemShift + "px";

								} else if (targetEvents.pageX > halfElemWidth + elemCoords.left && targetEvents.pageX <= elemCoords.right) {

									elem.style.left = "";
									elem.style.right = options.itemShift + "px";

								}

							}

						}

					};
					let getHoverElem = function(arrayElems, nameElem) {

						if ((arrayElems != undefined && typeof arrayElems === "object") && (nameElem != undefined && typeof nameElem === "string")) {

							for (let i in arrayElems) {

								let item = arrayElems[i];
								let className;

								switch(nameElem) {
									case "field":
										className = classes.hoverField;
										break;
									case "item":
										className = classes.hoverItem;
										break;
								}

								if ((targetEvents.pageY >= item.coords.top && targetEvents.pageY <= item.coords.bottom) && (targetEvents.pageX >= item.coords.left && targetEvents.pageX <= item.coords.right)) {

									let currentParent = checkCurrentParent(item.element);
									let parentField;
									let stopEvents;

									switch(nameElem) {
										case "field":
											parentField = item.element;
											break;
										case "item":
											parentField = findCurrentParent(item.element, blocksClasses.fields);
											break;
									}

									if (parentField.hasAttribute(dataAttr.stopEvent)) {

										stopEvents = parentField.getAttribute(dataAttr.stopEvent).split(", ");

									}

									if (currentParent) {

										let applyHover = function() {

											hoverClass(item.element, "add", className);

											if (nameElem == "item") {

												shiftItem(item.element, item.coords);

											}

										};

										let applyStopEvents = function() {

											if (stopEvents) {

												if (stopEvents.indexOf(elemInfo.field.dataType) == -1) {

													applyHover();

												}

											} else {

												applyHover();

											}

										}

										if (elemInfo.field.dataType == "copy") {

											if (parentField != elemInfo.field.element) {

												applyStopEvents();

											}

										} else {

											applyStopEvents();

										}

									}

								} else {

									hoverClass(item.element, "remove", className);

									if (nameElem == "item") {

										removeShiftItem(item.element);

									}

								}

							}

						}

					};
					let setPosition = function(elem) {

						if (elem != undefined && typeof elem === "object") {

							let scroll = window.pageYOffset || document.documentElement.scrollTop;
							let elemCoords = elemInfo.coords;
							let areaCoords = elemInfo.area.coords;
							let top;
							let left;

							if (diffTop == 0) {

								diffTop = targetEvents.pageY - elemCoords.top;

							}

							if (diffLeft == 0) {

								diffLeft = targetEvents.pageX - elemCoords.left;

							}

							top = targetEvents.clientY - areaCoords.top - diffTop + scroll - options.window.diffHeight;
							left = targetEvents.clientX - areaCoords.left - diffLeft;
							elem.style.top = top + "px";
							elem.style.left = left + "px";

							getHoverElem(positionsElems.fields, "field");
							getHoverElem(positionsElems.items, "item");

						}

					};

					document.addEventListener(options.events.move, function(e) {

						if (options.move == true && elemInfo.copyElement != undefined) {
							
							elemInfo.event = e;
							setTargetEvents("move");
							setPosition(elemInfo.copyElement);

							if (options.mobile.status == true) {

								module.scrollWindow(diffTop);

							}

							module.applyOnMove();
						
						}

					});

				};

				module.drag = function() {

					let info = moduleInfo.elemInfo;
					let getCoords = function(elem, array) {

						if (elem != undefined && typeof elem === "object") {

							for (let i in array) {

								array[i] = elem.getBoundingClientRect()[i];

							}

						}

					};
					let setPosition = function(elem) {

						if (elem != undefined && typeof elem === "object") {

							let top = elemInfo.coords.top - elemInfo.area.coords.top;
							let left = elemInfo.coords.left - elemInfo.area.coords.left;

							elem.style.top = top + "px";
							elem.style.left = left + "px";

						}

					};
					let collectInfoDragElem = function() {

						elemInfo.width = elemInfo.element.offsetWidth;
						elemInfo.height = elemInfo.element.offsetHeight;
						elemInfo.area.element = findCurrentParent(elemInfo.element, blocksClasses.areas);
						elemInfo.field.element = findCurrentParent(elemInfo.element, blocksClasses.fields);
						elemInfo.copyElement = elemInfo.element.cloneNode(true);
						getCoords(elemInfo.element, elemInfo.coords);
						getCoords(elemInfo.area.element, elemInfo.area.coords);

						if (elemInfo.area.element.hasAttribute(dataAttr.areaName)) {

							elemInfo.area.dataName = elemInfo.area.element.getAttribute(dataAttr.areaName);

						}

						if (elemInfo.field.element.hasAttribute(dataAttr.fieldType)) {

							elemInfo.field.dataType = elemInfo.field.element.getAttribute(dataAttr.fieldType);

						}

					};

					collectInfoDragElem();
					blocks.fields = findElemsClass(blocksClasses.fields, container);
					blocks.items = findElemsClass(blocksClasses.items, blocks.container);
					elemInfo.area.element.appendChild(elemInfo.copyElement);
					applyStyle(elemInfo.area.element, styles.move.field, "add");
					elemInfo.copyElement.style.width = elemInfo.width + "px";
					elemInfo.copyElement.style.height = elemInfo.height + "px";
					applyStyle(elemInfo.copyElement, styles.move.item, "add");

					if (classes.activeItem != undefined && typeof classes.activeItem === "string") {

						applyClasses(elemInfo.copyElement, [classes.activeItem], "add");

					}

					if (elemInfo.field.dataType != "copy") {

						applyStyle(elemInfo.element, styles.hide, "add");

					}

					if (options.grab == true) {

						elemInfo.copyElement.style.cursor = "-webkit-grabbing";
						elemInfo.copyElement.style.cursor = "-moz-grabbing";
						elemInfo.copyElement.style.cursor = "-o-grabbing";
						elemInfo.copyElement.style.cursor = "grabbing";

					};

					if (options.mobile.status == true) {

						applyStyle(document.body, styles.move.body, "add");

					}
					
					setPosition(elemInfo.copyElement);
					options.move = true;
					module.move();
					module.getAllPosition();

				};

				module.drop = function() {

					if (elemInfo.event != undefined) {

						let stopDrop = false;
						let targetEvents = options.targetEvents;
						let setShiftPosition = function(elemCoords) {

							let elemWidth = elemCoords.right - elemCoords.left;
							let halfElemWidth = elemWidth / 2;
							let elemHeight = elemCoords.bottom - elemCoords.top;
							let halfElemHeight = elemHeight / 2;
							let parentField = dropped.field;
							let parentFieldPaddingLeft = parseFloat(getComputedStyle(parentField).paddingLeft);
							let parentFieldPaddingRight = parseFloat(getComputedStyle(parentField).paddingRight);
							let parentFieldWidth = parentField.clientWidth;
							let parentFieldTotalWidth = parentFieldWidth - (parentFieldPaddingLeft + parentFieldPaddingRight);

							if (elemWidth * 2 > parentFieldTotalWidth) {

								if (targetEvents.pageY >= elemCoords.top && targetEvents.pageY <= halfElemHeight + elemCoords.top) {

									elemInfo.positionShift = "before";

								} else if (targetEvents.pageY > halfElemHeight + elemCoords.top && targetEvents.pageY <= elemCoords.bottom) {

									elemInfo.positionShift = "after";

								}

							} else {

								if (targetEvents.pageX >= elemCoords.left && targetEvents.pageX <= halfElemWidth + elemCoords.left) {

									elemInfo.positionShift = "before";

								} else if (targetEvents.pageX > halfElemWidth + elemCoords.left && targetEvents.pageX <= elemCoords.right) {

									elemInfo.positionShift = "after";

								}

							}

						};
						let dropElem = function(arrayElems, nameElem) {

							if ((arrayElems != undefined && typeof arrayElems === "object") && (nameElem != undefined && typeof nameElem === "string")) {

								for (let i in arrayElems) {

									let item = arrayElems[i];

									if ((targetEvents.pageY >= item.coords.top && targetEvents.pageY <= item.coords.bottom) && (targetEvents.pageX >= item.coords.left && targetEvents.pageX <= item.coords.right)) {

										let currentParent = checkCurrentParent(item.element);
										let parentField;
										let stopEvents;

										switch(nameElem) {
											case "field":
												parentField = item.element;
												break;
											case "item":
												parentField = findCurrentParent(item.element, blocksClasses.fields);
												break;
										}

										if (parentField.hasAttribute(dataAttr.stopEvent)) {

											stopEvents = parentField.getAttribute(dataAttr.stopEvent);

										}

										if (currentParent) {

											let setDroppedElem = function() {

												dropped[nameElem] = item.element;

												if (nameElem == "item") {

													setShiftPosition(item.coords);

												}

											};
											let setStopEvents = function() {

												if (stopEvents) {

													if (stopEvents.indexOf(elemInfo.field.dataType) == -1) {

														setDroppedElem();

													}

												} else {

													setDroppedElem();

												}

											};

											if (elemInfo.field.dataType == "copy") {

												if (parentField != elemInfo.field.element) {

													if (dropped[nameElem] != item.element) {

														setStopEvents();

													}

												}

											} else {

												if (dropped[nameElem] != item.element) {

													setStopEvents();

												}

											}

										}

									}

								}

							}

						};
						let addElement = function() {

							let dropField = dropped.field;
							let dropItem = dropped.item;

							if (dropField) {

								let portableItem;

								if (elemInfo.field.dataType == "copy") {

									if (elemInfo.field.element != dropField) {

										portableItem = elemInfo.element.cloneNode(true);
										applyStyle(portableItem, styles.hide, "remove");

									}

								} else if (elemInfo.field.dataType == "transfer") {

									portableItem = elemInfo.element;

								}

								if (dropItem) {

									if (elemInfo.positionShift == "before") {

										dropField.insertBefore(portableItem, dropped.item);

									} else if (elemInfo.positionShift == "after") {

										let afterItem;
										let droppedFieldItems = findElemsClass(blocksClasses.items, dropped.field);

										droppedFieldItems = Array.prototype.slice.call(droppedFieldItems);

										for (let i in droppedFieldItems) {

											let item = droppedFieldItems[i];

											if (item == dropped.item) {

												afterItem = droppedFieldItems[+i + 1];

											};

										}

										dropField.insertBefore(portableItem, afterItem);

									}

								} else {

									dropField.appendChild(portableItem);

								}

							}

						};

						options.move = false;
						dropElem(positionsElems.fields, "field");
						dropElem(positionsElems.items, "item");
						addElement();
						module.clearElemInfo();
						module.clearDropElem();

						if (options.mobile.status == true) {

							module.clearBodyStyle();

						}

						module.applyAfterDrop();

					}

				};

				module.applyDrop = function() {

					setTargetEvents("drop");
					module.applyBeforeDrop();
					module.drop();

				};

				module.setDefaultParams = function() {

					if (params.mobile == true) {

						let mobile = options.mobile;
						let setMobileEvents = function() {

							let events = options.events;

							events.drag = "touchstart",
							events.move = "touchmove",
							events.drop = "touchend"

						};
						let setMobile = function() {

							mobile.status = inspectMobile();

							if (mobile.status == true) {

								setMobileEvents();

							}

						};
						let $windowResize = new windowResize(setMobile);

						mobile.active = params.mobile;
						setMobile();
						options.window.firstHeight = window.innerHeight;

					};

					if (params.transfer != undefined && (typeof params.transfer === "string" || typeof params.transfer === "object")) {

						options.transfer = params.transfer;

					};

					if (params.itemShift != undefined && typeof params.itemShift === "number" && params.itemShift > 0) {

						options.itemShift = params.itemShift;

					};

					if (params.mobileScrollIndent != undefined && typeof params.mobileScrollIndent === "number" && params.mobileScrollIndent >= 20) {

						if (options.window.firstHeight / 2 >= params.mobileScrollIndent) {

							options.mobileScrollIndent = params.mobileScrollIndent;

						}

					};

					if (params.grab == true) {

						options.grab = params.grab;

					};

					let getClasses = function(arrayItem, paramsItem) {

						if ((arrayItem != undefined && typeof arrayItem === "string") && (paramsItem != undefined && typeof paramsItem === "string")) {

							if (params[paramsItem] != undefined && typeof params[paramsItem] === "string") {

								classes[arrayItem] = params[paramsItem];

							}

						}

					};

					getClasses("hoverItem", "hoverItemClass");
					getClasses("activeItem", "activeItemClass");
					getClasses("hoverField", "hoverFieldClass");
					getClasses("stopDrag", "stopDragClass");

				}

				module.setDefaultParams();

				document.addEventListener(options.events.drag, function(e) {

					let elem = e.target;

					if (elem.classList.contains(blocksClasses.items)) {

						if (options.mobile.status == false) {

							e.preventDefault();

						}

						elemInfo.element = elem;
						module.applyBeforeDrag();
						module.drag();
						module.applyAfterDrag();

					} else {

						if (!elem.classList.contains(classes.stopDrag)) {

							let stopParent = findCurrentParent(elem, classes.stopDrag);

							if (stopParent != undefined || stopParent != false) {

								let parent = findCurrentParent(elem, blocksClasses.items);

								if (parent) {

									if (options.mobile.status == false) {

										e.preventDefault();

									}

									elemInfo.element = parent;
									module.applyBeforeDrag();
									module.drag();
									module.applyAfterDrag();

								}

							}

						}

					}

				});

				document.addEventListener(options.events.drop, function(e) {

					let elem = e.target;

					if ((elemInfo.element != undefined && typeof elemInfo.element == "object") && (elemInfo.copyElement != undefined && typeof elemInfo.element == "object")) {

						if (elem == elemInfo.copyElement || (options.mobile.status == true && elem != elemInfo.copyElement)) {

							elemInfo.event = e;
							setTargetEvents("drop");
							module.applyBeforeDrop();
							module.drop();

						} else {

							let parent = findCurrentParent(elem, blocksClasses.items);

							if (parent && parent == elemInfo.copyElement) {

								elemInfo.event = e;
								setTargetEvents("drop");
								module.applyBeforeDrop();
								module.drop();

							}

						}

					}

				});

			} else {

				console.error("Ключевые элементы или элемент на странице не найден(ы)");

			}

		} else {

			console.error("Главный контейнер на странице не найден.");

		}

	} else {

		console.error("Все или один из параметров не задан, или задан не в том формате.");

	}

};