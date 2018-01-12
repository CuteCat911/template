// applyStyle - ver. 1.0.0

export let applyStyle = function(elem, style, event) {

	if ((elem && typeof elem === "object") && (style && typeof style === "object") && (event && typeof event === "string")) {

		for (let i in style) {

			if (event == "add") {

				elem.style[i] = style[i];

			} else if (event == "remove") {

				elem.style[i] = "";

			}

		}

	}

};