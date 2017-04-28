Recurserator
============

Recurserator is a set of **recurs**ive gen**erator**s for recursively accessing an object.

[![npm version](https://badge.fury.io/js/recurserator.svg)](https://badge.fury.io/js/recurserator)

Install
-------

`npm install --save recurserator`


Usage
-----

`import RecursionBuilder from 'recurserator';`

You can also use named imports.

`import { RecursionBuilder } from 'recurserator';`

API
---
<a name="RecursionBuilder"></a>
## RecursionBuilder(object, options) ⇒ <code>RecursionBuilder</code>
The RecursionBuilder builds a recursive alogorithm and iterates using that algorithm. Arguments are optional and can be supplied through a building pattern.
A RecursionBuilder instance itself is an iterable. RecursionBuilder objects are also immutable.
 
| Param                  | Type                  | Description                                                                                                                     |                                                          
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| object                 | <code>Object</code>   | The object to recursively access                                                                                                |
| options.yieldFilter    | <code>Function</code> | A function that determines whether a value is yielded                                                                           |
| options.traverseFilter | <code>Function</code> | A function that determines whether a value is accessed with recursion                                                           |
| options.entryExtractor | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |
| options.childExtractor | <code>Function</code> | A function that extracts the next item to iterate over                                                                          |

### Example

```javascript
import { RecursionBuilder } from 'recurserator';

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

const builder = RecursionBuilder.create(data);

for (let [key, value, path, parent] of builder) {
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

for (let [key, value, path, parent] of builder.yieldOn(truth).traverseOn(notArray)) {
  //=> ['value1', 10, 'value1', data]
  //=> ['aList', [...], 'aList', data]
  //=> ['nested', {...}, 'nested', data]
  //=> ['anotherNested', {...}, 'nested.anotherNested', data.nested]
}

// Only yield objects

for (let [key, value, path, parent] of builder.yieldOn(isObject)) {
  //=> ['aList', [...], 'aList', data]
  //=> ['0', {...}, 'aList[0]', data.aList]
  //=> ['nested', {...}, 'nested', data]
  //=> ['anotherNested', {...}, 'nested.anotherNested', data.nested]
}
```

<a name="RecursionBuilder.prototype.yieldOn"></a>
## RecursionBuilder.prototype.yieldOn(filter) ⇒ <code>RecursionBuilder</code>
Sets the yield filter property. This condition is called to test whether a value should be yielded.
Returns a new RecursionBuilder instance.
 
| Param          | Type                  | Description                                           |                                                          
| -------------- | --------------------- | ----------------------------------------------------- |
| filter | <code>Function</code> | A function that determines whether a value is yielded |

<a name="RecursionBuilder.prototype.traverseOn"></a>
## RecursionBuilder.prototype.traverseOn(filter) ⇒ <code>RecursionBuilder</code>
Sets the traverse filter property. This condition is called to test whether a value should be traversed.
Returns a new RecursionBuilder instance.
 
| Param          | Type                  | Description                                                           |                                                          
| -------------- | --------------------- | --------------------------------------------------------------------- |
| filter | <code>Function</code> | A function that determines whether a value is accessed with recursion |

<a name="RecursionBuilder.prototype.readNext"></a>
## RecursionBuilder.prototype.extractor(extractor) ⇒ <code>RecursionBuilder</code>
Sets the read next property. When this method is provided, instead of traversing to the next key. This method will be called
to determine what the child of the value should be.
Returns a new RecursionBuilder instance.
 
| Param     | Type                         | Description                                           |                                                          
| --------- | ---------------------------- | ----------------------------------------------------- |
| readNext | <code>Function|String</code> | A function that returns the next item to iterate over |

<a name="RecursionBuilder.prototype.readEntry"></a>
## RecursionBuilder.prototype.readEntry(fn) ⇒ <code>RecursionBuilder</code>
Sets the extractor property. Used to extract key/value pair from an object. Defaults to `entries` iterator if it exists.
Returns a new RecursionBuilder instance.
 
| Param          | Type                  | Description                                                                                                                     |                                                          
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| readEntry | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |

<a name="RecursionBuilder.prototype.clone"></a>
## RecursionBuilder.prototype.clone(newState = {}) ⇒ <code>RecursionBuilder</code>
Clones the builder object merging in the new state.
 
| Param    | Type                | Description           |                                                          
| -------- | ------------------- | --------------------- |
| newState | <code>RecursionBuilderState</code> | New state to merge in |

<a name="RecursionBuilder.create"></a>
## RecursionBuilder.create(object?, options?) ⇒ <code>RecursionBuilder</code>
Creates a RecursionBuilder.
 
| Param                  | Type                  | Description                                                                                                                     |                                                          
| ---------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| object                 | <code>Object</code>   | The object to recursively access                                                                                                |
| options.yieldOn    | <code>Function</code> | A function that determines whether a value is yielded                                                                           |
| options.traverseOn | <code>Function</code> | A function that determines whether a value is accessed with recursion                                                           |
| options.readEntry | <code>Function</code> | A function that extracts the key/value pair from an object. Defaults to the `entries` method or own enumerable keys for objects |
| options.readNext | <code>Function</code> | A function that extracts the next item to iterate over                                                                          |

<a name="RecursionBuilder.prototype.recurse"></a>
## RecursionBuilder.prototype.recurse(object?) ⇒ <code>Iterable</code>
Runs the recursion algorithm on the provided data object.
 
| Param                  | Type                  | Description                      |                                                          
| ---------------------- | --------------------- | ---------------------------------|
| object                 | <code>Object</code>   | The object to recursively access |

<a name="RecursionBuilder.prototype.keys"></a>
## RecursionBuilder.prototype.keys(object?) ⇒ <code>Iterable</code>
Runs the recursion algorithm on the provided data object. Yields only keys. If no object is provided the storage object in the builder will be used.
 
| Param                  | Type                  | Description                      |                                                          
| ---------------------- | --------------------- | ---------------------------------|
| object                 | <code>Object</code>   | The object to recursively access |

<a name="RecursionBuilder.prototype.values"></a>
## RecursionBuilder.prototype.values(object?) ⇒ <code>Iterable</code>
Runs the recursion algorithm on the provided data object. Yields only values. If no object is provided the storage object in the builder will be used.
 
| Param                  | Type                  | Description                      |                                                          
| ---------------------- | --------------------- | ---------------------------------|
| object                 | <code>Object</code>   | The object to recursively access |

<a name="RecursionBuilder.prototype.paths"></a>
## RecursionBuilder.prototype.paths(object?) ⇒ <code>Iterable</code>
Runs the recursion algorithm on the provided data object. Yields only paths. If no object is provided the storage object in the builder will be used.
 
| Param                  | Type                  | Description                      |                                                          
| ---------------------- | --------------------- | ---------------------------------|
| object                 | <code>Object</code>   | The object to recursively access |

<a name="RecursionBuilder.prototype.parents"></a>
## RecursionBuilder.prototype.parents(object?) ⇒ <code>Iterable</code>
Runs the recursion algorithm on the provided data object. Yields only parents. If no object is provided the storage object in the builder will be used.
 
| Param                  | Type                  | Description                      |                                                          
| ---------------------- | --------------------- | ---------------------------------|
| object                 | <code>Object</code>   | The object to recursively access |
