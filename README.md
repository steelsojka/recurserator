Recurserator
============

Recurserator is a set of **recurs**ive gen**erator**s for recursively accessing an object.

[![npm version](https://badge.fury.io/js/recurserator.svg)](https://badge.fury.io/js/recurserator)

Install
-------

`npm install --save recurserator`


Usage
-----

The default export is the `recurseTree` generator.

`import recurse from 'recurserator';`

You can also use named imports.

`import { recurseTree, recurseExtract } from 'recurserator';`

Or you can import the generator you want.

`import recurseTree from 'recurserator/recurseTree';`

Recurserator requires an ES2015 environment to work. It will not set one up for you! The current version
will require the [Babel Polyfill](https://babeljs.io/docs/usage/polyfill/) for the [Regenerator Runtime](https://github.com/facebook/regenerator).

If you are running in an environment that natively supports generators then you can import modules from the `native` module.

`import recurseTree from 'recurserator/native/recurseTree';`

API
---
<a name="recurseTree"></a>
## recurseTree(object, yieldFilter, traverseFilter, entryExtractor) ⇒ <code>Iterator</code>
Recursively accesses all keys of an object and sub objects. What values are yielded and what values are accessed
can be determined by the two seperate filter arguments. This allows for lots of different compositions. The yielded
value is an array of with these values `[key, value, path, parent]`.
 
| Param          | Type                  | Description                                                                                                                     |                                                          
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                                                                                |
| yieldFilter    | <code>Function</code> | A function that determines whether a value is yielded                                                                           |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion                                                           |
| entryExtractor | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |

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
## recurseTree.keys(object, yieldFilter, traverseFilter, entryExtractor) ⇒ <code>Iterator</code>
Same arguments as `recurseTree`. Yields only the key value.
 
| Param          | Type                  | Description                                                                                                                     |                                                          
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                                                                                |
| yieldFilter    | <code>Function</code> | A function that determines whether a value is yielded                                                                           |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion                                                           |
| entryExtractor | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |

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
## recurseTree.values(object, yieldFilter, traverseFilter, entryExtractor) ⇒ <code>Iterator</code>
Same arguments as `recurseTree`. Yields only the value.
 
| Param          | Type                  | Description                                                                                                                     |                                                          
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                                                                                |
| yieldFilter    | <code>Function</code> | A function that determines whether a value is yielded                                                                           |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion                                                           |
| entryExtractor | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |

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
## recurseTree.paths(object, yieldFilter, traverseFilter, entryExtractor) ⇒ <code>Iterator</code>
Same arguments as `recurseTree`. Yields only the path.
 
| Param          | Type                  | Description                                                                                                                     |                                                          
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| object         | <code>Object</code>   | The object to recursively access                                                                                                |
| yieldFilter    | <code>Function</code> | A function that determines whether a value is yielded                                                                           |
| traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion                                                           |
| entryExtractor | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |

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

<a name="recurseExtract"></a>
## recurseExtract(extractor, object) ⇒ <code>Iterator</code>
Recurses a list of elements and calls the extractor method to get the next list to traverse.
This can be faster than recursing the entire tree and filtering the results.
 
| Param     | Type                         | Description                                                                                                                     |                                                          
| --------- | -----------------------------| ------------------------------------------------------|
| extractor | <code>Function|String</code> | A function that returns the next item to iterate over |
| items     | <code>Iterable</code>        | The list to recursively access                        |

### Example
```javascript

let data = {
  id: '1',
  children: [{
    id: 2,
    children: [{
      id: 4
    }]
  }, {
    id: 3
  }]
}

for (let value of recurseExtract(item => item.children, data)) {
  //=> data
  //=> data.children[0]
  //=> data.children[0].children[0]
  //=> data.children[1]
}
```
