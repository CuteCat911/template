export let copyArray = function(array) {

  if (array && typeof array === "object" && array.length != 0) {

    let newArray = [];

    for (let item of array) {

      newArray.push(item);

    }

    return newArray;

  }

};