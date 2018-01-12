// getXmlHttp - ver. 1.0.0

export let getXmlHttp = function() {

	let xmlHttp;

	try {

    xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");

  } catch(e) {

    try {

      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");

    } catch(E) {

      xmlHttp = false;

    }

  }

  if (!xmlHttp && typeof XMLHttpRequest != "undefined") {

    xmlHttp = new XMLHttpRequest();

  }

  return xmlHttp;

};

// serialize - ver. 1.0.0

export let serialize = function(type, data) {

	if ((type == "POST" || type == "GET") && (data && typeof data === "object")) {

		let serializeData;
    let serializeArray = [];

    for (let key in data) {

    	let str = key + "=" + encodeURIComponent(data[key]);

    	serializeArray.push(str);

    }

    serializeData = serializeArray.join("&");

		if (type == "GET") {

			serializeData = "?" + serializeData;

		}

    return serializeData;

	}

};