
class OnceFuture {

  constructor(ms, cb) {
    this.ms = ms;
    this.cb = cb;
    this.runTime = () => ((this.res = this.cb()), this.timer = null);
    this.timer = setTimeout(this.runTime, this.ms);
  }

  cancel() {
    if (this.isDone()) { return false; }
    clearTimeout(this.timer);
    this.timer = undefined;
    return true;
  }
  // params if provided are passed to run callback
  finish(...params) {
    if (this.isDone()) { return false; }
    clearTimeout(this.timer);
    this.res = this.cb(...Array.from(params || []));
    this.timer = null;
    return true;
  }

  result() { return this.res; }

    // true if cancelled or finished
  isDone() { return (this.timer === undefined) || (this.timer === null); }
  isCancelled() { return this.timer === undefined; }
}

class ManyFuture {

  constructor(ms, maxRun, cb) {
    this.ms = ms;
    this.maxRun = maxRun;
    this.cb = cb;
    this.n = 0;    // run count
    this.runTime = () => {
      this.res = this.cb(); this.n++;
      if (this.n === this.maxRun) {
        if (this.finishCb) { this.finishCb(); }
        if (this.n === this.maxRun) { // @finishCb may have extended
          clearInterval(this.timer);
          return this.timer = null;
        }
      }
    };

    this.timer = setInterval(this.runTime, this.ms);
  }

  // < 0: infinite more times, = 0: no more, > 0 how many times
  _remainTimes() { return this.maxRun - this.n; }

  cancel() {
    if (this.isDone()) { return false; }
    clearInterval(this.timer);
    this.timer = undefined;
    return true;
  }
  // params if provided are passed to run callback
  finish(...params) {
    if (this.isDone()) { return false; }
    clearInterval(this.timer);
    this.res = this.cb(...Array.from(params || [])); this.n++;
    this.timer = null;
    return true;
  }

  finishAfter(n, finishCb) { this.finishCb = finishCb; return this.maxRun = this.n + n; }
  result() { return this.res; }

  // true if cancelled or finished
  isDone() { return (this.timer === undefined) || (this.timer === null); }
  isCancelled() { return this.timer === undefined; }

  resetInterval(ms) {
    this.ms = ms;
    if (this.timer) {
      clearInterval(this.timer);
      return this.timer = setInterval(this.runTime, this.ms);
    }
  }
}

let future = {

  sleep(ms) {
    return new Promise((resolve, reject)=>{
      setTimeout(resolve, ms);  
    })
  },
  
  once(msInFuture, runCb) {
    return new OnceFuture(msInFuture, runCb);
  },

  interval(msInterval, runCb) {
    return new ManyFuture(msInterval, -1, runCb);
  },

  timeoutWrap(msTimeout, fn, ctx) {
    if (ctx) { fn = fn.bind(ctx); }
    return (...args) => {
      const fargs = args.slice(0, args.length - 1), cb = args[args.length - 1];
      let called = false;
      const task = future.once(msTimeout, () => {
        if (!called) {
          called = true;
          return cb(new Error(`Timed out after ${msTimeout} ms`));
        }
      });
      return fn(...Array.from(fargs), (...cbargs) => {
        if (!called) {
          task.cancel();
          called = true;
          return cb(...Array.from(cbargs || []));
        }
      });
    };
  },

  loop(msPause, runCb) {
    let i = 0;
    var loopFuture = {
      _timer: null,
      cancel: () => {
        loopFuture._cancelled = true;
        if (loopFuture._timer) {
          loopFuture._timer.cancel();
          return loopFuture._timer = null;
        }
      }
    };
    var doloop = () => {
      if (!loopFuture._cancelled) { // allow cancel inside runCb
        return loopFuture._timer = future.once(msPause, () => {
          return runCb(i++, doloop);
        });
      }
    };
    doloop();
    return loopFuture;
  }

};

module.exports = future;
