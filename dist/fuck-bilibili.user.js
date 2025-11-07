// ==UserScript==
// @name       fuck-bilibili
// @namespace  lisonge
// @version    0.0.0
// @icon       https://www.bilibili.com/favicon.ico
// @match      https://space.bilibili.com/*
// ==/UserScript==

(function () {
  'use strict';
function makeMap(str) {
    const map = Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const YES = () => true;
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 &&
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 &&
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const extend = Object.assign;
  const remove$1 = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isReservedProp = makeMap(
",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
  };
  const camelizeRE = /-(\w)/g;
  const camelizeReplacer = (_, c) => c ? c.toUpperCase() : "";
  const camelize = cacheStringFunction(
    (str) => str.replace(camelizeRE, camelizeReplacer)
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function canSetValueDirectly(tagName) {
    return tagName !== "PROGRESS" &&
!tagName.includes("-");
  }
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name2 in value) {
        if (value[name2]) {
          res += name2 + " ";
        }
      }
    }
    return res.trim();
  }
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function shouldSetAsAttr(tagName, key) {
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return true;
    }
    if (key === "form") {
      return true;
    }
    if (key === "list" && tagName === "INPUT") {
      return true;
    }
    if (key === "type" && tagName === "TEXTAREA") {
      return true;
    }
    if ((key === "width" || key === "height") && (tagName === "IMG" || tagName === "VIDEO" || tagName === "CANVAS" || tagName === "SOURCE")) {
      return true;
    }
    if (key === "sandbox" && tagName === "IFRAME") {
      return true;
    }
    return false;
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    switch (typeof val) {
      case "string":
        return val;
      case "object":
        if (val) {
          if (isRef$1(val)) {
            return toDisplayString(val.value);
          } else if (isArray(val) || val.toString === objectToString || !isFunction(val.toString)) {
            return JSON.stringify(val, replacer, 2);
          }
        }
      default:
        return val == null ? "" : String(val);
    }
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (

isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  var ReactiveFlags$1 = ((ReactiveFlags2) => {
    ReactiveFlags2[ReactiveFlags2["None"] = 0] = "None";
    ReactiveFlags2[ReactiveFlags2["Mutable"] = 1] = "Mutable";
    ReactiveFlags2[ReactiveFlags2["Watching"] = 2] = "Watching";
    ReactiveFlags2[ReactiveFlags2["RecursedCheck"] = 4] = "RecursedCheck";
    ReactiveFlags2[ReactiveFlags2["Recursed"] = 8] = "Recursed";
    ReactiveFlags2[ReactiveFlags2["Dirty"] = 16] = "Dirty";
    ReactiveFlags2[ReactiveFlags2["Pending"] = 32] = "Pending";
    return ReactiveFlags2;
  })(ReactiveFlags$1 || {});
  const notifyBuffer = [];
  let activeSub = void 0;
  let globalVersion = 0;
  let notifyIndex = 0;
  let notifyBufferLength = 0;
  function setActiveSub(sub) {
    try {
      return activeSub;
    } finally {
      activeSub = sub;
    }
  }
  function link(dep, sub) {
    const prevDep = sub.depsTail;
    if (prevDep !== void 0 && prevDep.dep === dep) {
      return;
    }
    const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
    if (nextDep !== void 0 && nextDep.dep === dep) {
      nextDep.version = globalVersion;
      sub.depsTail = nextDep;
      return;
    }
    const prevSub = dep.subsTail;
    if (prevSub !== void 0 && prevSub.version === globalVersion && prevSub.sub === sub) {
      return;
    }
    const newLink = sub.depsTail = dep.subsTail = {
      version: globalVersion,
      dep,
      sub,
      prevDep,
      nextDep,
      prevSub,
      nextSub: void 0
    };
    if (nextDep !== void 0) {
      nextDep.prevDep = newLink;
    }
    if (prevDep !== void 0) {
      prevDep.nextDep = newLink;
    } else {
      sub.deps = newLink;
    }
    if (prevSub !== void 0) {
      prevSub.nextSub = newLink;
    } else {
      dep.subs = newLink;
    }
  }
  function unlink(link2, sub = link2.sub) {
    const dep = link2.dep;
    const prevDep = link2.prevDep;
    const nextDep = link2.nextDep;
    const nextSub = link2.nextSub;
    const prevSub = link2.prevSub;
    if (nextDep !== void 0) {
      nextDep.prevDep = prevDep;
    } else {
      sub.depsTail = prevDep;
    }
    if (prevDep !== void 0) {
      prevDep.nextDep = nextDep;
    } else {
      sub.deps = nextDep;
    }
    if (nextSub !== void 0) {
      nextSub.prevSub = prevSub;
    } else {
      dep.subsTail = prevSub;
    }
    if (prevSub !== void 0) {
      prevSub.nextSub = nextSub;
    } else if ((dep.subs = nextSub) === void 0) {
      let toRemove = dep.deps;
      if (toRemove !== void 0) {
        do {
          toRemove = unlink(toRemove, dep);
        } while (toRemove !== void 0);
        dep.flags |= 16;
      }
    }
    return nextDep;
  }
  function propagate(link2) {
    let next = link2.nextSub;
    let stack;
    top: do {
      const sub = link2.sub;
      let flags = sub.flags;
      if (flags & (1 | 2)) {
        if (!(flags & (4 | 8 | 16 | 32))) {
          sub.flags = flags | 32;
        } else if (!(flags & (4 | 8))) {
          flags = 0;
        } else if (!(flags & 4)) {
          sub.flags = flags & -9 | 32;
        } else if (!(flags & (16 | 32)) && isValidLink(link2, sub)) {
          sub.flags = flags | 8 | 32;
          flags &= 1;
        } else {
          flags = 0;
        }
        if (flags & 2) {
          notifyBuffer[notifyBufferLength++] = sub;
        }
        if (flags & 1) {
          const subSubs = sub.subs;
          if (subSubs !== void 0) {
            link2 = subSubs;
            if (subSubs.nextSub !== void 0) {
              stack = { value: next, prev: stack };
              next = link2.nextSub;
            }
            continue;
          }
        }
      }
      if ((link2 = next) !== void 0) {
        next = link2.nextSub;
        continue;
      }
      while (stack !== void 0) {
        link2 = stack.value;
        stack = stack.prev;
        if (link2 !== void 0) {
          next = link2.nextSub;
          continue top;
        }
      }
      break;
    } while (true);
  }
  function startTracking(sub) {
    ++globalVersion;
    sub.depsTail = void 0;
    sub.flags = sub.flags & -57 | 4;
    return setActiveSub(sub);
  }
  function endTracking(sub, prevSub) {
    activeSub = prevSub;
    const depsTail = sub.depsTail;
    let toRemove = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
    while (toRemove !== void 0) {
      toRemove = unlink(toRemove, sub);
    }
    sub.flags &= -5;
  }
  function flush() {
    while (notifyIndex < notifyBufferLength) {
      const effect2 = notifyBuffer[notifyIndex];
      notifyBuffer[notifyIndex++] = void 0;
      effect2.notify();
    }
    notifyIndex = 0;
    notifyBufferLength = 0;
  }
  function checkDirty(link2, sub) {
    let stack;
    let checkDepth = 0;
    top: do {
      const dep = link2.dep;
      const depFlags = dep.flags;
      let dirty = false;
      if (sub.flags & 16) {
        dirty = true;
      } else if ((depFlags & (1 | 16)) === (1 | 16)) {
        if (dep.update()) {
          const subs = dep.subs;
          if (subs.nextSub !== void 0) {
            shallowPropagate(subs);
          }
          dirty = true;
        }
      } else if ((depFlags & (1 | 32)) === (1 | 32)) {
        if (link2.nextSub !== void 0 || link2.prevSub !== void 0) {
          stack = { value: link2, prev: stack };
        }
        link2 = dep.deps;
        sub = dep;
        ++checkDepth;
        continue;
      }
      if (!dirty && link2.nextDep !== void 0) {
        link2 = link2.nextDep;
        continue;
      }
      while (checkDepth) {
        --checkDepth;
        const firstSub = sub.subs;
        const hasMultipleSubs = firstSub.nextSub !== void 0;
        if (hasMultipleSubs) {
          link2 = stack.value;
          stack = stack.prev;
        } else {
          link2 = firstSub;
        }
        if (dirty) {
          if (sub.update()) {
            if (hasMultipleSubs) {
              shallowPropagate(firstSub);
            }
            sub = link2.sub;
            continue;
          }
        } else {
          sub.flags &= -33;
        }
        sub = link2.sub;
        if (link2.nextDep !== void 0) {
          link2 = link2.nextDep;
          continue top;
        }
        dirty = false;
      }
      return dirty;
    } while (true);
  }
  function shallowPropagate(link2) {
    do {
      const sub = link2.sub;
      const nextSub = link2.nextSub;
      const subFlags = sub.flags;
      if ((subFlags & (32 | 16)) === 32) {
        sub.flags = subFlags | 16;
      }
      link2 = nextSub;
    } while (link2 !== void 0);
  }
  function isValidLink(checkLink, sub) {
    let link2 = sub.depsTail;
    while (link2 !== void 0) {
      if (link2 === checkLink) {
        return true;
      }
      link2 = link2.prevDep;
    }
    return false;
  }
  new Set(
Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  function shallowRef(value) {
    return createRef(value);
  }
  function createRef(rawValue, wrap) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, wrap);
  }
  class RefImpl {
constructor(value, wrap) {
      this.subs = void 0;
      this.subsTail = void 0;
      this.flags = ReactiveFlags$1.Mutable;
      this.__v_isRef = true;
      this.__v_isShallow = false;
      this._oldValue = this._rawValue = wrap ? toRaw(value) : value;
      this._value = wrap ? wrap(value) : value;
      this._wrap = wrap;
      this["__v_isShallow"] = !wrap;
    }
    get dep() {
      return this;
    }
    get value() {
      trackRef(this);
      if (this.flags & ReactiveFlags$1.Dirty && this.update()) {
        const subs = this.subs;
        if (subs !== void 0) {
          shallowPropagate(subs);
        }
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || isShallow(newValue) || isReadonly(newValue);
      newValue = useDirectValue ? newValue : toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this.flags |= ReactiveFlags$1.Dirty;
        this._rawValue = newValue;
        this._value = !useDirectValue && this._wrap ? this._wrap(newValue) : newValue;
        const subs = this.subs;
        if (subs !== void 0) {
          propagate(subs);
          {
            flush();
          }
        }
      }
    }
    update() {
      this.flags &= ~ReactiveFlags$1.Dirty;
      return hasChanged(this._oldValue, this._oldValue = this._rawValue);
    }
  }
  function triggerRef(ref2) {
    const dep = ref2.dep;
    if (dep !== void 0 && dep.subs !== void 0) {
      propagate(dep.subs);
      shallowPropagate(dep.subs);
      {
        flush();
      }
    }
  }
  function trackRef(dep) {
    if (activeSub !== void 0) {
      link(dep, activeSub);
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  class CustomRefImpl {
    constructor(factory) {
      this.subs = void 0;
      this.subsTail = void 0;
      this.flags = ReactiveFlags$1.None;
      this["__v_isRef"] = true;
      this._value = void 0;
      const { get, set } = factory(
        () => trackRef(this),
        () => triggerRef(this)
      );
      this._get = get;
      this._set = set;
    }
    get dep() {
      return this;
    }
    get value() {
      return this._value = this._get();
    }
    set value(newVal) {
      this._set(newVal);
    }
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  class ReactiveEffect {
    constructor(fn) {
      this.deps = void 0;
      this.depsTail = void 0;
      this.subs = void 0;
      this.subsTail = void 0;
      this.flags = ReactiveFlags$1.Watching | ReactiveFlags$1.Dirty;
      this.cleanups = [];
      this.cleanupsLength = 0;
      if (fn !== void 0) {
        this.fn = fn;
      }
      if (activeEffectScope) {
        link(this, activeEffectScope);
      }
    }
fn() {
    }
    get active() {
      return !(this.flags & 1024);
    }
    pause() {
      this.flags |= 256;
    }
    resume() {
      const flags = this.flags &= -257;
      if (flags & (ReactiveFlags$1.Dirty | ReactiveFlags$1.Pending)) {
        this.notify();
      }
    }
    notify() {
      if (!(this.flags & 256) && this.dirty) {
        this.run();
      }
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      cleanup(this);
      const prevSub = startTracking(this);
      try {
        return this.fn();
      } finally {
        endTracking(this, prevSub);
        const flags = this.flags;
        if ((flags & (ReactiveFlags$1.Recursed | 128)) === (ReactiveFlags$1.Recursed | 128)) {
          this.flags = flags & ~ReactiveFlags$1.Recursed;
          this.notify();
        }
      }
    }
    stop() {
      if (!this.active) {
        return;
      }
      this.flags = 1024;
      let dep = this.deps;
      while (dep !== void 0) {
        dep = unlink(dep, this);
      }
      const sub = this.subs;
      if (sub !== void 0) {
        unlink(sub);
      }
      cleanup(this);
    }
    get dirty() {
      const flags = this.flags;
      if (flags & ReactiveFlags$1.Dirty) {
        return true;
      }
      if (flags & ReactiveFlags$1.Pending) {
        if (checkDirty(this.deps, this)) {
          this.flags = flags | ReactiveFlags$1.Dirty;
          return true;
        } else {
          this.flags = flags & ~ReactiveFlags$1.Pending;
        }
      }
      return false;
    }
  }
  const resetTrackingStack = [];
  function pauseTracking() {
    resetTrackingStack.push(activeSub);
    setActiveSub();
  }
  function resetTracking() {
    if (resetTrackingStack.length) {
      setActiveSub(resetTrackingStack.pop());
    } else {
      setActiveSub();
    }
  }
  function cleanup(sub) {
    const l = sub.cleanupsLength;
    if (l) {
      for (let i = 0; i < l; i++) {
        sub.cleanups[i]();
      }
      sub.cleanupsLength = 0;
    }
  }
  function onEffectCleanup(fn, failSilently = false) {
    if (activeSub instanceof ReactiveEffect) {
      activeSub.cleanups[activeSub.cleanupsLength++] = () => cleanupEffect(fn);
    }
  }
  function cleanupEffect(fn) {
    const prevSub = setActiveSub();
    try {
      fn();
    } finally {
      setActiveSub(prevSub);
    }
  }
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.deps = void 0;
      this.depsTail = void 0;
      this.subs = void 0;
      this.subsTail = void 0;
      this.flags = 0;
      this.cleanups = [];
      this.cleanupsLength = 0;
      if (!detached && activeEffectScope) {
        link(this, activeEffectScope);
      }
    }
    get active() {
      return !(this.flags & 1024);
    }
    pause() {
      if (!(this.flags & 256)) {
        this.flags |= 256;
        for (let link2 = this.deps; link2 !== void 0; link2 = link2.nextDep) {
          const dep = link2.dep;
          if ("pause" in dep) {
            dep.pause();
          }
        }
      }
    }
resume() {
      const flags = this.flags;
      if (flags & 256) {
        this.flags = flags & -257;
        for (let link2 = this.deps; link2 !== void 0; link2 = link2.nextDep) {
          const dep = link2.dep;
          if ("resume" in dep) {
            dep.resume();
          }
        }
      }
    }
    run(fn) {
      const prevScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = prevScope;
      }
    }
    stop() {
      if (!this.active) {
        return;
      }
      this.flags = 1024;
      let dep = this.deps;
      while (dep !== void 0) {
        const node = dep.dep;
        if ("stop" in node) {
          dep = dep.nextDep;
          node.stop();
        } else {
          dep = unlink(dep, this);
        }
      }
      const sub = this.subs;
      if (sub !== void 0) {
        unlink(sub);
      }
      cleanup(this);
    }
  }
  function setCurrentScope(scope) {
    try {
      return activeEffectScope;
    } finally {
      activeEffectScope = scope;
    }
  }
  function onScopeDispose(fn, failSilently = false) {
    if (activeEffectScope !== void 0) {
      activeEffectScope.cleanups[activeEffectScope.cleanupsLength++] = fn;
    }
  }
  class ComputedRefImpl {
    constructor(fn, setter) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.subs = void 0;
      this.subsTail = void 0;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = ReactiveFlags$1.Mutable | ReactiveFlags$1.Dirty;
      this.__v_isRef = true;
      this["__v_isReadonly"] = !setter;
    }

get effect() {
      return this;
    }
get dep() {
      return this;
    }
get _dirty() {
      const flags = this.flags;
      if (flags & ReactiveFlags$1.Dirty) {
        return true;
      }
      if (flags & ReactiveFlags$1.Pending) {
        if (checkDirty(this.deps, this)) {
          this.flags = flags | ReactiveFlags$1.Dirty;
          return true;
        } else {
          this.flags = flags & ~ReactiveFlags$1.Pending;
        }
      }
      return false;
    }
set _dirty(v) {
      if (v) {
        this.flags |= ReactiveFlags$1.Dirty;
      } else {
        this.flags &= ~(ReactiveFlags$1.Dirty | ReactiveFlags$1.Pending);
      }
    }
    get value() {
      const flags = this.flags;
      if (flags & ReactiveFlags$1.Dirty || flags & ReactiveFlags$1.Pending && checkDirty(this.deps, this)) {
        if (this.update()) {
          const subs = this.subs;
          if (subs !== void 0) {
            shallowPropagate(subs);
          }
        }
      } else if (flags & ReactiveFlags$1.Pending) {
        this.flags = flags & ~ReactiveFlags$1.Pending;
      }
      if (activeSub !== void 0) {
        link(this, activeSub);
      } else if (activeEffectScope !== void 0) {
        link(this, activeEffectScope);
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      }
    }
    update() {
      const prevSub = startTracking(this);
      try {
        const oldValue = this._value;
        const newValue = this.fn(oldValue);
        if (hasChanged(oldValue, newValue)) {
          this._value = newValue;
          return true;
        }
        return false;
      } finally {
        endTracking(this, prevSub);
      }
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter);
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  let activeWatcher = void 0;
  function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
    if (owner) {
      const { call } = owner.options;
      if (call) {
        owner.cleanups[owner.cleanupsLength++] = () => call(cleanupFn, 4);
      } else {
        owner.cleanups[owner.cleanupsLength++] = cleanupFn;
      }
    }
  }
  class WatcherEffect extends ReactiveEffect {
    constructor(source, cb, options = EMPTY_OBJ) {
      const { deep, once, call, onWarn } = options;
      let getter;
      let forceTrigger = false;
      let isMultiSource = false;
      if (isRef(source)) {
        getter = () => source.value;
        forceTrigger = isShallow(source);
      } else if (isReactive(source)) {
        getter = () => reactiveGetter(source, deep);
        forceTrigger = true;
      } else if (isArray(source)) {
        isMultiSource = true;
        forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
        getter = () => source.map((s) => {
          if (isRef(s)) {
            return s.value;
          } else if (isReactive(s)) {
            return reactiveGetter(s, deep);
          } else if (isFunction(s)) {
            return call ? call(s, 2) : s();
          } else ;
        });
      } else if (isFunction(source)) {
        if (cb) {
          getter = call ? () => call(source, 2) : source;
        } else {
          getter = () => {
            if (this.cleanupsLength) {
              const prevSub = setActiveSub();
              try {
                cleanup(this);
              } finally {
                setActiveSub(prevSub);
              }
            }
            const currentEffect = activeWatcher;
            activeWatcher = this;
            try {
              return call ? call(source, 3, [
                this.boundCleanup
              ]) : source(this.boundCleanup);
            } finally {
              activeWatcher = currentEffect;
            }
          };
        }
      } else {
        getter = NOOP;
      }
      if (cb && deep) {
        const baseGetter = getter;
        const depth = deep === true ? Infinity : deep;
        getter = () => traverse(baseGetter(), depth);
      }
      super(getter);
      this.cb = cb;
      this.options = options;
      this.boundCleanup = (fn) => onWatcherCleanup(fn, false, this);
      this.forceTrigger = forceTrigger;
      this.isMultiSource = isMultiSource;
      if (once && cb) {
        const _cb = cb;
        cb = (...args) => {
          _cb(...args);
          this.stop();
        };
      }
      this.cb = cb;
      this.oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    }
    run(initialRun = false) {
      const oldValue = this.oldValue;
      const newValue = this.oldValue = super.run();
      if (!this.cb) {
        return;
      }
      const { immediate, deep, call } = this.options;
      if (initialRun && !immediate) {
        return;
      }
      if (deep || this.forceTrigger || (this.isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        cleanup(this);
        const currentWatcher = activeWatcher;
        activeWatcher = this;
        try {
          const args = [
            newValue,
oldValue === INITIAL_WATCHER_VALUE ? void 0 : this.isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            this.boundCleanup
          ];
          call ? call(this.cb, 3, args) : (
this.cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    }
  }
  function reactiveGetter(source, deep) {
    if (deep) return source;
    if (isShallow(source) || deep === false || deep === 0)
      return traverse(source, 1);
    return traverse(source);
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  function callWithErrorHandling(fn, instance, type, args) {
    try {
      return args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
      return values;
    }
  }
  function handleError(err, instance, type, throwInDev = true) {
    const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy || instance;
      const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      if (errorHandler) {
        const prevSub = setActiveSub();
        callWithErrorHandling(errorHandler, null, 10, [
          err,
          exposedInstance,
          errorInfo
        ]);
        setActiveSub(prevSub);
        return;
      }
    }
    logError(err, type, instance, throwInDev, throwUnhandledErrorInProduction);
  }
  function logError(err, type, instance, throwInDev = true, throwInProd = false) {
    if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  const jobs = [];
  let postJobs = [];
  let activePostJobs = null;
  let currentFlushPromise = null;
  let jobsLength = 0;
  let flushIndex = 0;
  let postFlushIndex = 0;
  const resolvedPromise = Promise.resolve();
  function findInsertionIndex(order, queue, start, end) {
    while (start < end) {
      const middle = start + end >>> 1;
      if (queue[middle].order <= order) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job, id, isPre = false) {
    if (queueJobWorker(
      job,
      id === void 0 ? isPre ? -2 : Infinity : isPre ? id * 2 : id * 2 + 1,
      jobs,
      jobsLength,
      flushIndex
    )) {
      jobsLength++;
      queueFlush();
    }
  }
  function queueJobWorker(job, order, queue, length, flushIndex2) {
    const flags = job.flags;
    if (!(flags & 1)) {
      job.flags = flags | 1;
      job.order = order;
      if (flushIndex2 === length ||
order >= queue[length - 1].order) {
        queue[length] = job;
      } else {
        queue.splice(findInsertionIndex(order, queue, flushIndex2, length), 0, job);
      }
      return true;
    }
    return false;
  }
  const doFlushJobs = () => {
    try {
      flushJobs();
    } catch (e) {
      currentFlushPromise = null;
      throw e;
    }
  };
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(doFlushJobs);
    }
  }
  function queuePostFlushCb(jobs2, id = Infinity) {
    if (!isArray(jobs2)) {
      if (activePostJobs && id === -1) {
        activePostJobs.splice(postFlushIndex, 0, jobs2);
      } else {
        queueJobWorker(jobs2, id, postJobs, postJobs.length, 0);
      }
    } else {
      for (const job of jobs2) {
        queueJobWorker(job, id, postJobs, postJobs.length, 0);
      }
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen) {
    for (let i = flushIndex; i < jobsLength; i++) {
      const cb = jobs[i];
      if (cb.order & 1 || cb.order === Infinity) {
        continue;
      }
      jobs.splice(i, 1);
      i--;
      jobsLength--;
      if (cb.flags & 2) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 2)) {
        cb.flags &= -2;
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (postJobs.length) {
      if (activePostJobs) {
        activePostJobs.push(...postJobs);
        postJobs.length = 0;
        return;
      }
      activePostJobs = postJobs;
      postJobs = [];
      while (postFlushIndex < activePostJobs.length) {
        const cb = activePostJobs[postFlushIndex++];
        if (cb.flags & 2) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 4)) {
          try {
            cb();
          } finally {
            cb.flags &= -2;
          }
        }
      }
      activePostJobs = null;
      postFlushIndex = 0;
    }
  }
  let isFlushing = false;
  function flushOnAppMount() {
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs();
      flushPostFlushCbs();
      isFlushing = false;
    }
  }
  function flushJobs(seen) {
    try {
      while (flushIndex < jobsLength) {
        const job = jobs[flushIndex];
        jobs[flushIndex++] = void 0;
        if (!(job.flags & 4)) {
          if (false) ;
          if (job.flags & 2) {
            job.flags &= ~1;
          }
          try {
            job();
          } catch (err) {
            handleError(
              err,
              job.i,
              job.i ? 15 : 14
            );
          } finally {
            if (!(job.flags & 2)) {
              job.flags &= ~1;
            }
          }
        }
      }
    } finally {
      while (flushIndex < jobsLength) {
        jobs[flushIndex].flags &= -2;
        jobs[flushIndex++] = void 0;
      }
      flushIndex = 0;
      jobsLength = 0;
      flushPostFlushCbs();
      currentFlushPromise = null;
      if (jobsLength || postJobs.length) {
        flushJobs();
      }
    }
  }
  let currentRenderingInstance = null;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        const target = select(targetSelector);
        return target;
      }
    } else {
      return targetSelector;
    }
  };
  const leaveCbKey = Symbol("_leaveCb");
  const enterCbKey$1 = Symbol("_enterCb");
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingNodes: new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  function baseResolveTransitionHooks(context, props, state, instance) {
    const {
      setLeavingNodeCache,
      unsetLeavingNodeCache,
      earlyRemove,
      cloneHooks
    } = context;
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1)) done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
);
        }
        earlyRemove();
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el[enterCbKey$1] = (cancelled) => {
          if (called) return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey$1] = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove2) {
        if (el[enterCbKey$1]) {
          el[enterCbKey$1](
            true
);
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        const done = el[leaveCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          remove2();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          unsetLeavingNodeCache(el);
        };
        setLeavingNodeCache(el);
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(node) {
        return cloneHooks(node);
      }
    };
    return hooks;
  }
  function createCanSetSetupRefChecker(setupState) {
    const rawSetupState = toRaw(setupState);
    return setupState === EMPTY_OBJ ? NO : (key) => {
      return hasOwn(rawSetupState, key);
    };
  }
  const allowMismatchAttr = "data-allow-mismatch";
  const MismatchTypeString = {
    [0]: "text",
    [1]: "children",
    [2]: "class",
    [3]: "style",
    [4]: "attribute"
  };
  function isMismatchAllowed(el, allowedType) {
    if (allowedType === 0 || allowedType === 1) {
      while (el && !el.hasAttribute(allowMismatchAttr)) {
        el = el.parentElement;
      }
    }
    const allowedAttr = el && el.getAttribute(allowMismatchAttr);
    if (allowedAttr == null) {
      return false;
    } else if (allowedAttr === "") {
      return true;
    } else {
      const list = allowedAttr.split(",");
      if (allowedType === 0 && list.includes("children")) {
        return true;
      }
      return list.includes(MismatchTypeString[allowedType]);
    }
  }
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        const prevSub = setActiveSub();
        const prev = setCurrentInstance(target);
        try {
          return callWithAsyncErrorHandling(hook, target, type, args);
        } finally {
          setCurrentInstance(...prev);
          setActiveSub(prevSub);
        }
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(mount, unmount, getPublicInstance2, render) {
    return function createApp(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else ;
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            }
          }
          return app;
        },
        component(name2, component) {
          if (!component) {
            return context.components[name2];
          }
          context.components[name2] = component;
          return app;
        },
        directive(name2, directive) {
          if (!directive) {
            return context.directives[name2];
          }
          context.directives[name2] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const instance = mount(app, rootContainer, isHydrate, namespace);
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            return getPublicInstance2(instance);
          }
        },
        onUnmount(cleanupFn) {
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            unmount(app);
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          const lastApp = currentApp;
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = lastApp;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentGenericInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.appContext && instance.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  function resolvePropValue(options, key, value, instance, resolveDefault2, isAbsent = false) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const cachedDefaults = instance.propsDefaults || (instance.propsDefaults = {});
          if (hasOwn(cachedDefaults, key)) {
            value = cachedDefaults[key];
          } else {
            value = cachedDefaults[key] = resolveDefault2(
              defaultValue,
              instance,
              key
            );
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function baseNormalizePropsOptions(raw, normalized, needCastKeys) {
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
] = shouldCast;
          prop[
            1
] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    }
    return false;
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function needTransition(parentSuspense, transition) {
    return transition && !transition.persisted;
  }
  function performTransitionEnter(el, transition, insert2, parentSuspense, force = false) {
    if (force || needTransition(parentSuspense, transition)) {
      transition.beforeEnter(el);
      insert2();
      queuePostRenderEffect(() => transition.enter(el), void 0, parentSuspense);
    } else {
      insert2();
    }
  }
  function performTransitionLeave(el, transition, remove2, isElement = true) {
    const performRemove = () => {
      remove2();
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (isElement && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  }
  function getInheritedScopeIds(vnode, parentComponent) {
    const inheritedScopeIds = [];
    let currentParent = parentComponent;
    let currentVNode = vnode;
    while (currentParent) {
      let subTree = currentParent.subTree;
      if (!subTree) break;
      if (currentVNode === subTree || isSuspense(subTree.type) && (subTree.ssContent === currentVNode || subTree.ssFallback === currentVNode)) {
        const parentVNode = currentParent.vnode;
        if (parentVNode.scopeId) {
          inheritedScopeIds.push(parentVNode.scopeId);
        }
        if (parentVNode.slotScopeIds) {
          inheritedScopeIds.push(...parentVNode.slotScopeIds);
        }
        currentVNode = parentVNode;
        currentParent = currentParent.parent;
      } else {
        break;
      }
    }
    return inheritedScopeIds;
  }
  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watchEffect(effect2, options) {
    return doWatch(effect2, null, options);
  }
  class RenderWatcherEffect extends WatcherEffect {
    constructor(instance, source, cb, options, flush2) {
      super(source, cb, options);
      this.flush = flush2;
      const job = () => {
        if (this.dirty) {
          this.run();
        }
      };
      if (cb) {
        this.flags |= 128;
        job.flags |= 2;
      }
      if (instance) {
        job.i = instance;
      }
      this.job = job;
    }
    notify() {
      const flags = this.flags;
      if (!(flags & 256)) {
        const flush2 = this.flush;
        const job = this.job;
        if (flush2 === "post") {
          queuePostRenderEffect(job, void 0, job.i ? job.i.suspense : null);
        } else if (flush2 === "pre") {
          queueJob(job, job.i ? job.i.uid : void 0, true);
        } else {
          job();
        }
      }
    }
  }
  function doWatch(source, cb, options = EMPTY_OBJ) {
    const { immediate, deep, flush: flush2 = "pre", once } = options;
    const baseWatchOptions = extend({}, options);
    const runsImmediately = flush2 !== "post";
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      if (flush2 === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else if (!runsImmediately) {
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    const effect2 = new RenderWatcherEffect(
      instance,
      source,
      cb,
      baseWatchOptions,
      flush2
    );
    if (flush2 === "post") {
      queuePostRenderEffect(effect2.job, void 0, instance && instance.suspense);
    } else {
      effect2.run(true);
    }
    const stop2 = effect2.stop.bind(effect2);
    stop2.pause = effect2.pause.bind(effect2);
    stop2.resume = effect2.resume.bind(effect2);
    stop2.stop = stop2;
    if (isInSSRComponentSetup) {
      if (ssrCleanup) {
        ssrCleanup.push(stop2);
      } else if (runsImmediately) {
        stop2();
      }
    }
    return stop2;
  }
  const getModelModifiers = (props, modelName, getter) => {
    return modelName === "modelValue" || modelName === "model-value" ? getter(props, "modelModifiers") : getter(props, `${modelName}Modifiers`) || getter(props, `${camelize(modelName)}Modifiers`) || getter(props, `${hyphenate(modelName)}Modifiers`);
  };
  function baseEmit(instance, props, getter, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7), getter);
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    let handlerName;
    let handler = getter(props, handlerName = toHandlerKey(event)) ||
getter(props, handlerName = toHandlerKey(camelize(event)));
    if (!handler && isModelListener2) {
      handler = getter(props, handlerName = toHandlerKey(hyphenate(event)));
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = getter(props, handlerName + `Once`);
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, id, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn, id);
    }
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  let currentInstance = null;
  const getCurrentGenericInstance = () => currentInstance || currentRenderingInstance;
  let isInSSRComponentSetup = false;
  let simpleSetCurrentInstance;
  {
    const g = getGlobalThis();
    const registerGlobalSetter = (key, setter) => {
      let setters;
      if (!(setters = g[key])) setters = g[key] = [];
      setters.push(setter);
      return (v) => {
        if (setters.length > 1) setters.forEach((set) => set(v));
        else setters[0](v);
      };
    };
    simpleSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance, scope = instance !== null ? instance.scope : void 0) => {
    try {
      return [currentInstance, setCurrentScope(scope)];
    } finally {
      simpleSetCurrentInstance(instance);
    }
  };
  let uid = 0;
  function nextUid() {
    return uid++;
  }
  function expose(instance, exposed) {
    instance.exposed = exposed || {};
  }
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  const computed = (getterOrOptions, debugOptions) => {
    return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  };
  const version = "3.6.0-alpha.3";
  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const vtcKey = Symbol("_vtc");
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const callHook = (hook, args = []) => {
    if (isArray(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name: name2 = "v",
      type,
      duration,
      enterFromClass = `${name2}-enter-from`,
      enterActiveClass = `${name2}-enter-active`,
      enterToClass = `${name2}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name2}-leave-from`,
      leaveActiveClass = `${name2}-leave-active`,
      leaveToClass = `${name2}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
    const finishEnter = (el, isAppear, done, isCancelled) => {
      el._enterCancelled = isCancelled;
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      el._isLeaving = false;
      removeTransitionClass(el, leaveFromClass);
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve = () => finishEnter(el, isAppear, done);
        callHook(hook, [el, resolve]);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        callHook(onBeforeEnter, [el]);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear(el) {
        callHook(onBeforeAppear, [el]);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        el._isLeaving = true;
        const resolve = () => finishLeave(el, done);
        addTransitionClass(el, leaveFromClass);
        if (!el._enterCancelled) {
          forceReflow(el);
          addTransitionClass(el, leaveActiveClass);
        } else {
          addTransitionClass(el, leaveActiveClass);
          forceReflow(el);
        }
        nextFrame(() => {
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
        });
        callHook(onLeave, [el, resolve]);
      },
      onEnterCancelled(el) {
        finishEnter(el, false, void 0, true);
        callHook(onEnterCancelled, [el]);
      },
      onAppearCancelled(el) {
        finishEnter(el, true, void 0, true);
        callHook(onAppearCancelled, [el]);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        callHook(onLeaveCancelled, [el]);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    return res;
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
    (el[vtcKey] || (el[vtcKey] = new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el[vtcKey] = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve();
      }
    };
    if (explicitTimeout != null) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d2, i) => toMs(d2) + toMs(delays[i])));
  }
  function toMs(s) {
    if (s === "auto") return 0;
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow(el) {
    const targetDocument = el ? el.ownerDocument : document;
    return targetDocument.body.offsetHeight;
  }
  const vShowOriginalDisplay = Symbol("_vod");
  const vShowHidden = Symbol("_vsh");
  const CSS_VAR_TEXT = Symbol("");
  const displayRE = /(?:^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle$1(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle$1(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle$1(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle$1(style, name2, rawVal) {
    if (isArray(rawVal)) {
      rawVal.forEach((v) => setStyle$1(style, name2, v));
    } else {
      const val = rawVal == null ? "" : String(rawVal);
      if (name2.startsWith("--")) {
        style.setProperty(name2, val);
      } else {
        const prefixed = autoPrefix(style, name2);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name2 = camelize(rawName);
    if (name2 !== "filter" && name2 in style) {
      return prefixCache[rawName] = name2;
    }
    name2 = capitalize(name2);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name2;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  function shouldSetAsProp(el, key, value, isSVG) {
    if (shouldSetAsAttr(el.tagName, key)) {
      return false;
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const moveCbKey = Symbol("_moveCb");
  const enterCbKey = Symbol("_enterCb");
  function callPendingCbs(el) {
    if (el[moveCbKey]) {
      el[moveCbKey]();
    }
    if (el[enterCbKey]) {
      el[enterCbKey]();
    }
  }
  function baseApplyTranslation(oldPos, newPos, el) {
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      const s = el.style;
      s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = "0s";
      return true;
    }
    return false;
  }
  function hasCSSTransform(el, root, moveClass) {
    const clone = el.cloneNode();
    const _vtc = el[vtcKey];
    if (_vtc) {
      _vtc.forEach((cls) => {
        cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
      });
    }
    moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
    clone.style.display = "none";
    const container2 = root.nodeType === 1 ? root : root.parentNode;
    container2.appendChild(clone);
    const { hasTransform } = getTransitionInfo(clone);
    container2.removeChild(clone);
    return hasTransform;
  }
  const handleMovedChildren = (el, moveClass) => {
    const style = el.style;
    addTransitionClass(el, moveClass);
    style.transform = style.webkitTransform = style.transitionDuration = "";
    const cb = el[moveCbKey] = (e) => {
      if (e && e.target !== el) {
        return;
      }
      if (!e || e.propertyName.endsWith("transform")) {
        el.removeEventListener("transitionend", cb);
        el[moveCbKey] = null;
        removeTransitionClass(el, moveClass);
      }
    };
    el.addEventListener("transitionend", cb);
  };
  function normalizeContainer(container2) {
    if (isString(container2)) {
      const res = document.querySelector(container2);
      return res;
    }
    return container2;
  }
  let insertionParent;
  let insertionAnchor;
  let isLastInsertion;
  function setInsertionState(parent, anchor, last) {
    insertionParent = parent;
    isLastInsertion = last;
    {
      if (isHydrating) {
        insertionAnchor = anchor;
      } else {
        insertionAnchor = anchor;
        if (!parent.$fc) {
          parent.$fc = parent.firstChild;
        }
      }
    }
  }
  function resetInsertionState() {
    insertionParent = insertionAnchor = isLastInsertion = void 0;
  }
  const isHydratingStack = [];
  let isHydrating = false;
  let currentHydrationNode = null;
  function pushIsHydrating(value) {
    isHydratingStack.push(isHydrating = value);
  }
  function popIsHydrating() {
    isHydratingStack.pop();
    isHydrating = isHydratingStack[isHydratingStack.length - 1] || false;
  }
  function runWithoutHydration(fn) {
    try {
      pushIsHydrating(false);
      return fn();
    } finally {
      popIsHydrating();
    }
  }
  let adoptTemplate;
  let locateHydrationNode;
  const isComment = (node, data) => node.nodeType === 8 && node.data === data;
  function setCurrentHydrationNode(node) {
    currentHydrationNode = node;
  }
  function locateNextSiblingOfParent(n) {
    if (!n.parentNode) return null;
    return n.parentNode.nextSibling || locateNextSiblingOfParent(n.parentNode);
  }
  function advanceHydrationNode(node) {
    const ret = node.nextSibling ||
node.$pns || (node.$pns = locateNextSiblingOfParent(node));
    if (ret) setCurrentHydrationNode(ret);
  }
  function locateEndAnchor(node, open = "[", close = "]") {
    if (node.$fe) {
      return node.$fe;
    }
    const stack = [node];
    while ((node = node.nextSibling) && stack.length > 0) {
      if (node.nodeType === 8) {
        if (node.data === open) {
          stack.push(node);
        } else if (node.data === close) {
          const matchingOpen = stack.pop();
          matchingOpen.$fe = node;
          if (stack.length === 0) return node;
        }
      }
    }
    return null;
  }
  function locateFragmentEndAnchor(label = "]") {
    let node = currentHydrationNode;
    while (node) {
      if (isComment(node, label)) return node;
      node = node.nextSibling;
    }
    return null;
  }
  let hasLoggedMismatchError = false;
  const logMismatchError = () => {
    if (hasLoggedMismatchError) {
      return;
    }
    console.error("Hydration completed but contains mismatches.");
    hasLoggedMismatchError = true;
  };
function createElement(tagName) {
    return document.createElement(tagName);
  }
function createTextNode(value = "") {
    return document.createTextNode(value);
  }
function querySelector(selectors) {
    return document.querySelector(selectors);
  }
  const _txt = _child;
function _child(node) {
    return node.firstChild;
  }
function _next(node) {
    return node.nextSibling;
  }
  const txt = (...args) => {
    return txt.impl(...args);
  };
  txt.impl = _txt;
  const child = (...args) => {
    return child.impl(...args);
  };
  child.impl = _child;
  class RenderEffect extends ReactiveEffect {
    constructor(render) {
      super();
      this.render = render;
      const instance = currentInstance;
      const job = () => {
        if (this.dirty) {
          this.run();
        }
      };
      this.updateJob = () => {
        instance.isUpdating = false;
        instance.u && invokeArrayFns(instance.u);
      };
      if (instance) {
        job.i = instance;
      }
      this.job = job;
      this.i = instance;
    }
    fn() {
      const instance = this.i;
      const scope = this.subs ? this.subs.sub : void 0;
      const hasUpdateHooks = instance && (instance.bu || instance.u);
      const prev = setCurrentInstance(instance, scope);
      if (hasUpdateHooks && instance.isMounted && !instance.isUpdating) {
        instance.isUpdating = true;
        instance.bu && invokeArrayFns(instance.bu);
        this.render();
        queuePostFlushCb(this.updateJob);
      } else {
        this.render();
      }
      setCurrentInstance(...prev);
    }
    notify() {
      const flags = this.flags;
      if (!(flags & 256)) {
        queueJob(this.job, this.i ? this.i.uid : void 0);
      }
    }
  }
  function renderEffect(fn, noLifecycle = false) {
    const effect = new RenderEffect(fn);
    if (noLifecycle) {
      effect.fn = fn;
    }
    effect.run();
  }
  const displayName = "VaporTransition";
  const getTransitionHooksContext = (key, props, state, instance, postClone) => {
    const { leavingNodes } = state;
    const context = {
      setLeavingNodeCache: (el) => {
        leavingNodes.set(key, el);
      },
      unsetLeavingNodeCache: (el) => {
        const leavingNode = leavingNodes.get(key);
        if (leavingNode === el) {
          leavingNodes.delete(key);
        }
      },
      earlyRemove: () => {
        const leavingNode = leavingNodes.get(key);
        if (leavingNode && leavingNode[leaveCbKey]) {
          leavingNode[leaveCbKey]();
        }
      },
      cloneHooks: (block) => {
        const hooks = resolveTransitionHooks(
          block,
          props,
          state,
          instance,
          postClone
        );
        if (postClone) postClone(hooks);
        return hooks;
      }
    };
    return context;
  };
  function resolveTransitionHooks(block, props, state, instance, postClone) {
    const context = getTransitionHooksContext(
      String(block.$key),
      props,
      state,
      instance,
      postClone
    );
    const hooks = baseResolveTransitionHooks(
      context,
      props,
      state,
      instance
    );
    hooks.state = state;
    hooks.props = props;
    hooks.instance = instance;
    return hooks;
  }
  function applyTransitionHooks(block, hooks, fallthroughAttrs = true, isResolved = false) {
    if (isArray(block)) {
      block = block.filter((b) => !(b instanceof Comment));
      if (block.length === 1) {
        block = block[0];
      } else if (block.length === 0) {
        return hooks;
      }
    }
    const isFrag = isFragment(block);
    const child2 = isResolved ? block : findTransitionBlock(block, isFrag);
    if (!child2) {
      if (isFrag) setTransitionHooksOnFragment(block, hooks);
      return hooks;
    }
    const { props, instance, state, delayedLeave } = hooks;
    let resolvedHooks = resolveTransitionHooks(
      child2,
      props,
      state,
      instance,
      (hooks2) => resolvedHooks = hooks2
    );
    resolvedHooks.delayedLeave = delayedLeave;
    child2.$transition = resolvedHooks;
    if (isFrag) setTransitionHooksOnFragment(block, resolvedHooks);
    if (fallthroughAttrs && instance.hasFallthrough) {
      child2.$root = true;
      applyFallthroughProps(child2, instance.attrs);
    }
    return resolvedHooks;
  }
  function applyTransitionLeaveHooks(block, enterHooks, afterLeaveCb) {
    const leavingBlock = findTransitionBlock(block);
    if (!leavingBlock) return void 0;
    const { props, state, instance } = enterHooks;
    const leavingHooks = resolveTransitionHooks(
      leavingBlock,
      props,
      state,
      instance
    );
    leavingBlock.$transition = leavingHooks;
    const { mode } = props;
    if (mode === "out-in") {
      state.isLeaving = true;
      leavingHooks.afterLeave = () => {
        state.isLeaving = false;
        afterLeaveCb();
        leavingBlock.$transition = void 0;
        delete leavingHooks.afterLeave;
      };
    } else if (mode === "in-out") {
      leavingHooks.delayLeave = (block2, earlyRemove, delayedLeave) => {
        state.leavingNodes.set(String(leavingBlock.$key), leavingBlock);
        block2[leaveCbKey] = () => {
          earlyRemove();
          block2[leaveCbKey] = void 0;
          leavingBlock.$transition = void 0;
          delete enterHooks.delayedLeave;
        };
        enterHooks.delayedLeave = () => {
          delayedLeave();
          leavingBlock.$transition = void 0;
          delete enterHooks.delayedLeave;
        };
      };
    }
  }
  function findTransitionBlock(block, inFragment = false) {
    let child2;
    if (block instanceof Node) {
      if (block instanceof Element) child2 = block;
    } else if (isVaporComponent(block)) {
      if (isAsyncWrapper(block) && !block.type.__asyncResolved) {
        child2 = block;
      } else {
        if (getComponentName(block.type) === displayName) return void 0;
        child2 = findTransitionBlock(block.block, inFragment);
        if (child2 && child2.$key === void 0) child2.$key = block.uid;
      }
    } else if (isArray(block)) {
      for (const c of block) {
        if (c instanceof Comment) continue;
        if (isFragment(c)) inFragment = true;
        const item = findTransitionBlock(c, inFragment);
        child2 = item;
        break;
      }
    } else if (isFragment(block)) {
      inFragment = true;
      if (block.insert) {
        child2 = block;
      } else {
        child2 = findTransitionBlock(block.nodes, true);
      }
    }
    return child2;
  }
  function setTransitionHooksOnFragment(block, hooks) {
    if (isFragment(block)) {
      block.$transition = hooks;
    } else if (isArray(block)) {
      for (let i = 0; i < block.length; i++) {
        setTransitionHooksOnFragment(block[i], hooks);
      }
    }
  }
  function setTransitionHooks(block, hooks) {
    if (isVaporComponent(block)) {
      block = findTransitionBlock(block.block);
      if (!block) return;
    }
    block.$transition = hooks;
  }
  class VaporFragment {
    constructor(nodes) {
      this.vnode = null;
      this.nodes = nodes;
    }
  }
  class ForFragment extends VaporFragment {
    constructor(nodes) {
      super(nodes);
    }
  }
  class DynamicFragment extends VaporFragment {
    constructor(anchorLabel) {
      super([]);
      this.hydrate = (isEmpty = false) => {
        if (this.anchor) return;
        if (this.anchorLabel === "if") {
          if (isEmpty) {
            this.anchor = locateFragmentEndAnchor("");
            {
              return;
            }
          }
        } else if (this.anchorLabel === "slot") {
          if (isEmpty && isComment(currentHydrationNode, "")) {
            this.anchor = currentHydrationNode;
            return;
          }
          this.anchor = locateFragmentEndAnchor();
          {
            return;
          }
        }
        const { parentNode: parentNode2, nextNode } = findBlockNode(this.nodes);
        queuePostFlushCb(() => {
          parentNode2.insertBefore(
            this.anchor = createTextNode(),
            nextNode
          );
        });
      };
      if (isHydrating) {
        this.anchorLabel = anchorLabel;
        locateHydrationNode();
      } else {
        this.anchor = createTextNode();
      }
    }
    update(render, key = render) {
      if (key === this.current) {
        if (isHydrating) this.hydrate(true);
        return;
      }
      this.current = key;
      const prevSub = setActiveSub();
      const parent = isHydrating ? null : this.anchor.parentNode;
      const transition = this.$transition;
      const instance = currentInstance;
      this.inKeepAlive = isKeepAlive(instance);
      if (this.scope) {
        if (this.inKeepAlive) {
          instance.processFragment(this);
          if (!this.keptAliveScopes) this.keptAliveScopes = new Map();
          this.keptAliveScopes.set(this.current, this.scope);
        } else {
          this.scope.stop();
        }
        const mode = transition && transition.mode;
        if (mode) {
          applyTransitionLeaveHooks(
            this.nodes,
            transition,
            () => this.render(render, instance, transition, parent)
          );
          parent && remove(this.nodes, parent);
          if (mode === "out-in") {
            setActiveSub(prevSub);
            return;
          }
        } else {
          parent && remove(this.nodes, parent);
        }
      }
      this.render(render, instance, transition, parent);
      if (this.fallback) {
        const hasNestedFragment = isFragment(this.nodes);
        if (hasNestedFragment) {
          setFragmentFallback(this.nodes, this.fallback);
        }
        const invalidFragment = findInvalidFragment(this);
        if (invalidFragment) {
          parent && remove(this.nodes, parent);
          const scope = this.scope || (this.scope = new EffectScope());
          scope.run(() => {
            if (hasNestedFragment) {
              renderFragmentFallback(invalidFragment);
            } else {
              this.nodes = this.fallback() || [];
            }
          });
          parent && insert(this.nodes, parent, this.anchor);
        }
      }
      setActiveSub(prevSub);
      if (isHydrating) this.hydrate();
    }
    render(render, instance, transition, parent) {
      if (render) {
        const scope = this.inKeepAlive && this.keptAliveScopes ? this.keptAliveScopes.get(this.current) : void 0;
        if (scope) {
          this.scope = scope;
          this.keptAliveScopes.delete(this.current);
          this.scope.resume();
        } else {
          this.scope = new EffectScope();
        }
        this.nodes = this.scope.run(render) || [];
        if (this.inKeepAlive) {
          instance.cacheFragment(this);
        }
        if (transition) {
          this.$transition = applyTransitionHooks(this.nodes, transition);
        }
        if (parent) insert(this.nodes, parent, this.anchor);
      } else {
        this.scope = void 0;
        this.nodes = [];
      }
    }
  }
  function setFragmentFallback(fragment, fallback) {
    if (fragment.fallback) {
      const originalFallback = fragment.fallback;
      fragment.fallback = () => {
        const fallbackNodes = originalFallback();
        if (isValidBlock(fallbackNodes)) {
          return fallbackNodes;
        }
        return fallback();
      };
    } else {
      fragment.fallback = fallback;
    }
    if (isFragment(fragment.nodes)) {
      setFragmentFallback(fragment.nodes, fragment.fallback);
    }
  }
  function renderFragmentFallback(fragment) {
    if (fragment instanceof ForFragment) {
      fragment.nodes[0] = [fragment.fallback() || []];
    } else if (fragment instanceof DynamicFragment) {
      fragment.update(fragment.fallback);
    } else ;
  }
  function findInvalidFragment(fragment) {
    if (isValidBlock(fragment.nodes)) return null;
    return isFragment(fragment.nodes) ? findInvalidFragment(fragment.nodes) || fragment : fragment;
  }
  function isFragment(val) {
    return val instanceof VaporFragment;
  }
  let currentSlotScopeIds = null;
  function setCurrentSlotScopeIds(scopeIds) {
    const prev = currentSlotScopeIds;
    currentSlotScopeIds = scopeIds;
    return prev;
  }
  const dynamicSlotsProxyHandlers = {
    get: getSlot,
    has: (target, key) => !!getSlot(target, key),
    getOwnPropertyDescriptor(target, key) {
      const slot = getSlot(target, key);
      if (slot) {
        return {
          configurable: true,
          enumerable: true,
          value: slot
        };
      }
    },
    ownKeys(target) {
      let keys = Object.keys(target);
      const dynamicSources = target.$;
      if (dynamicSources) {
        keys = keys.filter((k) => k !== "$");
        for (const source of dynamicSources) {
          if (isFunction(source)) {
            const slot = source();
            if (isArray(slot)) {
              for (const s of slot) keys.push(String(s.name));
            } else {
              keys.push(String(slot.name));
            }
          } else {
            keys.push(...Object.keys(source));
          }
        }
      }
      return keys;
    },
    set: NO,
    deleteProperty: NO
  };
  function getSlot(target, key) {
    if (key === "$") return;
    const dynamicSources = target.$;
    if (dynamicSources) {
      let i = dynamicSources.length;
      let source;
      while (i--) {
        source = dynamicSources[i];
        if (isFunction(source)) {
          const slot = source();
          if (slot) {
            if (isArray(slot)) {
              for (const s of slot) {
                if (String(s.name) === key) return s.fn;
              }
            } else if (String(slot.name) === key) {
              return slot.fn;
            }
          }
        } else if (hasOwn(source, key)) {
          return source[key];
        }
      }
    }
    if (hasOwn(target, key)) {
      return target[key];
    }
  }
  function withVaporCtx(fn) {
    const instance = currentInstance;
    return (...args) => {
      const prev = setCurrentInstance(instance);
      try {
        return fn(...args);
      } finally {
        setCurrentInstance(...prev);
      }
    };
  }
  function createSlot(name2, rawProps, fallback, noSlotted) {
    const _insertionParent = insertionParent;
    const _insertionAnchor = insertionAnchor;
    const _isLastInsertion = isLastInsertion;
    if (!isHydrating) resetInsertionState();
    const instance = currentInstance;
    const rawSlots = instance.rawSlots;
    const slotProps = EMPTY_OBJ;
    let fragment;
    if (isRef(rawSlots._)) {
      if (isHydrating) locateHydrationNode();
      fragment = instance.appContext.vapor.vdomSlot(
        rawSlots._,
        name2,
        slotProps,
        instance,
        fallback
      );
    } else {
      fragment = isHydrating || false ? new DynamicFragment("slot") : new DynamicFragment();
      const isDynamicName = isFunction(name2);
      const slotScopeIds = [];
      {
        const scopeId = instance.type.__scopeId;
        if (scopeId) {
          slotScopeIds.push(`${scopeId}-s`);
        }
      }
      const renderSlot2 = () => {
        const slot = getSlot(rawSlots, isFunction(name2) ? name2() : name2);
        if (slot) {
          fragment.fallback = fallback;
          fragment.update(
            slot._bound || (slot._bound = () => {
              const prevSlotScopeIds = setCurrentSlotScopeIds(
                slotScopeIds.length > 0 ? slotScopeIds : null
              );
              try {
                return slot(slotProps);
              } finally {
                setCurrentSlotScopeIds(prevSlotScopeIds);
              }
            })
          );
        } else {
          fragment.update(fallback);
        }
      };
      if (isDynamicName || rawSlots.$) {
        renderEffect(renderSlot2);
      } else {
        renderSlot2();
      }
    }
    if (!isHydrating) {
      {
        const scopeId = instance.type.__scopeId;
        if (scopeId) {
          setScopeId(fragment, [`${scopeId}-s`]);
        }
      }
      if (_insertionParent) insert(fragment, _insertionParent, _insertionAnchor);
    } else {
      if (fragment.insert) {
        fragment.hydrate();
      }
      if (_isLastInsertion) {
        advanceHydrationNode(_insertionParent);
      }
    }
    return fragment;
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
    return () => el.removeEventListener(event, handler, options);
  }
  function on(el, event, handler, options = {}) {
    addEventListener(el, event, handler, options);
    if (options.effect) {
      onEffectCleanup(() => {
        el.removeEventListener(event, handler, options);
      });
    }
  }
  const delegatedEvents = Object.create(null);
  const delegateEvents = (...names) => {
    for (const name2 of names) {
      if (!delegatedEvents[name2]) {
        delegatedEvents[name2] = true;
        document.addEventListener(name2, delegatedEventHandler);
      }
    }
  };
  const delegatedEventHandler = (e) => {
    let node = e.composedPath && e.composedPath()[0] || e.target;
    if (e.target !== node) {
      Object.defineProperty(e, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    while (node !== null) {
      const handlers = node[`$evt${e.type}`];
      if (handlers) {
        if (isArray(handlers)) {
          for (const handler of handlers) {
            if (!node.disabled) {
              handler(e);
              if (e.cancelBubble) return;
            }
          }
        } else {
          handlers(e);
          if (e.cancelBubble) return;
        }
      }
      node = node.host && node.host !== node && node.host instanceof Node ? node.host : node.parentNode;
    }
  };
  const hasFallthroughKey = (key) => currentInstance.hasFallthrough && key in currentInstance.attrs;
  function setAttr(el, key, value) {
    if (!isApplyingFallthroughProps && el.$root && hasFallthroughKey(key)) {
      return;
    }
    if (key === "true-value") {
      el._trueValue = value;
    } else if (key === "false-value") {
      el._falseValue = value;
    }
    if (value !== el[`$${key}`]) {
      el[`$${key}`] = value;
      if (value != null) {
        el.setAttribute(key, value);
      } else {
        el.removeAttribute(key);
      }
    }
  }
  function setDOMProp(el, key, value, forceHydrate = false) {
    if (!isApplyingFallthroughProps && el.$root && hasFallthroughKey(key)) {
      return;
    }
    const prev = el[key];
    if (value === prev) {
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof prev;
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(key);
  }
  function setClass(el, value) {
    if (el.$root) {
      setClassIncremental(el, value);
    } else {
      value = normalizeClass(value);
      if (value !== el.$cls) {
        el.className = el.$cls = value;
      }
    }
  }
  function setClassIncremental(el, value) {
    const cacheKey = `$clsi${isApplyingFallthroughProps ? "$" : ""}`;
    const normalizedValue = normalizeClass(value);
    const prev = el[cacheKey];
    if ((value = el[cacheKey] = normalizedValue) !== prev) {
      const nextList = value.split(/\s+/);
      if (value) {
        el.classList.add(...nextList);
      }
      if (prev) {
        for (const cls of prev.split(/\s+/)) {
          if (!nextList.includes(cls)) el.classList.remove(cls);
        }
      }
    }
  }
  function setStyle(el, value) {
    if (el.$root) {
      setStyleIncremental(el, value);
    } else {
      const normalizedValue = normalizeStyle(value);
      patchStyle(el, el.$sty, el.$sty = normalizedValue);
    }
  }
  function setStyleIncremental(el, value) {
    const cacheKey = `$styi${isApplyingFallthroughProps ? "$" : ""}`;
    const normalizedValue = isString(value) ? parseStringStyle(value) : normalizeStyle(value);
    patchStyle(el, el[cacheKey], el[cacheKey] = normalizedValue);
  }
  function setValue(el, value, forceHydrate = false) {
    if (!isApplyingFallthroughProps && el.$root && hasFallthroughKey("value")) {
      return;
    }
    el._value = value;
    const oldValue = el.tagName === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute("value");
    }
  }
  function setText(el, value) {
    if (isHydrating) {
      const clientText = getClientText(el.parentNode, value);
      if (el.nodeValue == clientText) {
        el.$txt = clientText;
        return;
      }
      logMismatchError();
    }
    if (el.$txt !== value) {
      el.nodeValue = el.$txt = value;
    }
  }
  function setElementText(el, value) {
    value = toDisplayString(value);
    if (isHydrating) {
      let clientText = getClientText(el, value);
      if (el.textContent === clientText) {
        el.$txt = clientText;
        return;
      }
      if (!isMismatchAllowed(el, 0)) {
        logMismatchError();
      }
    }
    if (el.$txt !== value) {
      el.textContent = el.$txt = value;
    }
  }
  function setHtml(el, value) {
    value = value == null ? "" : unsafeToTrustedHTML(value);
    if (el.$html !== value) {
      el.innerHTML = el.$html = value;
    }
  }
  function setDynamicProps(el, args) {
    const props = args.length > 1 ? mergeProps(...args) : args[0];
    const cacheKey = `$dprops${isApplyingFallthroughProps ? "$" : ""}`;
    const prevKeys = el[cacheKey];
    if (prevKeys) {
      for (const key of prevKeys) {
        if (!(key in props)) {
          setDynamicProp(el, key, null);
        }
      }
    }
    for (const key of el[cacheKey] = Object.keys(props)) {
      setDynamicProp(el, key, props[key]);
    }
  }
  function setDynamicProp(el, key, value) {
    let forceHydrate = false;
    if (key === "class") {
      setClass(el, value);
    } else if (key === "style") {
      setStyle(el, value);
    } else if (isOn(key)) {
      on(el, key[2].toLowerCase() + key.slice(3), value, { effect: true });
    } else if (
(forceHydrate = key[0] === ".") ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, value)
    ) {
      if (key === "innerHTML") {
        setHtml(el, value);
      } else if (key === "textContent") {
        setElementText(el, value);
      } else if (key === "value" && canSetValueDirectly(el.tagName)) {
        setValue(el, value, forceHydrate);
      } else {
        setDOMProp(el, key, value, forceHydrate);
      }
    } else {
      setAttr(el, key, value);
    }
    return value;
  }
  let isOptimized = false;
  function optimizePropertyLookup() {
    if (isOptimized) return;
    isOptimized = true;
    const proto = Element.prototype;
    proto.$transition = void 0;
    proto.$key = void 0;
    proto.$fc = proto.$evtclick = void 0;
    proto.$root = false;
    proto.$html = proto.$txt = proto.$cls = proto.$sty = Text.prototype.$txt = "";
  }
  function getClientText(el, value) {
    if (value[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) {
      value = value.slice(1);
    }
    return value;
  }
function defineVaporComponent(comp, extraOptions) {
    if (isFunction(comp)) {
      return (() => extend({ name: comp.name }, extraOptions, {
        setup: comp,
        __vapor: true
      }))();
    }
    comp.__vapor = true;
    return comp;
  }
  function findParentKeepAlive(instance) {
    let parent = instance;
    while (parent) {
      if (isKeepAlive(parent)) {
        return parent;
      }
      parent = parent.parent;
    }
    return null;
  }
  const interopKey = Symbol(`interop`);
  function normalizeEmitsOptions(comp) {
    const cached = comp.__emitsOptions;
    if (cached) return cached;
    const raw = comp.emits;
    if (!raw) return null;
    let normalized;
    if (isArray(raw)) {
      normalized = {};
      for (const key of raw) normalized[key] = null;
    } else {
      normalized = raw;
    }
    return comp.__emitsOptions = normalized;
  }
  function emit(instance, event, ...rawArgs) {
    baseEmit(
      instance,
      instance.rawProps || EMPTY_OBJ,
      propGetter,
      event,
      ...rawArgs
    );
  }
  function propGetter(rawProps, key) {
    const dynamicSources = rawProps.$;
    if (dynamicSources) {
      let i = dynamicSources.length;
      while (i--) {
        const source = resolveSource(dynamicSources[i]);
        if (hasOwn(source, key))
          return dynamicSources[interopKey] ? source[key] : resolveSource(source[key]);
      }
    }
    return rawProps[key] && resolveSource(rawProps[key]);
  }
  function resolveSource(source) {
    return isFunction(source) ? source() : source;
  }
  function getPropsProxyHandlers(comp, once) {
    if (comp.__propsHandlers) {
      return comp.__propsHandlers;
    }
    const propsOptions = normalizePropsOptions(comp)[0];
    const emitsOptions = normalizeEmitsOptions(comp);
    const isProp = propsOptions ? (key) => isString(key) && hasOwn(propsOptions, camelize(key)) : NO;
    const isAttr = propsOptions ? (key) => key !== "$" && !isProp(key) && !isEmitListener(emitsOptions, key) : YES;
    const getProp = (instance, key) => {
      if (key === "__v_isReactive") return true;
      if (!isProp(key)) return;
      const rawProps = instance.rawProps;
      const dynamicSources = rawProps.$;
      if (dynamicSources) {
        let i = dynamicSources.length;
        let source, isDynamic, rawKey;
        while (i--) {
          source = dynamicSources[i];
          isDynamic = isFunction(source);
          source = isDynamic ? source() : source;
          for (rawKey in source) {
            if (camelize(rawKey) === key) {
              return resolvePropValue(
                propsOptions,
                key,
                isDynamic ? source[rawKey] : source[rawKey](),
                instance,
                resolveDefault
              );
            }
          }
        }
      }
      for (const rawKey in rawProps) {
        if (camelize(rawKey) === key) {
          return resolvePropValue(
            propsOptions,
            key,
            rawProps[rawKey](),
            instance,
            resolveDefault
          );
        }
      }
      return resolvePropValue(
        propsOptions,
        key,
        void 0,
        instance,
        resolveDefault,
        true
      );
    };
    const getPropValue = once ? (...args) => {
      pauseTracking();
      const value = getProp(...args);
      resetTracking();
      return value;
    } : getProp;
    const propsHandlers = propsOptions ? {
      get: (target, key) => getPropValue(target, key),
      has: (_, key) => isProp(key),
      ownKeys: () => Object.keys(propsOptions),
      getOwnPropertyDescriptor(target, key) {
        if (isProp(key)) {
          return {
            configurable: true,
            enumerable: true,
            get: () => getPropValue(target, key)
          };
        }
      }
    } : null;
    const getAttr = (target, key) => {
      if (!isProp(key) && !isEmitListener(emitsOptions, key)) {
        return getAttrFromRawProps(target, key);
      }
    };
    const hasAttr = (target, key) => {
      if (isAttr(key)) {
        return hasAttrFromRawProps(target, key);
      } else {
        return false;
      }
    };
    const getAttrValue = once ? (...args) => {
      pauseTracking();
      const value = getAttr(...args);
      resetTracking();
      return value;
    } : getAttr;
    const attrsHandlers = {
      get: (target, key) => getAttrValue(target.rawProps, key),
      has: (target, key) => hasAttr(target.rawProps, key),
      ownKeys: (target) => getKeysFromRawProps(target.rawProps).filter(isAttr),
      getOwnPropertyDescriptor(target, key) {
        if (hasAttr(target.rawProps, key)) {
          return {
            configurable: true,
            enumerable: true,
            get: () => getAttrValue(target.rawProps, key)
          };
        }
      }
    };
    return comp.__propsHandlers = [propsHandlers, attrsHandlers];
  }
  function getAttrFromRawProps(rawProps, key) {
    if (key === "$") return;
    const merged = key === "class" || key === "style" ? [] : void 0;
    const dynamicSources = rawProps.$;
    if (dynamicSources) {
      let i = dynamicSources.length;
      let source, isDynamic;
      while (i--) {
        source = dynamicSources[i];
        isDynamic = isFunction(source);
        source = isDynamic ? source() : source;
        if (source && hasOwn(source, key)) {
          const value = isDynamic ? source[key] : source[key]();
          if (merged) {
            merged.push(value);
          } else {
            return value;
          }
        }
      }
    }
    if (hasOwn(rawProps, key)) {
      if (merged) {
        merged.push(rawProps[key]());
      } else {
        return rawProps[key]();
      }
    }
    if (merged && merged.length) {
      return merged;
    }
  }
  function hasAttrFromRawProps(rawProps, key) {
    if (key === "$") return false;
    const dynamicSources = rawProps.$;
    if (dynamicSources) {
      let i = dynamicSources.length;
      while (i--) {
        const source = resolveSource(dynamicSources[i]);
        if (source && hasOwn(source, key)) {
          return true;
        }
      }
    }
    return hasOwn(rawProps, key);
  }
  function getKeysFromRawProps(rawProps) {
    const keys = [];
    for (const key in rawProps) {
      if (key !== "$") keys.push(key);
    }
    const dynamicSources = rawProps.$;
    if (dynamicSources) {
      let i = dynamicSources.length;
      let source;
      while (i--) {
        source = resolveSource(dynamicSources[i]);
        for (const key in source) {
          keys.push(key);
        }
      }
    }
    return Array.from(new Set(keys));
  }
  function normalizePropsOptions(comp) {
    const cached = comp.__propsOptions;
    if (cached) return cached;
    const raw = comp.props;
    if (!raw) return EMPTY_ARR;
    const normalized = {};
    const needCastKeys = [];
    baseNormalizePropsOptions(raw, normalized, needCastKeys);
    return comp.__propsOptions = [normalized, needCastKeys];
  }
  function resolveDefault(factory, instance) {
    const prev = setCurrentInstance(instance);
    const res = factory.call(null, instance.props);
    setCurrentInstance(...prev);
    return res;
  }
  function hasFallthroughAttrs(comp, rawProps) {
    if (rawProps) {
      if (rawProps.$ || !comp.props) {
        return true;
      } else {
        const propsOptions = normalizePropsOptions(comp)[0];
        for (const key in rawProps) {
          if (!hasOwn(propsOptions, camelize(key))) {
            return true;
          }
        }
      }
    }
    return false;
  }
  const rawPropsProxyHandlers = {
    get: getAttrFromRawProps,
    has: hasAttrFromRawProps,
    ownKeys: getKeysFromRawProps,
    getOwnPropertyDescriptor(target, key) {
      if (hasAttrFromRawProps(target, key)) {
        return {
          configurable: true,
          enumerable: true,
          get: () => getAttrFromRawProps(target, key)
        };
      }
    }
  };
  const VaporTeleportImpl = {
    name: "VaporTeleport",
    __isTeleport: true,
    __vapor: true,
    process(props, slots) {
      return new TeleportFragment(props, slots);
    }
  };
  class TeleportFragment extends VaporFragment {
    constructor(props, slots) {
      super([]);
      this.insert = (container2, anchor) => {
        if (isHydrating) return;
        this.placeholder = createTextNode();
        insert(this.placeholder, container2, anchor);
        insert(this.anchor, container2, anchor);
        this.handlePropsUpdate();
      };
      this.remove = (parent = this.parent) => {
        if (this.nodes) {
          remove(this.nodes, this.mountContainer);
          this.nodes = [];
        }
        if (this.targetStart) {
          remove(this.targetStart, this.target);
          this.targetStart = void 0;
          remove(this.targetAnchor, this.target);
          this.targetAnchor = void 0;
        }
        if (this.anchor) {
          remove(this.anchor, this.anchor.parentNode);
          this.anchor = void 0;
        }
        if (this.placeholder) {
          remove(this.placeholder, parent);
          this.placeholder = void 0;
        }
        this.mountContainer = void 0;
        this.mountAnchor = void 0;
      };
      this.hydrate = () => {
        const target = this.target = resolveTarget(
          this.resolvedProps,
          querySelector
        );
        const disabled = isTeleportDisabled(this.resolvedProps);
        this.placeholder = currentHydrationNode;
        if (target) {
          const targetNode = target._lpa || target.firstChild;
          if (disabled) {
            this.hydrateDisabledTeleport(targetNode);
          } else {
            this.anchor = locateTeleportEndAnchor();
            this.mountContainer = target;
            let targetAnchor = targetNode;
            while (targetAnchor) {
              if (targetAnchor && targetAnchor.nodeType === 8) {
                if (targetAnchor.data === "teleport start anchor") {
                  this.targetStart = targetAnchor;
                } else if (targetAnchor.data === "teleport anchor") {
                  this.mountAnchor = this.targetAnchor = targetAnchor;
                  target._lpa = this.targetAnchor && this.targetAnchor.nextSibling;
                  break;
                }
              }
              targetAnchor = targetAnchor.nextSibling;
            }
            if (targetNode) {
              setCurrentHydrationNode(targetNode.nextSibling);
            }
            if (!this.targetAnchor) {
              this.mount(target);
            } else {
              this.initChildren();
            }
          }
        } else if (disabled) {
          this.hydrateDisabledTeleport(currentHydrationNode);
        }
        advanceHydrationNode(this.anchor);
      };
      this.rawProps = props;
      this.rawSlots = slots;
      this.anchor = isHydrating ? void 0 : createTextNode();
      renderEffect(() => {
        this.resolvedProps = extend(
          {},
          new Proxy(
            this.rawProps,
            rawPropsProxyHandlers
          )
        );
        this.handlePropsUpdate();
      });
      if (!isHydrating) {
        this.initChildren();
      }
    }
    get parent() {
      return this.anchor ? this.anchor.parentNode : null;
    }
    initChildren() {
      renderEffect(() => {
        this.handleChildrenUpdate(
          this.rawSlots.default && this.rawSlots.default()
        );
      });
    }
    handleChildrenUpdate(children) {
      if (!this.parent || isHydrating) {
        this.nodes = children;
        return;
      }
      remove(this.nodes, this.mountContainer);
      insert(this.nodes = children, this.mountContainer, this.mountAnchor);
    }
    handlePropsUpdate() {
      if (!this.parent || isHydrating) return;
      const mount = (parent, anchor) => {
        if (this.$transition) {
          applyTransitionHooks(this.nodes, this.$transition);
        }
        insert(
          this.nodes,
          this.mountContainer = parent,
          this.mountAnchor = anchor
        );
      };
      const mountToTarget = () => {
        const target = this.target = resolveTarget(
          this.resolvedProps,
          querySelector
        );
        if (target) {
          if (
!this.targetAnchor ||
this.targetAnchor.parentNode !== target
          ) {
            insert(this.targetStart = createTextNode(""), target);
            insert(this.targetAnchor = createTextNode(""), target);
          }
          mount(target, this.targetAnchor);
        }
      };
      if (isTeleportDisabled(this.resolvedProps)) {
        mount(this.parent, this.anchor);
      } else {
        if (isTeleportDeferred(this.resolvedProps)) {
          queuePostFlushCb(mountToTarget);
        } else {
          mountToTarget();
        }
      }
    }
    hydrateDisabledTeleport(targetNode) {
      let nextNode = this.placeholder.nextSibling;
      setCurrentHydrationNode(nextNode);
      this.mountAnchor = this.anchor = locateTeleportEndAnchor(nextNode);
      this.mountContainer = this.anchor.parentNode;
      this.targetStart = targetNode;
      this.targetAnchor = targetNode && targetNode.nextSibling;
      this.initChildren();
    }
    mount(target) {
      target.appendChild(this.targetStart = createTextNode(""));
      target.appendChild(
        this.mountAnchor = this.targetAnchor = createTextNode("")
      );
      if (!isMismatchAllowed(target, 1)) {
        logMismatchError();
      }
      runWithoutHydration(this.initChildren.bind(this));
    }
  }
  function isVaporTeleport(value) {
    return value === VaporTeleportImpl;
  }
  function locateTeleportEndAnchor(node = currentHydrationNode) {
    while (node) {
      if (isComment(node, "teleport end")) {
        return node;
      }
      node = node.nextSibling;
    }
    return null;
  }
  function isValidBlock(block) {
    if (block instanceof Node) {
      return !(block instanceof Comment);
    } else if (isVaporComponent(block)) {
      return isValidBlock(block.block);
    } else if (isArray(block)) {
      return block.length > 0 && block.some(isValidBlock);
    } else {
      return isValidBlock(block.nodes);
    }
  }
  function insert(block, parent, anchor = null, parentSuspense) {
    anchor = anchor === 0 ? parent.$fc || _child(parent) : anchor;
    if (block instanceof Node) {
      if (!isHydrating) {
        if (block instanceof Element && block.$transition && !block.$transition.disabled) {
          performTransitionEnter(
            block,
            block.$transition,
            () => parent.insertBefore(block, anchor),
            parentSuspense
          );
        } else {
          parent.insertBefore(block, anchor);
        }
      }
    } else if (isVaporComponent(block)) {
      if (block.isMounted && !block.isDeactivated) {
        insert(block.block, parent, anchor);
      } else {
        mountComponent(block, parent, anchor);
      }
    } else if (isArray(block)) {
      for (const b of block) {
        insert(b, parent, anchor);
      }
    } else {
      if (block.anchor) {
        insert(block.anchor, parent, anchor);
        anchor = block.anchor;
      }
      if (block.insert) {
        block.insert(parent, anchor, block.$transition);
      } else {
        insert(block.nodes, parent, anchor, parentSuspense);
      }
    }
  }
  function remove(block, parent) {
    if (block instanceof Node) {
      if (block.$transition && block instanceof Element) {
        performTransitionLeave(
          block,
          block.$transition,
          () => parent && parent.removeChild(block)
        );
      } else {
        parent && parent.removeChild(block);
      }
    } else if (isVaporComponent(block)) {
      unmountComponent(block, parent);
    } else if (isArray(block)) {
      for (let i = 0; i < block.length; i++) {
        remove(block[i], parent);
      }
    } else {
      if (block.remove) {
        block.remove(parent, block.$transition);
      } else {
        remove(block.nodes, parent);
      }
      if (block.anchor) remove(block.anchor, parent);
      if (block.scope) {
        block.scope.stop();
        const scopes = block.keptAliveScopes;
        if (scopes) {
          scopes.forEach((scope) => scope.stop());
          scopes.clear();
        }
      }
    }
  }
  function findBlockNode(block) {
    let { parentNode: parentNode2, nextSibling: nextNode } = findLastChild(block);
    if (nextNode && isComment(nextNode, "]") && isFragmentBlock(block)) {
      nextNode = nextNode.nextSibling;
    }
    return {
      parentNode: parentNode2,
      nextNode
    };
  }
  function findLastChild(node) {
    if (node && node instanceof Node) {
      return node;
    } else if (isArray(node)) {
      return findLastChild(node[node.length - 1]);
    } else if (isVaporComponent(node)) {
      return findLastChild(node.block);
    } else {
      if (node.anchor) return node.anchor;
      return findLastChild(node.nodes);
    }
  }
  function isFragmentBlock(block) {
    if (isArray(block)) {
      return true;
    } else if (isVaporComponent(block)) {
      return isFragmentBlock(block.block);
    } else if (isFragment(block)) {
      return isFragmentBlock(block.nodes);
    }
    return false;
  }
  function setScopeId(block, scopeIds) {
    if (block instanceof Element) {
      for (const id of scopeIds) {
        block.setAttribute(id, "");
      }
    } else if (isVaporComponent(block)) {
      setScopeId(block.block, scopeIds);
    } else if (isArray(block)) {
      for (const b of block) {
        setScopeId(b, scopeIds);
      }
    } else if (isFragment(block)) {
      setScopeId(block.nodes, scopeIds);
    }
  }
  function setComponentScopeId(instance) {
    const parent = instance.parent;
    if (!parent) return;
    if (isArray(instance.block) && instance.block.length > 1) return;
    const scopeIds = [];
    const scopeId = parent.type.__scopeId;
    if (scopeId) {
      scopeIds.push(scopeId);
    }
    if (parent.subTree && parent.subTree.component === instance && parent.vnode.scopeId) {
      scopeIds.push(parent.vnode.scopeId);
      const inheritedScopeIds = getInheritedScopeIds(parent.vnode, parent.parent);
      scopeIds.push(...inheritedScopeIds);
    }
    if (scopeIds.length > 0) {
      setScopeId(instance.block, scopeIds);
    }
  }
  function createComponent(component, rawProps, rawSlots, isSingleRoot, once, appContext = currentInstance && currentInstance.appContext || emptyContext) {
    const _insertionParent = insertionParent;
    const _insertionAnchor = insertionAnchor;
    const _isLastInsertion = isLastInsertion;
    if (isHydrating) {
      locateHydrationNode();
    } else {
      resetInsertionState();
    }
    if (isSingleRoot && component.inheritAttrs !== false && isVaporComponent(currentInstance) && currentInstance.hasFallthrough) {
      const attrs = currentInstance.attrs;
      if (rawProps) {
        (rawProps.$ || (rawProps.$ = [])).push(
          () => attrs
        );
      } else {
        rawProps = { $: [() => attrs] };
      }
    }
    if (currentInstance && currentInstance.vapor && isKeepAlive(currentInstance)) {
      const cached = currentInstance.getCachedComponent(
        component
      );
      if (cached) return cached;
    }
    if (appContext.vapor && !component.__vapor) {
      const frag = appContext.vapor.vdomMount(
        component,
        rawProps,
        rawSlots
      );
      if (!isHydrating) {
        if (_insertionParent) insert(frag, _insertionParent, _insertionAnchor);
      } else {
        frag.hydrate();
        if (_isLastInsertion) {
          advanceHydrationNode(_insertionParent);
        }
      }
      return frag;
    }
    if (isVaporTeleport(component)) {
      const frag = component.process(rawProps, rawSlots);
      if (!isHydrating) {
        if (_insertionParent) insert(frag, _insertionParent, _insertionAnchor);
      } else {
        frag.hydrate();
        if (_isLastInsertion) {
          advanceHydrationNode(_insertionParent);
        }
      }
      return frag;
    }
    const instance = new VaporComponentInstance(
      component,
      rawProps,
      rawSlots,
      appContext,
      once
    );
    if (isHydrating && isAsyncWrapper(instance) && component.__asyncHydrate && !component.__asyncResolved) {
      const el = currentHydrationNode;
      if (isComment(el, "[")) {
        const end = _next(locateEndAnchor(el));
        const block = instance.block = [el];
        let cur = el;
        while (true) {
          let n = _next(cur);
          if (n && n !== end) {
            block.push(cur = n);
          } else {
            break;
          }
        }
      } else {
        instance.block = el;
      }
      instance.isMounted = true;
      setCurrentHydrationNode(
        isComment(el, "[") ? locateEndAnchor(el) : el.nextSibling
      );
      component.__asyncHydrate(
        el,
        instance,
        () => setupComponent(instance, component)
      );
    } else {
      setupComponent(instance, component);
    }
    onScopeDispose(() => unmountComponent(instance), true);
    if (_insertionParent || isHydrating) {
      mountComponent(instance, _insertionParent, _insertionAnchor);
    }
    if (isHydrating && _insertionAnchor !== void 0) {
      advanceHydrationNode(_insertionParent);
    }
    return instance;
  }
  function setupComponent(instance, component) {
    const prevInstance = setCurrentInstance(instance);
    const prevSub = setActiveSub();
    const setupFn = isFunction(component) ? component : component.setup;
    const setupResult = setupFn ? callWithErrorHandling(setupFn, instance, 0, [
      instance.props,
      instance
    ]) || EMPTY_OBJ : EMPTY_OBJ;
    {
      if (!setupFn && component.render) {
        instance.block = callWithErrorHandling(
          component.render,
          instance,
          1
        );
      } else {
        instance.block = setupResult;
      }
    }
    if (instance.hasFallthrough && component.inheritAttrs !== false && Object.keys(instance.attrs).length) {
      renderEffect(() => applyFallthroughProps(instance.block, instance.attrs));
    }
    setActiveSub(prevSub);
    setCurrentInstance(...prevInstance);
  }
  let isApplyingFallthroughProps = false;
  function applyFallthroughProps(block, attrs) {
    const el = getRootElement(block);
    if (el) {
      isApplyingFallthroughProps = true;
      setDynamicProps(el, [attrs]);
      isApplyingFallthroughProps = false;
    }
  }
  const emptyContext = {
    app: null,
    config: {},
    provides: Object.create(null)
  };
  class VaporComponentInstance {
    constructor(comp, rawProps, rawSlots, appContext, once) {
      this.vapor = true;
      this.uid = nextUid();
      this.type = comp;
      this.parent = currentInstance;
      this.root = currentInstance ? currentInstance.root : this;
      if (currentInstance) {
        this.appContext = currentInstance.appContext;
        this.provides = currentInstance.provides;
        this.ids = currentInstance.ids;
      } else {
        this.appContext = appContext || emptyContext;
        this.provides = Object.create(this.appContext.provides);
        this.ids = ["", 0, 0];
      }
      this.block = null;
      this.scope = new EffectScope(true);
      this.emit = emit.bind(null, this);
      this.expose = expose.bind(null, this);
      this.refs = EMPTY_OBJ;
      this.emitted = this.exposed = this.exposeProxy = this.propsDefaults = this.suspense = null;
      this.isMounted = this.isUnmounted = this.isUpdating = this.isDeactivated = false;
      this.rawProps = rawProps || EMPTY_OBJ;
      this.hasFallthrough = hasFallthroughAttrs(comp, rawProps);
      if (rawProps || comp.props) {
        const [propsHandlers, attrsHandlers] = getPropsProxyHandlers(comp, once);
        this.attrs = new Proxy(this, attrsHandlers);
        this.props = comp.props ? new Proxy(this, propsHandlers) : isFunction(comp) ? this.attrs : EMPTY_OBJ;
      } else {
        this.props = this.attrs = EMPTY_OBJ;
      }
      this.rawSlots = rawSlots || EMPTY_OBJ;
      this.slots = rawSlots ? rawSlots.$ ? new Proxy(rawSlots, dynamicSlotsProxyHandlers) : rawSlots : EMPTY_OBJ;
    }
rawKeys() {
      return getKeysFromRawProps(this.rawProps);
    }
  }
  function isVaporComponent(value) {
    return value instanceof VaporComponentInstance;
  }
  function mountComponent(instance, parent, anchor) {
    if (instance.shapeFlag & 512) {
      findParentKeepAlive(instance).activate(instance, parent, anchor);
      return;
    }
    if (instance.bm) invokeArrayFns(instance.bm);
    if (!isHydrating) {
      insert(instance.block, parent, anchor);
      setComponentScopeId(instance);
    }
    if (instance.m) queuePostFlushCb(instance.m);
    if (instance.shapeFlag & 256 && instance.a) {
      queuePostFlushCb(instance.a);
    }
    instance.isMounted = true;
  }
  function unmountComponent(instance, parentNode2) {
    if (parentNode2 && instance.parent && instance.parent.vapor && instance.shapeFlag & 256) {
      findParentKeepAlive(instance).deactivate(instance);
      return;
    }
    if (instance.isMounted && !instance.isUnmounted) {
      if (instance.bum) {
        invokeArrayFns(instance.bum);
      }
      instance.scope.stop();
      if (instance.um) {
        queuePostFlushCb(instance.um);
      }
      instance.isUnmounted = true;
    }
    if (parentNode2) {
      remove(instance.block, parentNode2);
    }
  }
  function getExposed(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(markRaw(instance.exposed), {
        get: (target, key) => unref(target[key])
      }));
    }
  }
  function getRootElement(block) {
    if (block instanceof Element) {
      return block;
    }
    if (block instanceof DynamicFragment) {
      const { nodes } = block;
      if (nodes instanceof Element && nodes.$root) {
        return nodes;
      }
    }
  }
  let _createApp;
  const mountApp = (app, container2) => {
    optimizePropertyLookup();
    if (container2.nodeType === 1) {
      container2.textContent = "";
    }
    const instance = createComponent(
      app._component,
      app._props,
      null,
      false,
      false,
      app._context
    );
    mountComponent(instance, container2);
    flushOnAppMount();
    return instance;
  };
  const unmountApp = (app) => {
    unmountComponent(app._instance, app._container);
  };
  function prepareApp() {
    const target = getGlobalThis();
    target.__VUE__ = true;
  }
  function postPrepareApp(app) {
    app.vapor = true;
    const mount = app.mount;
    app.mount = (container2, ...args) => {
      container2 = normalizeContainer(container2);
      const proxy = mount(container2, ...args);
      if (container2 instanceof Element) {
        container2.removeAttribute("v-cloak");
        container2.setAttribute("data-v-app", "");
      }
      return proxy;
    };
  }
  const createVaporApp = (comp, props) => {
    prepareApp();
    if (!_createApp) _createApp = createAppAPI(mountApp, unmountApp, getExposed);
    const app = _createApp(comp, props);
    postPrepareApp(app);
    return app;
  };
  let t;
function template(html, root) {
    let node;
    return () => {
      if (isHydrating) {
        const adopted = adoptTemplate(currentHydrationNode, html);
        if (root) adopted.$root = true;
        return adopted;
      }
      if (html[0] !== "<") {
        return createTextNode(html);
      }
      if (!node) {
        t = t || createElement("template");
        t.innerHTML = html;
        node = _child(t.content);
      }
      const ret = node.cloneNode(true);
      if (root) ret.$root = true;
      return ret;
    };
  }
  function createIf(condition, b1, b2, once) {
    const _insertionParent = insertionParent;
    const _insertionAnchor = insertionAnchor;
    const _isLastInsertion = isLastInsertion;
    if (!isHydrating) resetInsertionState();
    let frag;
    {
      frag = isHydrating || false ? new DynamicFragment("if") : new DynamicFragment();
      renderEffect(() => frag.update(condition() ? b1 : b2));
    }
    if (!isHydrating) {
      if (_insertionParent) insert(frag, _insertionParent, _insertionAnchor);
    } else {
      if (_isLastInsertion) {
        advanceHydrationNode(_insertionParent);
      }
    }
    return frag;
  }
  class ForBlock extends VaporFragment {
    constructor(nodes, scope, item, key, index, renderKey) {
      super(nodes);
      this.scope = scope;
      this.itemRef = item;
      this.keyRef = key;
      this.indexRef = index;
      this.key = renderKey;
    }
  }
  function isForBlock(block) {
    return block instanceof ForBlock;
  }
  function createTemplateRefSetter() {
    const instance = currentInstance;
    return (...args) => setRef(instance, ...args);
  }
  function setRef(instance, el, ref, oldRef, refFor = false, refKey) {
    if (!instance || instance.isUnmounted) return;
    if (isFragment(el) && el.setRef) {
      el.setRef(instance, ref, refFor, refKey);
      return;
    }
    const isVaporComp = isVaporComponent(el);
    if (isVaporComp && isAsyncWrapper(el)) {
      const i = el;
      const frag = i.block;
      if (!i.type.__asyncResolved) {
        frag.setRef = (i2) => setRef(instance, i2, ref, oldRef, refFor);
        return;
      }
      el = frag.nodes;
    }
    const setupState = null;
    const refValue = getRefValue(el);
    const refs = instance.refs === EMPTY_OBJ ? instance.refs = {} : instance.refs;
    createCanSetSetupRefChecker(setupState);
    if (oldRef != null && oldRef !== ref) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref)) {
      const invokeRefSetter = (value) => {
        callWithErrorHandling(ref, currentInstance, 12, [
          value,
          refs
        ]);
      };
      invokeRefSetter(refValue);
      onScopeDispose(() => invokeRefSetter());
    } else {
      const _isString = isString(ref);
      const _isRef = isRef(ref);
      let existing;
      if (_isString || _isRef) {
        const doSet = () => {
          if (refFor) {
            existing = _isString ? refs[ref] : ref.value;
            if (!isArray(existing)) {
              existing = [refValue];
              if (_isString) {
                refs[ref] = existing;
              } else {
                ref.value = existing;
                if (refKey) refs[refKey] = existing;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          } else if (_isString) {
            refs[ref] = refValue;
          } else if (_isRef) {
            ref.value = refValue;
            if (refKey) refs[refKey] = refValue;
          } else ;
        };
        queuePostFlushCb(doSet, -1);
        onScopeDispose(() => {
          queuePostFlushCb(() => {
            if (isArray(existing)) {
              remove$1(existing, refValue);
            } else if (_isString) {
              refs[ref] = null;
            } else if (_isRef) {
              ref.value = null;
              if (refKey) refs[refKey] = null;
            }
          });
        });
      }
    }
    return ref;
  }
  const getRefValue = (el) => {
    if (isVaporComponent(el)) {
      return getExposed(el) || el;
    } else if (el instanceof DynamicFragment) {
      return getRefValue(el.nodes);
    }
    return el;
  };
  const positionMap = new WeakMap();
  const newPositionMap = new WeakMap();
  const decorate = (t2) => {
    delete t2.props.mode;
    t2.__vapor = true;
    return t2;
  };
  decorate({
    name: "VaporTransitionGroup",
    props: extend({}, TransitionPropsValidators, {
      tag: String,
      moveClass: String
    }),
    setup(props, { slots }) {
      const instance = currentInstance;
      const state = useTransitionState();
      const cssTransitionProps = resolveTransitionProps(props);
      let prevChildren;
      let children;
      const slottedBlock = slots.default && slots.default();
      onBeforeUpdate(() => {
        prevChildren = [];
        children = getTransitionBlocks(slottedBlock);
        if (children) {
          for (let i = 0; i < children.length; i++) {
            const child2 = children[i];
            if (isValidTransitionBlock(child2)) {
              prevChildren.push(child2);
              child2.$transition.disabled = true;
              positionMap.set(
                child2,
                getTransitionElement(child2).getBoundingClientRect()
              );
            }
          }
        }
      });
      onUpdated(() => {
        if (!prevChildren.length) {
          return;
        }
        const moveClass = props.moveClass || `${props.name || "v"}-move`;
        const firstChild = getFirstConnectedChild(prevChildren);
        if (!firstChild || !hasCSSTransform(
          firstChild,
          firstChild.parentNode,
          moveClass
        )) {
          prevChildren = [];
          return;
        }
        prevChildren.forEach(callPendingCbs);
        prevChildren.forEach((child2) => {
          child2.$transition.disabled = false;
          recordPosition(child2);
        });
        const movedChildren = prevChildren.filter(applyTranslation);
        forceReflow();
        movedChildren.forEach(
          (c) => handleMovedChildren(
            getTransitionElement(c),
            moveClass
          )
        );
        prevChildren = [];
      });
      setTransitionHooksOnFragment(slottedBlock, {
        props: cssTransitionProps,
        state,
        instance
      });
      children = getTransitionBlocks(slottedBlock);
      for (let i = 0; i < children.length; i++) {
        const child2 = children[i];
        if (isValidTransitionBlock(child2)) {
          if (child2.$key != null) {
            setTransitionHooks(
              child2,
              resolveTransitionHooks(child2, cssTransitionProps, state, instance)
            );
          }
        }
      }
      const tag = props.tag;
      if (tag) {
        const container2 = createElement(tag);
        insert(slottedBlock, container2);
        if (instance.hasFallthrough) {
          container2.$root = true;
          renderEffect(() => applyFallthroughProps(container2, instance.attrs));
        }
        return container2;
      } else {
        const frag = new DynamicFragment();
        renderEffect(() => frag.update(() => slottedBlock));
        return frag;
      }
    }
  });
  function getTransitionBlocks(block) {
    let children = [];
    if (block instanceof Node) {
      children.push(block);
    } else if (isVaporComponent(block)) {
      children.push(...getTransitionBlocks(block.block));
    } else if (isArray(block)) {
      for (let i = 0; i < block.length; i++) {
        const b = block[i];
        const blocks = getTransitionBlocks(b);
        if (isForBlock(b)) blocks.forEach((block2) => block2.$key = b.key);
        children.push(...blocks);
      }
    } else if (isFragment(block)) {
      if (block.insert) {
        children.push(block);
      } else {
        children.push(...getTransitionBlocks(block.nodes));
      }
    }
    return children;
  }
  function isValidTransitionBlock(block) {
    return !!(block instanceof Element || isFragment(block) && block.insert);
  }
  function getTransitionElement(c) {
    return isFragment(c) ? c.nodes : c;
  }
  function recordPosition(c) {
    newPositionMap.set(c, getTransitionElement(c).getBoundingClientRect());
  }
  function applyTranslation(c) {
    if (baseApplyTranslation(
      positionMap.get(c),
      newPositionMap.get(c),
      getTransitionElement(c)
    )) {
      return c;
    }
  }
  function getFirstConnectedChild(children) {
    for (let i = 0; i < children.length; i++) {
      const child2 = children[i];
      const el = getTransitionElement(child2);
      if (el.isConnected) return el;
    }
  }
  const name = "fuck-bilibili";
  const pkg = {
    name
  };
  const baseCss = "svg,video,iframe{display:block}.SvgIcon{overflow:hidden;fill:currentColor;height:var(--svg-h, 1em)}";
  var a;
  const d = (b) => (a = document.createElement("style"), a.append(b), a);
  const base = d(baseCss);
  const unoStyle = document.createElement("style");
  unoStyle.textContent = '*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}.h-20px,[h-20px=""]{height:20px;}.flex,[flex=""]{display:flex;}.inline-flex{display:inline-flex;}.cursor-pointer,[cursor-pointer=""]{cursor:pointer;}.items-center,[items-center=""]{align-items:center;}[gap-4px=""]{gap:4px;}.text-xl,[text-xl=""]{font-size:1.25rem;line-height:1.75rem;}.text-blue,.text-blue-400,[text-blue-400=""]{--un-text-opacity:1;color:rgb(96 165 250 / var(--un-text-opacity)) /* #60a5fa */;}.text-transparent{color:transparent /* transparent */;}.hover\\:text-blue-600:hover{--un-text-opacity:1;color:rgb(37 99 235 / var(--un-text-opacity)) /* #2563eb */;}[hover\\:text-blue-600=""]:hover{--un-text-opacity:1;color:rgb(37 99 235 / var(--un-text-opacity)) /* #2563eb */;}.transition-colors,[transition-colors=""]{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}';
  const attachStyle = (node) => {
    node.append(base.cloneNode(true), unoStyle.cloneNode(true));
  };
  const _sfc_main$2 = defineVaporComponent({
    __name: "ShadowTeleport",
    props: {
      to: { type: [String, Boolean, null, Function] },
      style: { type: [Boolean, null, String, Object, Array] }
    },
    setup(__props) {
      const props = __props;
      let alive = true;
      onScopeDispose(() => alive = false);
      const target = shallowRef();
      const applyStyleValue = (t2, s, depth = 0) => {
        if (!s) {
          if (depth === 0) {
            t2.style = "";
          }
        } else if (typeof s === "string") {
          t2.style = s;
        } else if (s instanceof Array) {
          s.forEach((s2) => {
            applyStyleValue(t2, s2, depth + 1);
          });
        } else {
          Object.entries(s).forEach(([name2, value]) => {
            Reflect.set(t2.style, name2, value);
          });
        }
      };
      watchEffect(() => {
        const t2 = target.value?.[1];
        if (!t2) return;
        applyStyleValue(t2, props.style);
      });
      const removeDom = () => {
        if (!target.value) return;
        const [t2, c] = target.value;
        t2.removeChild(c);
        target.value = void 0;
      };
      const addDom = (t2) => {
        removeDom();
        const c = document.createElement("div");
        c.dataset.name = pkg.name;
        const shadowRoot2 = t2.appendChild(c).attachShadow({ mode: "open" });
        attachStyle(shadowRoot2);
        target.value = [t2, c, shadowRoot2];
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
      onMounted(async () => {
        while (alive) {
          const t2 = selector();
          if (t2 && t2 !== target.value?.[0]) {
            addDom(t2);
          } else if (!t2) {
            removeDom();
          }
          await new Promise((r) => setTimeout(r, 1e3));
        }
      });
      onUnmounted(removeDom);
      const n0 = createIf(() => target.value, () => {
        const n3 = createComponent(VaporTeleportImpl, { to: () => target.value[2] }, {
          "default": () => {
            const n2 = createSlot("default");
            return n2;
          }
        }, true);
        return n3;
      });
      return n0;
    }
  });
  const loading = '<svg viewBox="0 0 24 24">\n  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">\n    <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">\n      <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />\n      <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate"\n        values="0 12 12;360 12 12" />\n    </path>\n    <path stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity=".3"\n      d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z">\n      <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />\n    </path>\n  </g>\n</svg>';
  const __vite_glob_0_0 = Object.freeze( Object.defineProperty({
    __proto__: null,
    default: loading
  }, Symbol.toStringTag, { value: "Module" }));
  const t0$1 = template('<svg class="SvgIcon"></svg>', true);
  const modules = Object.assign({
    "../assets/svg/loading.svg": __vite_glob_0_0
  });
  const svgIconMap = (() => {
    const domParser = new DOMParser();
    return Object.fromEntries(
      Object.entries(modules).filter(([_, v]) => v.default.trim()).map(([k, v]) => [k.split("/").at(-1).split(".")[0], v.default]).map(([svgName, svgText]) => {
        const symbolEl = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "symbol"
        );
        const svgEl = domParser.parseFromString(
          svgText,
          "image/svg+xml"
        ).documentElement;
        Array.from(svgEl.attributes).forEach((attr) => {
          symbolEl.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
        });
        symbolEl.innerHTML = svgEl.innerHTML;
        return [svgName, symbolEl];
      })
    );
  })();
  const _sfc_main$1 = defineVaporComponent({
    __name: "SvgIcon",
    props: {
      name: {}
    },
    setup(__props) {
      const props = __props;
      const svgEl = computed(() => svgIconMap[props.name]);
      const actualEl = shallowRef();
      watchEffect(() => {
        const s = svgEl.value;
        const a2 = actualEl.value;
        if (!s || !a2) return;
        a2.replaceChildren(...s.cloneNode(true).childNodes);
      });
      const _setTemplateRef = createTemplateRefSetter();
      const n0 = createIf(() => svgEl.value, () => {
        const n2 = t0$1();
        _setTemplateRef(n2, actualEl, null, null, "actualEl");
        renderEffect(() => {
          setAttr(n2, "name", __props.name);
          setAttr(n2, "viewBox", svgEl.value.getAttributeNS(null, "viewBox") || void 0);
          setAttr(n2, "fill", svgEl.value.getAttribute("fill") || void 0);
        });
        return n2;
      });
      return n0;
    }
  });
  const useTask = (fn) => {
    let loading2 = false;
    const loadingRef = customRef((track, trigger) => {
      return {
        get() {
          track();
          return loading2;
        },
        set(value) {
          loading2 = value;
          trigger();
        }
      };
    });
    return {
      fn,
      get loading() {
        return loadingRef.value;
      },
      invoke: async (...args) => {
        if (loading2) return;
        let error;
        let finished = false;
        const task = fn(...args).catch((e) => {
          error = e;
        }).finally(() => {
          finished = true;
        });
        await new Promise((r) => setTimeout(r));
        if (finished) {
          if (error) throw error;
          return;
        }
        loadingRef.value = true;
        await task;
        loadingRef.value = false;
        if (error) throw error;
      }
    };
  };
  const t0 = template('<div flex items-center gap-4px><div text-xl cursor-pointer transition-colors text-blue-400 class="hover:text-blue-600"> </div></div>');
  delegateEvents("click");
  const _sfc_main = defineVaporComponent({
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
      const handler = useTask(async () => {
        const users = await getFans();
        if (users.length === 0) {
          setTimeout(() => window.alert("没有粉丝了"));
          return;
        }
        for (const user of users) {
          await removeFan(user.mid);
        }
        setTimeout(() => {
          location.reload();
        });
      });
      const n3 = createComponent(_sfc_main$2, {
        to: () => ".fans-main-title",
        style: () => "display: inline-flex; margin-left: 24px"
      }, {
        "default": withVaporCtx(() => {
          const n2 = t0();
          const n1 = child(n2, 1);
          setInsertionState(n2, 0, true);
          const n0 = createComponent(_sfc_main$1, {
            name: () => "loading",
            "h-20px": () => "",
            "transition-colors": () => "",
            class: () => unref(handler).loading ? `text-blue` : `text-transparent`
          });
          const x1 = txt(n1);
          n1.$evtclick = (e) => unref(handler).invoke(e);
          renderEffect(() => setText(x1, toDisplayString(unref(handler).loading ? `移除中` : `移除全部粉丝`)));
          return n2;
        })
      }, true);
      return n3;
    }
  });
  const container = document.body.appendChild(document.createElement("div"));
  container.dataset.name = pkg.name;
  const shadowRoot = container.attachShadow({ mode: "open" });
  attachStyle(shadowRoot);
  createVaporApp(_sfc_main).mount(
    shadowRoot.appendChild(document.createElement("div"))
  );

})();