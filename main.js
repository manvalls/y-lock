var Resolver = require('y-resolver'),
    Su = require('u-su'),

    resolvers = Su(),
    available = Su(),

    Lock;

module.exports = Lock = function Lock(n){
  this[resolvers] = [];
  this[available] = typeof n == 'number' ? n : 1;
}

Object.defineProperties(Lock.prototype,{

  give: {value: function(n){
    var resolver;

    if(n == null) n = 1;

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

    if(n == null) n = 1;
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
