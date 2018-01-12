// getAssociativeArrayLength - ver 1.0.0

export let getAssociativeArrayLength = function(associativeArray) {

  if (associativeArray && typeof associativeArray === "object" && !Array.isArray(associativeArray)) {

    let length = 0;

    for (let i in associativeArray) {

      length++;

    }

    return length;

  }

};