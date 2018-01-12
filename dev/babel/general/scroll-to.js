// scrollTo - ver 1.1.0

// export let scrollTo = function(params) {

//     if (typeof params.position === "number" && (params.position <= 0 || params.position >= 0)) {

//         let moduleInfo = {
//             position: params.position,
//             fps: 60,
//             speed: 1.5,
//             calibration: true,
//             options: {
//                 startScroll: getWindowScroll(),
//                 mode: null,
//                 documentHeight: null,
//                 windowHeight: null
//             }
//         };
//         let options = moduleInfo.options;
//         let setParams = function() {

//             for (let item of ["fps", "speed"]) {

//                 if (params[item] && typeof params[item] === "number") {

//                     moduleInfo[item] = Math.abs(params[item]);

//                 };

//             };

//             if (params.calibration == false) {

//                 moduleInfo.calibration = params.calibration;

//             };

//         };
//         let setMode = function() {

//             if (options.startScroll < moduleInfo.position) {

//                 options.mode = "bottom";
//                 options.documentHeight = getScrollHeight();
//                 options.windowHeight = window.innerHeight;

//             } else if (options.startScroll > moduleInfo.position) {

//                 options.mode = "top";

//             };

//         };
//         let calibration = function() {

//             if (moduleInfo.calibration == true) {

//                 let scroll = getWindowScroll();

//                 if (scroll != moduleInfo.position) {

//                     window.scrollTo(0, moduleInfo.position);

//                 };

//             };

//         };
//         let scrollToPosition = function() {

//             let mode = options.mode;

//             if (mode && typeof mode === "string") {

//                 setTimeout(function() {

//                     let idScroll = requestAnimationFrame(scrollToPosition);
//                     let scroll = getWindowScroll();

//                     if (mode == "top") {

//                         window.scrollTo(0, scroll - 50 * moduleInfo.speed);

//                         if (scroll <= moduleInfo.position || scroll <= 0) {

//                             window.cancelAnimationFrame(idScroll);
//                             calibration();

//                         };

//                     } else if (mode == "bottom") {

//                         window.scrollTo(0, scroll + 50 * moduleInfo.speed);

//                         if (scroll >= moduleInfo.position || scroll >= options.documentHeight - options.windowHeight) {

//                             window.cancelAnimationFrame(idScroll);
//                             calibration();

//                         };

//                     };

//                 }, 1000 / moduleInfo.fps);

//             };

//         };

//         setParams();
//         setMode();
//         scrollToPosition();

//     };

// };