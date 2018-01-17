// debounce - ver. 1.0.0

let state = null;
const FROZE = 1;

export let debounce = function(func, time = 300) {

  if (func && typeof func === "function") {

    if (state) {

      return;

    }

    func.apply(this, arguments);
    state = FROZE;

    setTimeout(function() {

      state = null;

    }, time);

  }

};