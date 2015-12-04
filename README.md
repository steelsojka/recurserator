Recurserator
============

Recurserator is a set of **recurs**ive gen**erator**s for recursively accessing an object.

Install
-------

`npm install --save recurserator`

Usage
-----

Recurserator does not have a single default export. Instead you can import the generator you need.

`import recurse from 'recurserator/recurse'`

API
---
<a name="recurseTree"></a>
## recurseTree(object, filter, traverseFilter, path, parent) ⇒ <code>Iterator</code>
Recursively accesses all keys of an object and sub objects. What values are yielded and what values are accessed
can be determined by the two seperate filter arguments. This allows for lots of different compositions. The yielded
value is an array of with these values `[key, value, path, parent]`.
 
| Param          | Type                  | Description                                                           |
| -------------- | --------------------- | --------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                      |
| filter         | <code>Function</code> | A function that determines whether a value is yielded                 |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion |
| path           | <code>String</code>   | The path to the current object from the root object                   |
| parent         | <code>Object</code>   | The parent object                                                     |

### Example

```javascript
import recurseTree from 'recurserator/recurseTree';

const data = {
  value1: 10,
  aList: [{
    listKey: 'HI!'
  }],
  nested: {
    anotherNested: {
    }
  }
};

for (let [key, value, path, parent] of recurseTree(data)) {
  //=> ['value1', 10, 'value1', data]
  //=> ['aList', [...], 'aList', data]
  //=> ['0', {...}, 'aList[0]', data.aList]
  //=> ['listKey', 'Hi!', 'aList[0].listKey', data.aList[0]]
  //=> ['nested', {...}, 'nested', data]
  //=> ['anotherNested', {...}, 'nested.anotherNested', data.nested]
}

// Yield array value but don't access them

const truth = () => true;
const notArray = item => !Array.isArray(item);

for (let [key, value, path, parent] of recurseTree(data, truth, notArray) {
  //=> ['value1', 10, 'value1', data]
  //=> ['aList', [...], 'aList', data]
  //=> ['nested', {...}, 'nested', data]
  //=> ['anotherNested', {...}, 'nested.anotherNested', data.nested]
}

// Only yield objects

for (let [key, value, path, parent] of recurseTree(data, isObject) {
  //=> ['aList', [...], 'aList', data]
  //=> ['0', {...}, 'aList[0]', data.aList]
  //=> ['nested', {...}, 'nested', data]
  //=> ['anotherNested', {...}, 'nested.anotherNested', data.nested]
}
```

<a name="recurseTree.keys"></a>
## recurseTree.keys(object, filter, traverseFilter, path, parent) ⇒ <code>Iterator</code>
Same arguments as `recurseTree`. Yields only the key value.
 
| Param          | Type                  | Description                                                           |
| -------------- | --------------------- | --------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                      |
| filter         | <code>Function</code> | A function that determines whether a value is yielded                 |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion |
| path           | <code>String</code>   | The path to the current object from the root object                   |
| parent         | <code>Object</code>   | The parent object                                                     |

### Example
```javascript

for (let key of recurseTree.keys(data)) {
  //=> 'value1'
  //=> 'aList'
  //=> '0'
  //=> 'listKey'
  //=> 'nested'
  //=> 'anotherNested'
}
```

<a name="recurseTree.values"></a>
## recurseTree.values(object, filter, traverseFilter, path, parent) ⇒ <code>Iterator</code>
Same arguments as `recurseTree`. Yields only the value.
 
| Param          | Type                  | Description                                                           |
| -------------- | --------------------- | --------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                      |
| filter         | <code>Function</code> | A function that determines whether a value is yielded                 |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion |
| path           | <code>String</code>   | The path to the current object from the root object                   |
| parent         | <code>Object</code>   | The parent object                                                     |

### Example
```javascript

for (let value of recurseTree.values(data)) {
  //=> 10
  //=> [...]
  //=> {...}
  //=> 'Hi!'
  //=> {...}
  //=> {...}
}
```

<a name="recurseTree.paths"></a>
## recurseTree.paths(object, filter, traverseFilter, path, parent) ⇒ <code>Iterator</code>
Same arguments as `recurseTree`. Yields only the path.
 
| Param          | Type                  | Description                                                           |
| -------------- | --------------------- | --------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                      |
| filter         | <code>Function</code> | A function that determines whether a value is yielded                 |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion |
| path           | <code>String</code>   | The path to the current object from the root object                   |
| parent         | <code>Object</code>   | The parent object                                                     |

### Example
```javascript

for (let path of recurseTree.paths(data)) {
  //=> 'value1'
  //=> 'aList'
  //=> 'aList[0]'
  //=> 'aList[0].listKey'
  //=> 'nested'
  //=> 'nested.anotherNested'
}
```
