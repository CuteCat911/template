// scrollTo - ver 1.0.1

import {getWindowScroll, getDocumentHeight} from "./window-scroll";

export let scrollTo = function(params) {

  if (params.position <= 0 || params.position >= 0) {

    let info = {
      position: params.position,
      fps: (params.fps > 0) ? params.fps : 60,
      speed: (params.speed > 0) ? params.speed : 1.5,
      calibration: (!params.calibration && typeof params.calibration === "boolean") ? params.calibration : true,
      params: {
        startScroll: getWindowScroll(),
        mode: (getWindowScroll() < params.position) ? "bottom" : "top",
        documentHeight: getDocumentHeight(),
        windowHeight: window.innerHeight
      }
    };
    let $params = info.params;
    let calibration = function() {

      if (info.calibration) {

        let scroll = getWindowScroll();

        if (scroll != info.position) {

          window.scrollTo(0, info.position);

        }

      }

    };
    let scrollToPosition = function() {

      if ($params.mode && typeof $params.mode === "string") {

        setTimeout(function() {

          let idScroll = requestAnimationFrame(scrollToPosition);
          let scroll = getWindowScroll();

          if ($params.mode == "top") {

            window.scrollTo(0, scroll - 50 * info.speed);

            if (scroll <= info.position || scroll <= 0) {

              window.cancelAnimationFrame(idScroll);
              calibration();

            }

          } else if ($params.mode == "bottom") {

            window.scrollTo(0, scroll + 50 * info.speed);

            if (scroll >= info.position || scroll >= $params.documentHeight - $params.windowHeight) {

              window.cancelAnimationFrame(idScroll);
              calibration();

            }

          }

        }, 1000 / info.fps);

      }

    };

    scrollToPosition();

  }

};