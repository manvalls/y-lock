var Resolver = require('y-resolver'),
    Su = require('u-su'),

    resolvers = Su(),
    available = Su(),

    Lock;

module.exports = Lock = function Lock(n){
  if(!arguments.length) n = 1;
  else n = n >= 0 ? n : 0;

  this[resolvers] = [];
  this[available] = n;
}

Object.defineProperties(Lock.prototype,{

  give: {value: function(n){
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

  }},

  take: {value: function(n){
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
  }}

});
