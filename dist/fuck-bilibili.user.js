// ==UserScript==
// @name       fuck-bilibili
// @namespace  lisonge
// @version    0.0.0
// @icon       https://www.bilibili.com/favicon.ico
// @match      https://space.bilibili.com/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.5.22/dist/vue.global.prod.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const name = "fuck-bilibili";
  const pkg = {
    name
  };
  const baseCss = ":host{--a: 1px}";
  var a;
  const d = (b) => (a = document.createElement("style"), a.append(b), a);
  const base = d(baseCss);
  const unoStyle = document.createElement("style");
  unoStyle.textContent = '*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}.inline-flex{display:inline-flex;}.cursor-pointer,[cursor-pointer=""]{cursor:pointer;}.text-xl,[text-xl=""]{font-size:1.25rem;line-height:1.75rem;}.text-blue-400,[text-blue-400=""]{--un-text-opacity:1;color:rgb(96 165 250 / var(--un-text-opacity)) /* #60a5fa */;}.hover\\:text-blue-600:hover{--un-text-opacity:1;color:rgb(37 99 235 / var(--un-text-opacity)) /* #2563eb */;}.transition-colors,[transition-colors=""]{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}';
  const attachStyle = (node) => {
    node.append(base.cloneNode(true), unoStyle.cloneNode(true));
  };
  const _sfc_main$1 = vue.defineComponent({
    __name: "ShadowTeleport",
    props: {
      to: { type: [String, Boolean, null, Function] },
      style: { type: [Boolean, null, String, Object, Array] }
    },
    setup(__props) {
      const props = __props;
      let alive = true;
      vue.onScopeDispose(() => alive = false);
      const target = vue.shallowRef();
      const applyStyleValue = (t, s, depth = 0) => {
        if (!s) {
          if (depth === 0) {
            t.style = "";
          }
        } else if (typeof s === "string") {
          t.style = s;
        } else if (s instanceof Array) {
          s.forEach((s2) => {
            applyStyleValue(t, s2, depth + 1);
          });
        } else {
          Object.entries(s).forEach(([name2, value]) => {
            Reflect.set(t.style, name2, value);
          });
        }
      };
      vue.watchEffect(() => {
        const t = target.value?.[1];
        if (!t) return;
        applyStyleValue(t, props.style);
      });
      const removeDom = () => {
        if (!target.value) return;
        const [t, c] = target.value;
        t.removeChild(c);
        target.value = void 0;
      };
      const addDom = (t) => {
        removeDom();
        const c = document.createElement("div");
        const shadowRoot2 = t.appendChild(c).attachShadow({ mode: "open" });
        attachStyle(shadowRoot2);
        target.value = [t, c, shadowRoot2];
      };
      const selector = () => {
        const v = props.to;
        let s = "";
        if (typeof v === "function") {
          s = v() || "";
        } else {
          s = v || "";
        }
        if (!s) return;
        if (s instanceof HTMLElement) return s;
        return document.querySelector(s) ?? void 0;
      };
      vue.onMounted(async () => {
        while (alive) {
          const t = selector();
          if (t && t !== target.value?.[0]) {
            addDom(t);
          } else if (!t) {
            removeDom();
          }
          await new Promise((r) => setTimeout(r, 1e3));
        }
      });
      vue.onUnmounted(removeDom);
      return (_ctx, _cache) => {
        return target.value ? (vue.openBlock(), vue.createBlock(vue.Teleport, {
          key: 0,
          to: target.value[2]
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 8, ["to"])) : vue.createCommentVNode("", true);
      };
    }
  });
  const _sfc_main = vue.defineComponent({
    __name: "App",
    setup(__props) {
      const obj2url = (url, query) => {
        const u = new URL(url, location.origin);
        Object.entries(query).forEach(([k, v]) => {
          if (v === void 0) return;
          u.searchParams.set(k, String(v));
        });
        return u.toString();
      };
      const obj2usp = (obj) => {
        const usp = new URLSearchParams();
        Object.entries(obj).forEach(([k, v]) => {
          if (v === void 0) return;
          usp.set(k, String(v));
        });
        return usp;
      };
      const getFans = async () => {
        return fetch(
          obj2url(
            "https://api.bilibili.com/x/relation/fans?pn=1&ps=24&gaia_source=main_web",
            {
              vmid: location.pathname.split("/")[1]
            }
          ),
          {
            credentials: "include"
          }
        ).then((r) => r.json()).then((r) => r.data?.list || []);
      };
      const removeFan = async (mid) => {
        await fetch(
          "https://api.bilibili.com/x/relation/modify?statistics=%7B%22appId%22:100,%22platform%22:5%7D&x-bili-device-req-json=%7B%22platform%22:%22web%22,%22device%22:%22pc%22,%22spmid%22:%22333.1387%22%7D",
          {
            credentials: "include",
            method: "POST",
            body: obj2usp({
              fid: mid,
              act: 7,
              re_src: 11,
              gaia_source: "web_main",
              spmid: "333.1387",
              extend_content: JSON.stringify({ entity: "user", entity_id: mid }),
              is_from_frontend_component: true,
              csrf: (await cookieStore.get("bili_jct"))?.value
            })
          }
        );
      };
      const handler = async () => {
        const users = await getFans();
        if (users.length === 0) {
          setTimeout(() => window.alert("没有粉丝了"));
          return;
        }
        for (const user of users) {
          await removeFan(user.mid);
        }
        await new Promise((r) => setTimeout(r, 500));
        location.reload();
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1, {
          to: ".fans-main-title",
          style: { "display": "inline-flex", "margin-left": "24px" }
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("div", {
              onClick: handler,
              "text-xl": "",
              "cursor-pointer": "",
              "transition-colors": "",
              "text-blue-400": "",
              class: "hover:text-blue-600"
            }, " 移除全部粉丝 ")
          ]),
          _: 1
        });
      };
    }
  });
  const container = document.body.appendChild(document.createElement("div"));
  container.classList.add(pkg.name);
  const shadowRoot = container.attachShadow({ mode: "open" });
  vue.createApp(_sfc_main).mount(shadowRoot.appendChild(document.createElement("div")));

})(Vue);