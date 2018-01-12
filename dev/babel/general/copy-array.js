// copyArray - ver. 1.0.0

export let copyArray = function(array) {

  if (array && typeof Array.isArray(array) && array.length != 0) {

    let newArray = [];

    for (let item of array) {

      newArray.push(item);

    }

    return newArray;

  }

};