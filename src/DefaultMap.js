// TEAM: frontend_infra
// WATCHERS: zgotsch
// @flow

import {invariant} from "./utils";

export default class DefaultMap<K, V> {
  inner: Map<K, V>;

  initializer: K => V;

  constructor(initializer: K => V) {
    this.inner = new Map();
    this.initializer = initializer;
  }

  get(key: K): V {
    if (this.inner.has(key)) {
      const val = this.inner.get(key);
      invariant(val, "Missing value after has() check");
      return val;
    }
    return this.initializer(key);
  }

  set(key: K, value: V): DefaultMap<K, V> {
    this.inner.set(key, value);
    return this;
  }

  update(key: K, updater: V => V): DefaultMap<K, V> {
    this.set(key, updater(this.get(key)));
    return this;
  }

  delete(key: K) {
    return this.inner.delete(key);
  }

  // Returns true if there is a key in the inner dict
  hasExplicitly(key: K) {
    return this.inner.has(key);
  }
}
