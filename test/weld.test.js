const weld = require('../weld')

const createTestElement = (bindingName, bindingAttr) => {
    let props = { 'wd-bind': bindingName }

    if (bindingAttr) {
        props = Object.assign(props, { 'wd-attr': bindingAttr })
    }

    return weld.el('div', props)
}

it('empty binding', function () {
    const binder = 'testEmpty'
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder))
    weld.bind(binder, function (el) {
        expect(true).toBe(true)
    })
    weld.apply(rootEl)
})

it('string binding single quotes', function () {
    const binder = "testString"
    const expected = "here"
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
    weld.apply(rootEl)
})

it('string binding double quotes', function () {
    const binder = "testString"
    const expected = "here"
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
    weld.apply(rootEl)
})

it('string binding no quotes', function () {
    const binder = "testString"
    const expected = "here"
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
    weld.apply(rootEl)
})

it('float binding value', function () {
    const binder = "testInt"
    const expected = 1
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
    weld.apply(rootEl)
})

it('int binding value', function () {
    const binder = "testFloat"
    const expected = 1.0
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
    weld.apply(rootEl)
})

it('boolean binding value', function () {
    const binder = "testBoolean"
    const expected = true
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
    weld.apply(rootEl)
})

it('object literal binding value', function () {
    const binder = "testObjectLiteral"
    const expected = "{ name: 'weld', version: 1, awesome: true }"
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr.name).toBe('weld')
        expect(attr.version).toBe(1)
        expect(attr.awesome).toBe(true)
    })
    weld.apply(rootEl)
})

it('JSON binding value', function () {
    const binder = "testJsonLiteral"
    const expected = JSON.stringify({ name: "weld", "version": 1, "awesome": true })
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr.name).toBe('weld')
        expect(attr.version).toBe(1)
        expect(attr.awesome).toBe(true)
    })
    weld.apply(rootEl)
})

it('single target', function () {
    const binder = "testTarget"
    const parentElement = createTestElement(binder)
    parentElement.innerHTML = '<div wd-target="testTarget"></div>'
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, parentElement)
    weld.bind(binder, function (el, targets) {
        expect(targets).toHaveProperty('testTarget')
    })

    weld.apply(rootEl)
})

it('multiple targets', function () {
    const binder = "testTargets"
    const expected = "here"
    const parentElement = createTestElement(binder, expected)
    parentElement.innerHTML = '<div wd-target="testTarget"></div><div wd-target="testTarget2"></div>'
    const rootEl = weld.el('div')
    weld.dom.append(rootEl, parentElement)
    weld.bind(binder, function (el, attr, targets) {
        expect(attr).toBe(expected)
        expect(targets).toHaveProperty('testTarget')
        expect(targets).toHaveProperty('testTarget2')
    })
    weld.apply(rootEl)
})

it('should create element', function () {
    const el = weld.el('div')
    expect(el).toBeInstanceOf(HTMLDivElement)
})

it('should create element with text content', function () {
    const el = weld.el('div', 'here')
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.textContent).toBe('here')
})

it('should create element with text content from non-strings, non-objects', function () {
    const elInt = weld.el('div', 1)
    expect(elInt).toBeInstanceOf(HTMLDivElement)
    expect(elInt.textContent).toBe('1')

    const elFloat = weld.el('div', 1.1)
    expect(elFloat).toBeInstanceOf(HTMLDivElement)
    expect(elFloat.textContent).toBe('1.1')

    const elTrue = weld.el('div', true)
    expect(elTrue).toBeInstanceOf(HTMLDivElement)
    expect(elTrue.textContent).toBe('true')

    const elFalse = weld.el('div', false)
    expect(elFalse).toBeInstanceOf(HTMLDivElement)
    expect(elFalse.textContent).toBe('false')
})

it('should create element with id', function () {
    const el = weld.el('div#id')
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.id).toBe('id')
})

it('should create element with class', function () {
    const el = weld.el('div.class1')
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.classList.contains('class1')).toBe(true)
})

it('should create element with id and classes', function () {
    const el = weld.el('p#id.class1.class_2')
    expect(el).toBeInstanceOf(HTMLParagraphElement)
    expect(el.id).toBe('id')
    expect(el.classList.contains('class1')).toBe(true)
    expect(el.classList.contains('class_2')).toBe(true)
})

it('should create element with props', function () {
    const el = weld.el('div', 'hello', { class: 'class1' })
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.textContent).toBe('hello')
    expect(el.classList.contains('class1')).toBe(true)
})

it('should create element with props including event listeners', function () {
    const mockFn = jest.fn()
    const el = weld.el('div', 'hello', { onclick: mockFn })
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.innerHTML).toBe('hello')
    el.click()
    expect(mockFn).toHaveBeenCalled()
})

it('should absorb element and update props', function () {
    const el = weld.el('div')
    const mockFn = jest.fn()
    weld.el(el, 'hello', { onclick: mockFn })
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.innerHTML).toBe('hello')
    el.click()
    expect(mockFn).toHaveBeenCalled()
})

it('should append single element', function () {
    const parentEl = weld.el('div')
    const el = weld.el('div')
    weld.dom.append(parentEl, el)
    expect(parentEl.children.length).toBe(1)
})

it('should append multiple elements', function () {
    const parentEl = weld.el('div')
    const el = weld.el('div')
    weld.dom.append(parentEl, [weld.el('div'), weld.el('div')])
    expect(parentEl.children.length).toBe(2)
})

it('should replace element content with single element', function () {
    const parentEl = weld.el('div')
    weld.dom.append(parentEl, weld.el('div'))
    weld.dom.set(parentEl, weld.el('div'))
    expect(parentEl.children.length).toBe(1)
})

it('should replace element content with multiple elements', function () {
    const parentEl = weld.el('div')
    weld.dom.append(parentEl, weld.el('div'))
    weld.dom.set(parentEl, [weld.el('div'), weld.el('div')])
    expect(parentEl.children.length).toBe(2)
})

it('should find elements', function () {
    const parentEl = weld.el('div')
    weld.dom.append(parentEl, weld.el('div.classfind'))
    weld.dom.append(parentEl, weld.el('div.classfind'))
    expect(weld.dom.find('.classfind', parentEl).length).toBe(2)
})

it('should get single element', function () {
    const parentEl = weld.el('div')
    weld.dom.append(parentEl, weld.el('div.classfind'))
    weld.dom.append(parentEl, weld.el('div.classfind'))
    expect(weld.dom.get('.classfind', parentEl)).toBeInstanceOf(HTMLDivElement)
})