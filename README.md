# Lock

## Sample usage

```javascript
var walk = require('y-walk'),
    wait = require('y-timers/wait'),
    Lock = require('y-lock'),
    
    lock = new Lock(),
    txt = '',
    waitAdd;

waitAdd = walk.wrap(function*(t,msg){
  yield lock.take();
  
  yield wait(t);
  txt += msg;
  
  lock.give();
});

waitAdd(500,'foo');
waitAdd(100,'bar');

walk(function*(){
  yield lock.take();
  console.log(txt); // foobar
});
```

