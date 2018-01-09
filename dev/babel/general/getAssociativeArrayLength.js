// getAssociativeArrayLength - ver 1.0.0

// Description
// * * * = * * *

// Функция возвращающая длинну ассоциативного массива.

// Возвращает число.

// Принимает в себя ассоциативный массив.

// * * * = * * *
// End Description

export let getAssociativeArrayLength = function(array) {

  if (array && typeof array === "object") {

    let length = 0;

    for (let i in array) {

      length++;

    }

    return length;

  }

};