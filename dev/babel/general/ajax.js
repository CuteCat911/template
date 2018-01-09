// getXmlHttp - ver. 1.0.0

// Description
// * * * = * * *

// Функция получения объекта xmlHttp, используемого для обмена данными с сервером.

// Возвращает объект xmlHttp. 

// * * * = * * *
// End Description

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

// Description
// * * * = * * *

// Функция преобразования объекта с данными в корректную строку для передачи этих данных на сервер.

// Принимает в себя тип передачи данных (type) и сами данные (data).

// Type может иметь значения:
// 1. Get - для небольших запросов (нельзя пересылать пароли).
// 2. Post - для больших данных.

// Data должен быть объектом, например:
// {
//   name: Ivan,
//   id: 43,
//   type: type3
// }

// Возвращает преобразованные данные в виде строки, готовые к отправке на сервер;

// * * * = * * *
// End Description

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

	} else {

		console.error();
		return;

	}

};