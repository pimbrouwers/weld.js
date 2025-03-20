const weld = require('../weld')

afterAll(() => {
    weld.apply()
})

it('empty binding', function () {
    const binder = 'testEmpty'
    weld.dom.append(document.body, createTestElement(binder))
    weld.bind(binder, function (el) {
        expect(true).toBe(true)
    })
})

it('string binding single quotes', function () {
    const binder = "testString"
    const expected = "here"
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('string binding double quotes', function () {
    const binder = "testString"
    const expected = "here"
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('string binding no quotes', function () {
    const binder = "testString"
    const expected = "here"
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('float binding value', function () {
    const binder = "testInt"
    const expected = 1
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('int binding value', function () {
    const binder = "testFloat"
    const expected = 1.0
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('boolean binding value', function () {
    const binder = "testBoolean"
    const expected = true
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('object literal binding value', function () {
    const binder = "testObjectLiteral"
    const expected = "{ name: 'weld', version: 1, awesome: true }"
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr.name).toBe('weld')
        expect(attr.version).toBe(1)
        expect(attr.awesome).toBe(true)
    })
})

it('JSON binding value', function () {
    const binder = "testJsonLiteral"
    const expected = JSON.stringify({ name: "weld", "version": 1, "awesome": true })
    weld.dom.append(document.body, createTestElement(binder, expected))
    weld.bind(binder, function (el, attr) {
        expect(attr.name).toBe('weld')
        expect(attr.version).toBe(1)
        expect(attr.awesome).toBe(true)
    })
})

it('single target', function () {
    const binder = "testTarget"
    const parentElement = createTestElement(binder)
    parentElement.innerHTML = '<div wd-target="testTarget"></div>'
    weld.dom.append(document.body, parentElement)

    weld.bind(binder, function (el, targets) {
        expect(targets).toHaveProperty('testTarget')
    })
})

it('multiple targets', function () {
    const binder = "testTargets"
    const expected = "here"
    const parentElement = createTestElement(binder, expected)
    parentElement.innerHTML = '<div wd-target="testTarget"></div><div wd-target="testTarget2"></div>'
    weld.dom.append(document.body, parentElement)

    weld.bind(binder, function (el, attr, targets) {
        expect(attr).toBe(expected)
        expect(targets).toHaveProperty('testTarget')
        expect(targets).toHaveProperty('testTarget2')
    })
})

function createTestElement(bindingName, bindingAttr) {
    let props = { 'wd-bind': bindingName }

    if (bindingAttr) {
        props = Object.assign(props, { 'wd-attr': bindingAttr })
    }

    return weld.el('div', props)
}

it('should create element', function () {
    const el = weld.el('div')
    expect(el).toBeInstanceOf(HTMLDivElement)
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
    const el = weld.el('div', { innerHTML: 'hello' })
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.innerHTML).toBe('hello')
})

it('should create element with props including event listeners', function () {
    const mockFn = jest.fn()
    const el = weld.el('div', { innerHTML: 'hello', onclick: mockFn })
    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el.innerHTML).toBe('hello')
    el.click()
    expect(mockFn).toHaveBeenCalled()
})

it('should absorb element and update props', function () {
    const el = weld.el('div')
    const mockFn = jest.fn()
    weld.el(el, { innerHTML: 'hello', onclick: mockFn })
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

it('should replace element content', function () {
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