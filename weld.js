(function (GLOBAL) {
    'use strict'

    const weld = {
        _binders: {},
        apply(el = document.body) { applyBindings(el) },
        bind(name, fn) { this._binders[name] = fn },
        el(tagOrElement, props) { return createOrModifyElement(tagOrElement, props) },
        dom: {
            append(el, children) { appendElements(el, children) },
            find(selector, el = document.body) { return el.querySelectorAll(selector) },
            get(selector, el = document.body) { return el.querySelector(selector) },
            set(el, children) { el.replaceChildren(...children) }
        }
    }

    const applyBindings = root => {
        const els = root.querySelectorAll('[data-wd-bind], [wd-bind]')

        for (const el of els) {
            const name = el.getAttribute('data-wd-bind') || el.getAttribute('wd-bind')
            if (!name || !weld._binders[name]) continue

            const attr = parseDataAttr(el.getAttribute('data-wd-attr') || el.getAttribute('wd-attr'))

            let targets = {}
            const targetEls = el.querySelectorAll('[data-wd-target], [wd-target]')
            for (const targetEl of targetEls) {
                const targetName = targetEl.getAttribute('data-wd-target') || targetEl.getAttribute('wd-target')
                targets[targetName] = targetEl
            }

            if (attr === null) {
                weld._binders[name](el, targets)
            }
            else {
                weld._binders[name](el, attr, targets)
            }
        }
    }

    const parseDataAttr = value => {
        if (!value) {
            return null
        }

        let bindingJson = ""
        if (value.startsWith('{')) {
            bindingJson =
                value
                    .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
                    .replace(/(:\s*)'([\w\s\n\r!"#$%&()*+,-./:<=>?@[\]^_`{|}~]+)'/g, '$1"$2"')
        }
        else if (/^true$/i.test(value)) {
            bindingJson = true
        }
        else if (/^false$/i.test(value)) {
            bindingJson = false
        }
        else if (/^\d+/.test(value)) {
            bindingJson = parseInt(value)
        }
        else if (/^\d\.+/.test(value)) {
            bindingJson = parseFloat(value)
        }
        else if (/^\w/i.test(value)) {
            bindingJson = `"${value}"`
        }
        else {
            bindingJson = value
        }

        try {
            return JSON.parse(`{"__weld__":${bindingJson}}`).__weld__
        }
        catch (error) {
            console.error('Invalid binding data:', value, error)
            return {}
        }
    }

    const createOrModifyElement = (tagOrElement, props = {}) => {
        const el = typeof tagOrElement === 'string'
            ? createElementFromString(tagOrElement)
            : tagOrElement;

        if (props) {
            for (const key in props) {
                if (key.startsWith('on') && typeof props[key] === 'function') {
                    el.addEventListener(key.slice(2).toLowerCase(), props[key]);
                }
                else if (key in el && el[key] !== props[key]) {
                    el[key] = props[key];
                }
                else if (!el.hasAttribute(key) || el.getAttribute(key) !== props[key]) {
                    el.setAttribute(key, props[key]);
                }
            }
        }
        return el;
    };

    const createElementFromString = (decoratedTag) => {
        let tag, id, classes = []

        const matches = [...decoratedTag.matchAll(/([#.]*)(\w+)/ig)]

        for (const match of matches) {
            if (!id && match[1] === '#') {
                id = match[2]
            }
            else if (match[1] === '.') {
                classes.push(match[2])
            }
            else if (!tag) {
                tag = match[2]
            }
        }

        const el = document.createElement(tag)

        if (id) {
            el.id = id
        }

        if (classes.length) {
            el.classList.add(...classes)
        }

        return el
    }

    const appendElements = (el, children) => {
        if (!Array.isArray(children)) children = [children]

        const fragment = document.createDocumentFragment()
        for (const child of children) {
            if (child == null) {
                continue
            }
            fragment.appendChild(typeof child === 'string' ? document.createTextNode(child) : child)
        }
        el.appendChild(fragment)
    }

    if (typeof define === 'function' && define.amd) {
        define(() => weld)
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = weld
    } else {
        GLOBAL.weld = weld
    }
})(this)
