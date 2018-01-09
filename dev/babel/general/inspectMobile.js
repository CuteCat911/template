// inspectMobile - ver. 1.0.0

// Description
// * * * = * * *

// Функция для проверки на мобильного типа браузера;

// Возвращает true если браузер на мобильном устройстве или false если десктоп.

// * * * = * * *
// End Description

export let inspectMobile = function() {

	let mobile = false;
	let browser = navigator.userAgent;
	let mobileBrowsers = ["Android","iPhone","iPad","iPod","BlackBerry","Opera Mini","IEMobile"];

	for (let item of mobileBrowsers) {

		let regExp = new RegExp(item);

		if (regExp.test(browser)) {

			mobile = true;

		}

	}

	return mobile;

};