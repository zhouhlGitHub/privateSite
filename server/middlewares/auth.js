'use strict';
export default function() {
  return function* (next) {
    if (!this.session || !this.session.user) {
      this.body = "会话失效！";
      return;
    }
    yield next;
  }
}
