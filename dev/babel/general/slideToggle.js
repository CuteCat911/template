// slideToggle - ver. 1.0.0

export let slideToggle = function(elem, duration, durationType) {

  if (elem && typeof elem === "object") {

    let info = {
      sizes: {
        margin: {
          top: 0,
          bottom: 0
        },
        padding: {
          top: 0,
          bottom: 0
        },
        height: 0
      },
      params: {
        visibly: (getComputedStyle(elem).display == "none") ? false : true,
        duration: (duration && typeof duration === "number") ? duration : null,
        durationType: (durationType && typeof durationType === "string") ? durationType : null,
        transition: null
      }
    };
    let helpFuncs = {
      setTransition(duration, type) {

        if (duration && typeof duration === "number") {

          let $duration = 0;
          let seconds = duration / 1000;

          if (seconds >= 1) {

            $duration = seconds + "s";

          } else {

            $duration = duration + "ms";

          }

          if (type && typeof type === "string") {

            return "margin " + $duration + " " + type + ", padding " + $duration + " " + type + ", height " + $duration + " " + type; 

          } else {

            return "margin " + $duration + ", padding " + $duration + ", height " + $duration; 

          }

        }

      },
      getSizes() {

        for (let i in sizes) {

          if (i != "height") {

            for (let j in sizes[i]) {

              let name = i + j[0].toUpperCase() + j.slice(1);

              sizes[i][j] = parseFloat(getComputedStyle(elem)[name]);

            }

          } else if (i == "height") {

            sizes[i] = parseFloat(getComputedStyle(elem)[i]);

          }

        }

      },
      applySize(mode) {

        if (mode && typeof mode === "string") {

          for (let i in sizes) {

            if (i != "height") {

              for (let j in sizes[i]) {

                let name = i + j[0].toUpperCase() + j.slice(1);

                switch (mode) {
                  case "size":
                    elem.style[name] = sizes[i][j] + "px";
                    break;
                  case "zero":
                    elem.style[name] = 0;
                    break;
                  case "remove":
                    elem.style[name] = "";
                    break;
                }

              }

            } else if (i == "height") {

              switch (mode) {
                case "size":
                  elem.style[i] = sizes[i] + "px";
                  break;
                case "zero":
                  elem.style[i] = 0;
                  break;
                case "remove":
                  elem.style[i] = "";
                  break;
              }

            }

          }

        }

      },
      defaultStyle(mode) {

        if (mode && typeof mode === "string") {

          if (mode == "add") {

            elem.style.overflow = "hidden";
            elem.style.transition = params.transition;

          } else if (mode == "remove") {

            elem.style.overflow = "";
            elem.style.transition = "";

          }

        }

      },
      hide() {

        let helpFuncs = this;

        helpFuncs.applySize("size");
        helpFuncs.defaultStyle("add");

        setTimeout(function() {

          helpFuncs.applySize("zero");
          
          setTimeout(function() {

            elem.style.display = "none";
            helpFuncs.applySize("remove");
            helpFuncs.defaultStyle("remove");

          }, params.duration);

        }, 2);

      },
      show() {

        let helpFuncs = this;

        helpFuncs.applySize("zero");
        helpFuncs.defaultStyle("add");
        elem.style.display = "";

        setTimeout(function() {

          helpFuncs.applySize("size");

          setTimeout(function() {

            helpFuncs.applySize("remove");
            helpFuncs.defaultStyle("remove");

          }, duration);

        }, 2);

      }
    };
    let sizes = info.sizes;
    let params = info.params;

    params.transition = helpFuncs.setTransition(params.duration, params.durationType);

    if (params.visibly) {

      helpFuncs.getSizes();
      helpFuncs.hide();

    } else {

      helpFuncs.getSizes();

      if (isNaN(sizes.height)) {

        elem.style.display = "";
        helpFuncs.getSizes();
        elem.style.display = "none";

      }
    
      helpFuncs.show();

    }

  }

};