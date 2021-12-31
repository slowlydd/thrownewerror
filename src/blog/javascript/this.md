# this 到底指向谁

this 的指向纷繁复杂，往往会让人感到迷惑。从优先级到显隐性，在日常开发的编码中，扮演着重要的角色。如果能灵活使用，往往会使代码灵活且简洁。

按照以下几条规则来确定 this 的指向:
+ new 绑定，如果是，指向返回的对象
+ call/apply/bind 绑定，指向传入的上下文对象
+ 方法调用，指向调用方法的对象
+ 直接调用，严格模式下指向 undefined，否则指向全局对象 window/global
+ 箭头函数中没有自己的 this，引用外层上下文绑定的 this，且不能被用作构造函数调用

规则从上到下，优先级依次降低。最后箭头函数比较特殊，不仅没有自己的 this，而且也不能进行构造函数调用（不能使用 new）。

下面从易到难看几个例子吧。

## 全局环境下的 this
```js
function fn1() {
  console.log(this)
}

function fn2() {
  'use strict'
  console.log(this)
}
fn1() // window
fn2() // undefined
```
可以看到，普通的函数调用，并没有指定 this 的指向，这种也被叫做隐式绑定。可以从例子中看到，在严格模式下，指向了 `undefined`；非严格模式下，在浏览器中执行则指向了 `window`。

需要注意的是作为回调函数调用的时候也是直接调用的一种，代码如下：
```js
var age = 27
setTimeout(function() {
  console.log(age) // 27
}, 1000)
```

## 方法调用中的 this
```js
const person = {
  age: 27,
  getAge: function() {
    console.log(this)
    console.log(this.age)
  }
}

person.getAge()
//{age: 27, getAge: ƒ}
// 27
```

可以看到，这里当函数作为对象的一个方法并进行方法调用的时候，函数中的 this 指向了调用方法的对象。以上两种情况都比较简单，但是这里还有一个需要注意的点，代码如下：
```js
var age = 26

const person = {
  age: 27,
  getAge: function() {
    console.log(this)
    console.log(this.age)
  }
}

const getAge = person.getAge
getAge()
// window
// 26
```
可以看到，当我们把对象的方法单独赋值的到一个变量的时候，直接调用的时候仍然指向 `window` 对象。

### 嵌套的方法调用
```js
const person = {
  age: 27,
  child: {
    age: 2,
    getAge: function() {
      console.log(this.age)
    }
  }
}

person.child.getAge() // 2
```
可以看到在这种嵌套的调用关系中，this 指向了最后调用函数的对象。

### call/apply/bind 改变 this 指向

三个函数都可以改变 this 的指向。call 与 apply 的区别，仅仅在于参数的不同，除了第一个参数为上下文对象（this 指向的对象），后续 `call` 是接受单个的参数，`apply` 接受一个数组。bind则与二者不同，bind直接返回一个函数。调用这个函数的时候，函数中的 this，为调用 bind 时的上下文对象。

用代码总结如下：
```js
const ctx = {}
fn.call(ctx, 'arg1', 'arg2')

// 等价于
fn.apply(ctx, ['arg1', 'arg2'])

// 等价于
fn.bind(ctx, 'arg1', 'arg2')()
```
下面是一个简单的例子：
```js
const person = {
  age: 27,
  getAge: function() {
    console.log(this.age)
  }
}

const person2 = {
  age: 24
}

console.log(person.getAge.call(person2)) // 24
```

## new 绑定
按照规则，函数由 new 调用，绑定到新创建的对象。看下面一段代码：
```js
const Person = function() {
  this.name = 'thrownewerror'
}

const p1 = new Person()
console.log(p1.name) // 'thrownewerror'
```

这里可以回顾一下 `new` 操作符到底做了什么事情：
+ 创建一个新的对象
+ 这个新对象会被执行 `[[Prototype]]` 连接
+ 将构造函数的 this 指向这个对象
+ 如果函数没有返回对象，那么 `new` 表达式中的函数会自动返回这个新对象。如果返回值是对象，则返回这个对象。

很明显上面的代码中的函数就没有返回对象，所以用 `new` 调用的时候，就会按照上述的操作步骤将绑定到 this 的新对象返回。

不得不说，当函数返回一个对象时，`new` 的绑定失效。

```js
const Person = function() {
  this.name  = 'thrownewerror'
  return {
    name: 'throw new error'
  }
}

new Person().name // throw new error
```

## 箭头函数中的 this

按照规则里边讲的，箭头函数没有自己的this，且不能被用做构造函数调用。请看如下代码：

```js
const Person = () => {
  this.name = 'thrownewerror'
}

window.name

new Person()
// Uncaught TypeError: Person is not a constructor
//     at <anonymous>:5:1



```
可以看到，在 chrome 控制台中会报错。这就表明箭头函数不能被用作构造函数调用。

还记得之前那个 `setTimeout` 的例子吗？

```js
var name = 'thrownewerror'
setTimeout(function() {
  console.log(this.name) // 隐式绑定到 window throwerror
}, 1000)
```
改造一下上述的例子：
```js
var name = 'thrownewerror'
const person = {
  name: 'throw new error',
  getName: function() {
    setTimeout(() => {
      console.log(this.name)
    }, 1000)
  }
}

person.getName() // 'throw new error'
```

分析一下下，这里 `person.getName` 很明显是一个方法调用，函数 `getName` 中的 `this` 指向了 `person` 对象。因为 `setTimeout` 中的回调函数是一个箭头函数，根据规则，箭头函数没有自己的 this，而是引用外层上下文的 this，也就是 `person` 对象。

## 绑定的优先级

### new 绑定与 bind 显示绑定
当仅仅使用 bind 显式指定函数的调用的上下问对象时，this 便指向 bind 调用时指定的上下文对象。这不难得出结果。但是如果我们再用 new 来调用 bind 返回的函数哪？
```js
const Person = function(name) {
  this.name = name
}
const ming = {}
const fn = Person.bind(ming)
fn('ming')
console.log(ming.name) // 'ming'
const ling = new fn('ling')
console.log(ling.name) // 'ling'
```
从以上代码可以看出，使用 `new` 时候，即使通过 `bind` 指定了 `this` 为 `ming` 这个对象也无济于事，仍然会被 `new` 绑定传入的参数改变。

### 显示绑定与隐式绑定
```js
const ming = {
  age: 27,
  getAge: function() {
    console.log(this.age)
  }
}

const ling = {
  age: 25,
  getAge: function() {
    console.log(this.age)
  }
}

ming.getAge.call(ling) // 25
ling.getAge.call(ming) // 27
```

这里可以看出，当通过 `ming.getAge` 调用函数 `getAge` 时，`this` 会被隐式绑定到 `ming` 这个对象上，但是通过 `call` 显示改变 `this` 指向后，`this` 便指向了 `ling`，所以第一个结果是 `25`。

