var Resolver = require('y-resolver'),
    define = require('u-proto/define'),

    resolvers = Symbol(),
    available = Symbol(),

    Lock;

function Lock(n){
  if(!arguments.length) n = 1;
  else n = n >= 0 ? n : 0;

  this[resolvers] = [];
  this[available] = n;
}

Lock.prototype[define]({

  give: function(n){
    var resolver;

    if(!arguments.length) n = 1;
    else n = n >= 0 ? n : 0;

    if(!this[resolvers].length){
      this[available] += n;
      return;
    }

    this[resolvers][0].n -= n;
    if(this[resolvers][0].n <= 0){
      n = this[resolvers][0].n;
      resolver = this[resolvers][0].resolver;

      this[resolvers].shift();
      resolver.accept();

      this.give(-n);
    }

  },

  take: function(n){
    var resolver = new Resolver();

    if(!arguments.length) n = 1;
    else n = n >= 0 ? n : 0;

    n -= this[available];
    if(n <= 0){
      this[available] = -n;
      resolver.accept();
      return resolver.yielded;
    }

    this[available] = 0;
    this[resolvers].push({
      resolver: resolver,
      n: n
    });

    return resolver.yielded;
  }

});

/*/ exports /*/

module.exports = Lock;
