# weld.js

[![Build Status](https://travis-ci.org/pimbrouwers/weld.js.svg?branch=master)](https://travis-ci.org/pimbrouwers/weld.js)
[![npm Version](https://img.shields.io/npm/v/weld.js.svg)](https://www.npmjs.com/package/weld.js)
[![npm License](https://img.shields.io/npm/l/weld.js.svg)](https://www.npmjs.com/package/weld.js)
[![npm Downloads](https://img.shields.io/npm/dm/weld.js.svg)](https://www.npmjs.com/package/weld.js)

Declarative DOM bindings for great good. And it only costs you **998 bytes**.

> Don't select it. [Weld](https://github.com/pimbrouwers/weld.js) it.

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

Attaching functionality to DOM elements is achieved using the custom attribute `data-weld="binderName: ..."`, where "binderName" is the identifer for a binder defined using `weld.addBinder()`.

```html
<!-- a basic binding -->
<div data-bind="greet"></div>

<!-- passing a string -->
<div data-bind="greetString: pim"></div>

<!-- passing an integer  -->
<div data-bind="greetString: 1"></div>

<!-- designating a named target -->
<div data-bind="greetTarget: pim">
    <div data-target=greeting></div>
</div>

<!-- using an object literal -->
<div data-bind="greetObject: {name:'pim'}"></div>

<!-- using multiple attrbutes -->
<div data-bind="greetMulti: {name:'pim', greeting:'Howdy', intVal: 1, boolVal: true}">
    <div>
        <span data-target=greeting></span>
        <span data-target=name></span>
    </div>
</div>

<script src="weld.js"></script>

<!-- define our bindings -->
<script>
    weld.bind('greet', function (el) {
        el.innerHTML = 'Hello world'
    })

    weld.bind('greetString', function (el, attr) {
        const message = 'Hello ' + attr
        el.innerHTML = message
    })

    weld.bind('greetTarget', function (el, attr, targets) {
        const message = 'Hello ' + attr
        targets.greeting ?
            targets.greeting.innerHTML = message :
            el.innerHTML = message
    })

    weld.bind('greetObject', function (el, attr) {
        const message = 'Hello ' + attr.name
        el.innerHTML = message
    })

    weld.bind('greetMulti', function (el, attr, targets) {
        const greeting = attr.greeting ? attr.greeting : "Hello"
        const name = attr.name ? attr.name : "world"
        targets.greeting.innerHTML = greeting
        targets.name.innerHTML = name
    })

    weld.init()
</script>
```

## Usage with modern JavaScript Frameworks

Many of the modern JavaScript frameworks, which typically angle their value proposition toward single-page application (SPA) development. But many of them are actually extremely viable options for multi-page application (MPA) development as well. Think of these as server-side application with ~sprinklings~ of JavaScript enhancements.

When building a SPA we create a root element, `<div id="root"></div>`, pass it to our framework of choice and it takes over from there. Effectively eliminating the brittle CSS<->JS relationship. But in MPA development, there isn't a clean entry-point like this, since the markup is primarily generated server-side. Thus, we often turn to using existing (or creating new) classes to begin attaching our JavaScript logic.

Instead, using weld.js we can declaratively inject our components removing any reliance on selectors for activation.

### An example using [mithril.js](https://mithril.js.org/):

```html
<div data-bind="greet: 'pim'"></div>

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

    // Initialize weld
    weld.init()
</script>
```

## Why?

Take the trivial example of a client-side hello world greeter, which receives it's data (i.e. name) from the server.

### Using DOM selectors

```html
<!-- rest of DOM -->
<body>
  <script>var msg = 'pim';</script>
  <div id="hello-greeter"></div>

  <script>
    var greeter = document.getElementById('hello-greeter');
    if(greeter)
      greeter.innerText = 'hello ' + msg;
  </script>
</body>
<!-- rest of DOM -->
```

Notice how we're forced to create CSS taxonomy in order to facilitate discovery, and create a globally scoped ad hoc script tags to associate data from our server.

Now imagine we wanted multiple greeter elements. In order to do this, we need to update not only the JavaScript, but also the CSS. This could be a complete nightmare and it's often safer to create new classes and functionality altogether just to avoid breaking anything that might also be reliant on these.

```html
<!-- rest of DOM -->
<body>
  <script>var msg = 'pim';</script>
  <div class="hello-greeter"></div>

  <script>msg = 'jim';</script>
  <div class="hello-greeter"></div>

  <script>
    var greeters = document.getElementsByClassName('hello-greeter');
    if (greeters) {
      for (var i = 0; i < greeters.length; i++) {
        greeters[i].innerText = 'hello ' + msg;
      }
    }
  </script>
</body>
<!-- rest of DOM -->
```

That's not so bad. It's slightly more code, still reasonable though. But hang on... does this work? It looks accurate, but will it output what we think? The answer is no! If you attempt to run this sample, you'll see "hello jim" printed twice. This happens because second assignment to `msg` occurs before the JavaScript is executed.

We can solve this though, using `data-*` attributes.

```html
<!-- rest of DOM -->
<body>
  <div class="hello-greeter" data-msg="pim"></div>

  <div class="hello-greeter" data-msg="jim"></div>

  <script>
    var greeters = document.getElementsByClassName('hello-greeter');
    if (greeters) {
      for (var i = 0; i < greeters.length; i++) {

        var msg =
          greeters[i].hasAttribute('data-msg') ?
            greeters[i].getAttribute('data-msg') :
            'world';

        greeters[i].innerText = 'hello ' + msg;
      }
    }
  </script>
</body>
<!-- rest of DOM -->
```

Again, slightly more code than before. But still reasonable. Where this approach begins to fall apart though is when we need to start passing in more parameters, or more complex parameters. Imagine trying to pass in an entire object this way?

**This** is where weld.js comes to the rescue

By using weld.js we've created a _declarative_ way to associate JavaScript code to our DOM. The `hello` binding will only ever be one thing, a hook between our DOM and our JS. We've also now sandboxed our code within a closure, which is key to preventing leaky state.

So next time you think of reaching for a DOM selector... "weld it, don't select it!".

## Find a bug?

There's an [issue](https://github.com/pimbrouwers/weld.js/issues) for that.

## License

Licensed under [Apache License 2.0](https://github.com/pimbrouwers/weld.js/blob/master/LICENSE).
