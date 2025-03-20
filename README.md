# weld.js

[![Build Status](https://travis-ci.org/pimbrouwers/weld.js.svg?branch=master)](https://travis-ci.org/pimbrouwers/weld.js)
[![npm Version](https://img.shields.io/npm/v/weld.js.svg)](https://www.npmjs.com/package/weld.js)
[![npm License](https://img.shields.io/npm/l/weld.js.svg)](https://www.npmjs.com/package/weld.js)
[![npm Downloads](https://img.shields.io/npm/dm/weld.js.svg)](https://www.npmjs.com/package/weld.js)

Declarative DOM bindings for great good.

> Don't select it, [weld](https://github.com/pimbrouwers/weld.js) it.

## Getting Started

One of the first things you learn after spending some time with JavaScript is that DOM selectors are tricky. We often rely on classes and sometimes id's for this. Creating this invisible association between your CSS and JavaScript, which becomes a maintenance nightmare. Especially troublesome for teams, and onboarding new developers.

> We essentially ask CSS selectors to also become "JavaScript hooks", which violates one of the core tenants of software developent, single-responsibility principle.

### CDN

```html
<script src="https://unpkg.com/weld.js/weld.js"></script>
```

### npm

```bash
npm install weld.js --save
```

## Usage

Attaching functionality to DOM elements is achieved using the custom attribute `wd-bind="name"`, where "name" is the identifer for a binder defined using `weld.bind()`.

```html
<!-- a basic binding -->
<div wd-bind="greet"></div>
<script>
    weld.bind('greet', function (el) {
        el.innerHTML = 'Hello world'
    })

    weld.apply()
</script>
```

You can also pass parameters to the binder using the `wd-attr` attribute. This can be a string, integer, object literal, or JSON.

```html
<!-- passing a string -->
<div wd-bind="greetValue" wd-attr="pim"></div>

<!-- passing an integer  -->
<div wd-bind="greetValue" wd-attr="1"></div>

<!-- using an object literal -->
<div wd-bind="greetComplex" wd-attr="{name:'pim'}"></div>

<!-- using JSON -->
<div wd-bind="greetComplex" wd-attr='{"name":"pim"}'></div>

<script>
    weld.bind('greetValue', function (el, attr) {
        const message = 'Hello ' + attr
        el.innerHTML = message
    })

    weld.bind('greetComplex', function (el, attr) {
        const message = 'Hello ' + attr.name
        el.innerHTML = message
    })

    weld.apply()
</script>
```

Declaratively define named targets using the `wd-target` attribute. This gives you keyed access to elements within the binding scope.

```html
<!-- designating a named target -->
<div wd-bind="greetTarget: pim">
    <div wd-target=greeting></div>
</div>

<!-- using multiple attrbutes and targets -->
<div wd-bind="greetMulti" wd-attr="{name:'pim', greeting:'Howdy', intVal: 1, boolVal: true}">
    <div>
        <span wd-target=greeting></span>
        <span wd-target=name></span>
    </div>
</div>

<script>
    weld.bind('greetTarget', (el, attr, targets) => {
        const message = 'Hello ' + attr
        targets.greeting ?
            targets.greeting.innerHTML = message :
            el.innerHTML = message
    })

    weld.bind('greetMulti', (el, attr, targets) => {
        const greeting = attr.greeting ? attr.greeting : "Hello"
        const name = attr.name ? attr.name : "world"
        targets.greeting.innerHTML = greeting
        targets.name.innerHTML = name
    })

    weld.init()
</script>
```

## Working with the DOM

Weld comes with a few utilies to make creating and manipulating DOM elements easier.

### Creating Elements

The first is `weld.el()` which creates a new element. The first argument is the tag name, and the second is an object literal of attributes. Attributes can contrain id, class, data attributes and event listeners. Object keys prefixed with `on` with function values are automatically added as event listeners.

```js
const button = weld.el('button', {
    id: 'myButton',
    class: 'myClass',
    textContent: 'Click me',
    onclick: () => alert('Hello world')
})

button.outerHTML // <button id="myButton" class="myClass">Click me</button>
button.click() // alerts 'Hello world'
```

There is also some shortcuts to make common tasks, like assigning IDs, classes and text content. Below is the same example as above, but using the shortcuts.

```js
const button = weld.el('button#myButton#myClass', 'Click me', {
    onclick: () => alert('Hello world') })
```

### Manipulating Elements

When manipulating element content, you are typically either appending content or replacing it. Weld provides two functions for this, `weld.dom.append()` and `weld.dom.set()`. Both functions take an element as the first parameter and one or more elements as the second parameter.

```js
const container = weld.el('div')
const button = weld.el('button', 'Click me', { onclick: () => alert('Hello world') })

weld.dom.set(container, button)
container.outerHTML // <div><button>Click me</button></div>

const para = weld.el('p', 'Hello world')
weld.dom.append(container, para)
container.outerHTML // <div><button>Click me</button><p>Hello world</p></div>
```

### Finding Elements

There is a utility function for finding a single element (first match) or multiple elements (all matches) using a CSS selector. `weld.dom.get()` and `weld.dom.find()` respectively.

```js
const container = weld.el('div')
weld.dom.append(container, weld.el('div.classfind'))
weld.dom.append(container, weld.el('div.classfind'))

const first = weld.dom.get(container, 'div.classfind')
const all = weld.dom.find(container, 'div.classfind')
```

## Examples

### Lazy Loading Images

```html
<img wd-bind="lazyLoad" wd-attr="image.jpg" src="placeholder.jpg">
<script>
    weld.bind('lazyLoad', function (el, src) {
        const originalSrc = el.getAttribute('src')
        el.setAttribute('src', src)
        el.onerror = () => el.setAttribute('src', originalSrc)
    })
    weld.apply()
</script>
```

## Usage with JavaScript Frameworks

Many JavaScript frameworks typically angle their value proposition toward single-page application (SPA) development. But many of them are actually extremely viable options for multi-page application (MPA) development as well. Think of these as server-side application with ~sprinklings~ of JavaScript enhancements.

When building a SPA we create a root element, `<div id="root"></div>`, pass it to our framework of choice and it takes over from there. Effectively eliminating the brittle CSS<->JS relationship. But in MPA development, there isn't a clean entry-point like this, since the markup is primarily generated server-side. Thus, we often turn to using existing (or creating new) classes to begin attaching our JavaScript logic.

Instead, using _weld_ we can declaratively inject our components removing any reliance on selectors for activation.

We **love** [mithril.js](https://mithril.js.org/), so to demonstrate the concept, we'll use it in the following example.

```html
<div wd-bind="greet: 'pim'"></div>

<script src="./mithril.min.js"></script>
<script src="../weld.min.js"></script>
<script>
    // A mithril component
    function HelloWorld() {
        let count = 0

        function OnClick() {
            count++
        }

        return {
            view: function(vnode){
                var msg = 'Hello ' + vnode.attrs.name
                return m('div', [
                    m('p', `${msg}. You clicked the button ${count} times.`),
                    m('button', { onclick: OnClick }, 'Click me',),
                ])
            }
        }
    }

    // Bind the greet attribute to the HelloWorld component
    weld.bind('greet', function (el, name) {
        m.mount(el, { view: () => m(HelloWorld, { name: name }) })
    })

    weld.apply()
</script>
```

## Find a bug?

There's an [issue](https://github.com/pimbrouwers/weld.js/issues) for that.

## License

Licensed under [Apache License 2.0](https://github.com/pimbrouwers/weld.js/blob/master/LICENSE).
