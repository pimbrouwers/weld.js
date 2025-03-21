# weld.js

[![build](https://github.com/eastcitysoftware/weld/actions/workflows/build.yml/badge.svg)](https://github.com/eastcitysoftware/weld/actions/workflows/build.yml)
[![npm Version](https://img.shields.io/npm/v/weld.js.svg)](https://www.npmjs.com/package/weld.js)
[![npm License](https://img.shields.io/npm/l/weld.js.svg)](https://www.npmjs.com/package/weld.js)
[![npm Downloads](https://img.shields.io/npm/dm/weld.js.svg)](https://www.npmjs.com/package/weld.js)

Declarative DOM bindings for great good. Don't select it, [weld](https://github.com/eastcitysoftware/weld) it.

```html
<div wd-bind="greeter" wd-attr="{ greeting: 'Hello' }">
    <div wd-target="output"></div>
    <input wd-target="input" placeholder="enter name">
</div>

<script>
    weld.bind('greeter', (el, attr, targets) => {
        const setGreeting = (name = 'world') =>
            weld.dom.set(targets.output, [
                `${attr.greeting} `,
                weld.el('strong', name)
            ]);

        setGreeting();

        weld.el(targets.input, {
            oninput: e => setGreeting(e.target.value)
        });
    });

    weld.apply()
</script>
```

## Introduction

The main goal of this library is to make it obvious where client-side behavior exists. And stop relying on CSS selectors to associate JavaScript functionality to the DOM. Providing only what is necessary and nothing more. It is not a replacement for a full-fledged JavaScript framework. But rather a tool to help you write better, more maintainable code for multi-page applications.

This is achieved by attaching functionality to DOM elements using the custom attribute `wd-bind="name"`, where "name" is the identifer for a binding defined using `weld.bind()`. Bindings can be passed parameters using the `wd-attr` attribute. Named targets can be designated using the `wd-target` attribute, giving you keyed access to elements within the binding scope.

## Getting Started

Weld is roughly 175LOC so you can easily [copy + paste](https://github.com/eastcitysoftware/weld/blob/master/weld.js) it in your project. But it's also available via npm and CDN.

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
        weld.el(el, 'Hello world')
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
        weld.el(el, message)
    })

    weld.bind('greetComplex', function (el, attr) {
        const message = 'Hello ' + attr.name
        weld.el(el, message)
    })

    weld.apply()
</script>
```

Declaratively define named targets using the `wd-target` attribute. This gives you keyed access to elements within the binding scope.

```html
<!-- designating a named target -->
<div wd-bind="greetTarget" wd-attr="pim">
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
            weld.el(targets.greeting, message) :
            weld.el(el, message)
    })

    weld.bind('greetMulti', (el, attr, targets) => {
        const greeting = attr.greeting ? attr.greeting : "Hello"
        const name = attr.name ? attr.name : "world"
        weld.el(targets.greeting, greeting)
        weld.el(targets.name, name)
    })

    weld.apply()
</script>
```

## Working with the DOM

Weld comes with a few utilies to make creating and manipulating DOM elements easier.

### Creating Elements

The first is `weld.el()` which is a DOM swiss army knife. It can create new elements and modify existing ones. When the first argument is a string literal tag name, a new element will be creating. Attributes are provided as an object literal and can include event listeners, denoted by prefixing the attribute name with `on`.

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
const button = weld.el('button#myButton.myClass', 'Click me', {
    onclick: () => alert('Hello world') })
```

`weld.el()` can also be used to augment existing elements. By passing an element as the first argument, the attributes and content are applied to the element. This is useful when working with named targets.

```html
<div wd-bind="counter" wd-attr="99">
    <p>You clicked the button <span wd-target="count">0</span> times</p>
    <button wd-target="clicker">Click me</button>
</div>
<script>
    weld.bind('counter', function (el, attr, targets) {
        let count = attr
        weld.el(targets.count, count)
        weld.el(targets.clicker, { onclick: () => {
            count++
            weld.el(targets.count, count)
        }})
    })

    weld.apply()
</script>
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
        weld.el(el, { src })
    })
    weld.apply()
</script>
```


### External Link Handler

```html
<main wd-bind=externalLink>
    <p>This is an external link: <a href="https://www.github.com/eastcitysoftware">click here</a>.</p>
    <p>If you click it a new tab will open. Click <a href="https://github.com/eastcitysoftware/weld">this one</a> to also open a new tab.</p>
</main>

<script>
    weld.bind('externalLink', function (el) {
        for (const anchor of weld.dom.find('a', el)) {
            if (anchor.href
                && anchor.href.startsWith('http')
                && !anchor.target === '_blank') {
                anchor.target = '_blank';
            }
        }
    });
    weld.apply()
</script>
```

## Usage with JavaScript Frameworks

Many JavaScript frameworks typically angle their value proposition toward single-page application (SPA) development. But many of them are actually extremely viable options for multi-page application (MPA) development as well. Think of these as server-side application with ~sprinklings~ of JavaScript enhancements.

When building a SPA we create a root element, `<div id="root"></div>`, pass it to our framework of choice and it takes over from there. Effectively eliminating the brittle CSS<->JS relationship. But in MPA development, there isn't a clean entry-point like this, since the markup is primarily generated server-side. Thus, we often turn to using existing (or creating new) classes to begin attaching our JavaScript logic.

Instead, using _weld_ we can declaratively inject our components removing any reliance on selectors for activation.

We **love** [mithril.js](https://mithril.js.org/), so to demonstrate the concept, we'll use it in the following example.

```html
<div wd-bind="counter" wd-attr="weld"></div>

<script src="https://unpkg.com/mithril@2.2.14/mithril.min.js"></script>
<script src="../weld.js"></script>
<script>
    // A mithril component
    function HelloWorld() {
        let count = 0

        function OnClick() {
            count++
        }

        return {
            view: function (vnode) {
                var msg = 'Hello ' + vnode.attrs.name
                return m('div', [
                    m('p', `${msg}. You clicked the button ${count} times.`),
                    m('button', { onclick: OnClick }, 'Click me',),
                ])
            }
        }
    }

    weld.bind('counter', function (el, name) {
        m.mount(el, { view: () => m(HelloWorld, { name: name }) })
    })

    weld.apply()
</script>
```

## Find a bug?

There's an [issue](https://github.com/eastcitysoftware/weld/issues) for that.

## License

Licensed under [Apache License 2.0](https://github.com/eastcitysoftware/weld/blob/master/LICENSE).
