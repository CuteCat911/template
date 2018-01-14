// global ver. 1.0.1

// getWindowScroll - ver. 1.0.0

export let getWindowScroll = function() {

  let scroll = window.pageYOffset || document.documentElement.scrollTop;

  return scroll;

};

// getScrollHeight - ver 1.0.1

export let getDocumentHeight = function() {

  let height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);

  return height;

};

// WindowScroll - ver. 1.0.0

import {debounce} from "./debounce";

let eventArray = [];

export let windowScroll = function(funcs) {

	if (funcs && typeof funcs === "function") {

		eventArray.push(funcs);

	} else if (funcs && Array.isArray(funcs)) {

    for (let func of funcs) {

      if (typeof item === "function") {

        eventArray.push(func);

      }

    }

  }

};
let applyFunc = function() {

  for (let event of eventArray) {

    event();

  }

};
let clearBody = function() {

  setTimeout(function() {

    if (getComputedStyle(document.body).pointerEvents == "none") {

      document.body.style.pointerEvents = "";

    }

  }, 350);

};

window.addEventListener("scroll", function() {

  if (getComputedStyle(document.body).pointerEvents != "none") {

    document.body.style.pointerEvents = "none";

  }

  applyFunc();
  return debounce(clearBody);

});

document.addEventListener("click", function() {

  if (getComputedStyle(document.body).pointerEvents == "none") {

    document.body.style.pointerEvents = "";

  }

});