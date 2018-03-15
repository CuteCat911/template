// attr - ver. 1.0.0

export let attr = function(elem, attr, value) {

  if ((elem && typeof elem === "object") && (attr && typeof attr === "string")) {

    if (value || typeof value === "string") {

      elem.setAttribute(attr, value);

    } else {

      let $attr = elem.hasAttribute(attr);

      if ($attr) {

        let $attrValue = elem.getAttribute(attr);

        if ($attrValue) {

          return $attrValue;

        } else {

          return true;

        }

      } else {

        return false;

      }

    }

  }

};