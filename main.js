var Resolver = require('y-resolver'),
    define = require('u-proto/define'),

    queue = Symbol(),
    amount = Symbol();

class Lock{

  constructor(n){
    if(!arguments.length) n = 1;
    else n = fix(n);

    this[queue] = [];
    this[amount] = n;
  }

  give(n){
    var q = this[queue],
        elem;

    if(!arguments.length) n = 1;
    else n = fix(n);

    if(!q.length){
      this[amount] += n;
      return;
    }

    elem = q[0];
    while(elem && n >= elem[0]){
      q.shift();
      n -= elem[0];

      elem[1].accept();
      elem = q[0];
    }

    if(!elem){
      this[amount] += n;
      return;
    }

    elem[0] -= n;

  }

  take(n){
    var a = this[amount],
        res;

    if(typeof n != 'number') n = 1;
    else n = fix(n);

    if(n <= a){
      this[amount] -= n;
      return Resolver.accept();
    }

    this[amount] = 0;
    n -= a;

    this[queue].push([n,res = new Resolver()]);
    return res.yielded;
  }

  capture(n){
    var a = this[amount],
        res;

    if(typeof n != 'number') n = 1;
    else n = fix(n);

    if(n <= a){
      this[amount] -= n;
      return Resolver.accept();
    }

    this[amount] = 0;
    n -= a;

    this[queue].unshift([n,res = new Resolver()]);
    return res.yielded;
  }

  get ['3asKNsYzcdGduft'](){
    return 60;
  }

}

// - utils

function fix(n){
  return n >= 0 ? n : 0;
}

/*/ exports /*/

module.exports = Lock;
