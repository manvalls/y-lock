var Resolver = require('y-resolver'),
    define = require('u-proto/define'),

    queue = Symbol(),
    amount = Symbol();

function Lock(n){
  if(!arguments.length) n = 1;
  else n = fix(n);

  this[queue] = [];
  this[amount] = n;
}

Lock.prototype[define]({

  give: function(n){
    var q = this[queue],
        elem;

    if(!q.length){
      this[amount] += n;
      return;
    }

    elem = q[0];
    while(elem && n >= elem[0]){
      q.shift();
      n -= elem[0];

      elem[2].accept(elem[1]);
      elem = q[0];
    }

    if(!elem){
      this[amount] += n;
      return;
    }

    elem[0] -= n;

  },

  take: function(n,data){
    var a = this[amount],
        res;

    if(typeof n != 'number'){
      data = n;
      n = 1;
    }else n = fix(n);

    if(n <= a){
      this[amount] -= n;
      return Resolver.accept(data);
    }

    this[amount] = 0;
    n -= a;

    this[queue].push([n,data,res = new Resolver()]);
    return res.yielded;
  }

});

// - utils

function fix(n){
  return n >= 0 ? n : 0;
}

/*/ exports /*/

module.exports = Lock;
