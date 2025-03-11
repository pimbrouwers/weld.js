const weld = require('../weld')

afterAll(function () {
    weld.init()
})

function createTestElement(bindingStr) {
    const element = document.createElement('div')
    element.setAttribute('data-bind', bindingStr)
    return element
}

it('empty binding', function () {
    const binder = 'testEmpty'
    document.body.appendChild(createTestElement(binder))
    weld.bind(binder, function (el) {
        expect(true).toBe(true)
    })
})

it('string binding single quotes', function () {
    const binder = "testString"
    const expected = "here"
    document.body.appendChild(createTestElement(`${binder}: '${expected}'`))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('string binding double quotes', function () {
    const binder = "testString"
    const expected = "here"
    document.body.appendChild(createTestElement(`${binder}: "${expected}"`))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('string binding no quotes', function () {
    const binder = "testString"
    const expected = "here"
    document.body.appendChild(createTestElement(`${binder}: ${expected}`))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('float binding value', function () {
    const binder = "testInt"
    const expected = 1.0
    document.body.appendChild(createTestElement(`${binder}: ${expected}`))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('int binding value', function () {
    const binder = "testFloat"
    const expected = 1
    document.body.appendChild(createTestElement(`${binder}: ${expected}`))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('boolean binding value', function () {
    const binder = "testBoolean"
    const expected = true
    document.body.appendChild(createTestElement(`${binder}: ${expected}`))
    weld.bind(binder, function (el, attr) {
        expect(attr).toBe(expected)
    })
})

it('object literal binding value', function () {
    const binder = "testObjectLiteral"
    const expected = { name: "weld", "version": 1, "awesome": true }
    document.body.appendChild(createTestElement(`${binder}: { name: 'weld', version: 1, awesome: true }`))
    weld.bind(binder, function (el, attr) {
        expect(attr.name).toBe(expected.name)
        expect(attr.version).toBe(expected.version)
        expect(attr.awesome).toBe(expected.awesome)
    })
})

it('JSON binding value', function () {
    const binder = "testObjectLiteral"
    const expected = { name: "weld", "version": 1, "awesome": true }
    document.body.appendChild(createTestElement(`${binder}: { "name": "weld", "version": 1, "awesome": true }`))
    weld.bind(binder, function (el, obj) {
        expect(obj.name).toBe(expected.name)
        expect(obj.version).toBe(expected.version)
        expect(obj.awesome).toBe(expected.awesome)
    })
})

it('single target', function() {
    const binder = "testTarget"
    const parentElement = createTestElement(binder)
    parentElement.innerHTML = '<div data-target="testTarget"></div>'
    document.body.appendChild(parentElement);

    weld.bind(binder, function (el, targets) {
        expect(targets).toHaveProperty('testTarget')
    })
})

it('multiple targets', function() {
    const binder = "testTargets"
    const expected = "here"
    const parentElement = createTestElement(`${binder}: ${expected}`)
    parentElement.innerHTML = '<div data-target="testTarget"></div><div data-target="testTarget2"></div>'
    document.body.appendChild(parentElement);

    weld.bind(binder, function (el, attr, targets) {
        expect(attr).toBe(expected)
        expect(targets).toHaveProperty('testTarget')
        expect(targets).toHaveProperty('testTarget2')
    })
})
