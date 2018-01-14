// LazyImgs - ver 1.0.1

import {findElemsClass} from "./find";
import {loader} from "./loader";
import {applyClasses} from "./apply-classes";
import {windowScroll} from "./window-scroll";
import {getXmlHttp} from "./ajax";

export let LazyImgs = class {

  constructor(params) {

    if (params.imgs && typeof params.imgs === "string") {

      let $module = this;

      this.info = {
        imgs: {
          class: params.imgs,
          elems: findElemsClass(params.imgs, document),
          info: {}
        },
        params: {
          windowHeight: null
        },
        options: {
          indent: (params.indent <= 0 || params.indent >= 0) ? params.indent : 0,
          preloader: {
            active: (params.preloader && typeof params.preloader === "boolean") ? params.preloader : false,
            type: (params.preloaderType && typeof params.preloader === "string") ? params.preloaderType : null,
            classes: {
              block: (params.preloaderType == "custom" && (params.preloaderBlock && typeof params.preloaderBlock === "string")) ? params.preloaderBlock : null,
              indicator: (params.preloaderType == "custom" && (params.preloaderIndicator && typeof params.preloaderIndicator === "string")) ? params.preloaderIndicator : null
            },
            el: (params.preloaderType == "element" && (params.preloaderElement && typeof params.preloaderElement === "object")) ? params.preloaderElement : null
          }
        }
      };
      this.dataAttrs = {
        styleImg: "data-style-img",
        img: "data-img",
        alt: "data-alt",
        picture: {
          active: "data-picture",
          rules: "data-picture-rules"
        }
      };
      this.helpFuncs = {
        scroll() {
          $module.__scroll();
        },
        load(url) {

          if (url && typeof url === "string") {

            return new Promise(function(resolve, reject) {

              let request = getXmlHttp();

              request.open("GET", url);
              request.onload = function() {

                if (request.status == 200) {

                  resolve();

                } else {

                  reject();

                }

              };
              request.onerror = function() {
                reject();
              };
              request.send(null);

            });

          }

        }
      };

      let $helpFuncs = this.helpFuncs;

      this.__createPreloader();
      this.__getInfoImgs();
      windowScroll($helpFuncs.scroll);

    }

  }

  findImgs() {

    if (this.info) {

      let imgs = this.info.imgs;

      imgs.elems = findElemsClass(imgs.class, document);
      this.__getInfoImgs();

    }

  }

  __createPreloader() {

    let $preloader = this.info.params.preloader;

    if ($preloader.active) {

      if ($preloader.type != "element") {

        $preloader.el = loader.create("local", {
          blockClasses: [$preloader.classes.block],
          indicatorClasses: [$preloader.classes.indicator]
        });

      }

    }

  }

  __addPreloader(img) {

    let $preloader = this.info.options.preloader;

    if ((img && typeof img === "object") && $preloader.active) {

      img.appendChild($preloader.el);

    }

  }

  __getInfoImgs() {

    let $imgs = this.info.imgs;
    let $imgsInfo = $imgs.info;
    let $dataAttrs = this.dataAttrs;

    if ($imgs.elems) {

      for (let i in $imgs.elems) {

        let $img = $imgs.elems[i];

        $imgsInfo[i] = {
          block: $img,
          img: {
            el: null,
            tag: null,
            type: null,
            classes: []
          },
          params: {
            top: null,
            height: null,
            load: false
          },
          options: {
            styleImg: ($img.getAttribute($dataAttrs.styleImg)) ? $img.getAttribute($dataAttrs.styleImg) : null,
            img: ($img.getAttribute($dataAttrs.img)) ? $img.getAttribute($dataAttrs.img) : null,
            alt: ($img.getAttribute($dataAttrs.alt)) ? $img.getAttribute($dataAttrs.alt) : null,
            picture: {
              active: ($img.getAttribute($dataAttrs.picture.active)) ? true : null,
              el: ($img.getAttribute($dataAttrs.picture.active)) ? document.createElement("picture") : null,
              sourses: {}
            }
          }
        };

        let img = $imgsInfo[i].img;
        let params = $imgsInfo[i].params;
        let options = $imgsInfo[i].options;
        let picture = options.picture;

        if (options.styleImg) {

          img.tag = "div";
          img.type = "style";

        } else if (options.img) {

          img.tag = "img";
          img.type = "img";

          if (picture.active) {

            if ($img.hasAttribute($dataAttrs.picture.rules)) {

              let rules = $img.getAttribute($dataAttrs.picture.rules).split("; ");

              if (rules) {

                for (let i in rules) {

                  let params = rules[i].split(" ? ");

                  picture.sourses[i] = {
                    el: document.createElement("source");
                  };

                  for (let param of params) {

                    let parts = param.split("=");
                    picture.sourses[i].el.setAttribute(parts[0], parts[1]);

                  }

                  picture.el.appendChild(picture.sourses[i].el);

                }

              }

            }

          }

        }

        for (let $class of $img.classList) {

          if ($class != $imgs.class) {

            img.classes.push($class);

          }

        }

        this.__addPreloader($img);
        img.el = document.createElement(img.tag);
        applyClasses(img.el, img.classes, "add");

      }

    }

  }

  __scroll() {

    let $imgs = this.info.imgs;
    let $params = this.info.params;
    let $options = this.info.options;

    if ($imgs.elems) {

      $params.windowHeight = window.innerHeight;

      for (let i in $imgs.info) {

        let $imgInfo = $imgs.info[i];

        $imgInfo.params.top = $imgInfo.block.getBoundingClientRect().top;
        $imgInfo.params.height = $imgInfo.block.offsetHeight;

        if (!$params.load && ($imgInfo.params.top - $params.windowHeight - $options.indent <= 0) && ($imgInfo.params.top + $imgInfo.params.height + $options.indent >= 0)) {

          this.__loadImg($imgsInfo);

        }

      }

    }

  }

  __loadImg(info) {

    if (info && typeof info === "object") {

      let $params = this.info.params;
      let $helpFuncs = this.helpFuncs;
      let img = info.img;
      let params = info.params;
      let options = info.options;
      let picture = options.picture;
      let url = options.styleImg || options.img;

      params.load = "loading";
      $helpFuncs.load(url).then(
        function() {

          let parent = info.block.parentNode;

          if (img.type == "style") {

            img.el.style.backgroundImage = "url(" + url + ");";

          } else if (img.type == "img") {

            img.el.setAttribute("src", url);
            img.el.setAttribute("alt", options.alt);

          }

          if (picture.active) {

            picture.el.appendChild(img.el);
            parent.replaceChild(picture.el, info.block);

          } else {

            parent.replaceChild(img.el, info.block);

          }

          params.load = true;

        },
        function() {

          params.load = "error";

        }
      );

    }

  }

};