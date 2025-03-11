; (function (GLOBAL) {
    'use strict'

    let binders = {}

    const weld = {
        bind: function (name, fn) {
            binders[name] = fn
        },
        init: function (root) {
            if (root == null) {
                root = document.body
            }

            const dataBinds = root.querySelectorAll('[data-bind]')

            for (const el of dataBinds) {
                const dataBind = el.dataset.bind

                const targetEls = el.querySelectorAll('*[data-target]')
                let targets = {}

                targetEls.forEach(targetEl => {
                    targets[targetEl.dataset.target] = targetEl
                })

                const sepIndex = dataBind.indexOf(':')

                if (sepIndex < 0) {
                    binders[dataBind](el, targets)
                }
                else {
                    const name = dataBind.substring(0, sepIndex)
                    const bindingStr = dataBind.substring(sepIndex + 1).trim()
                    let bindingJson = ""

                    if (bindingStr.startsWith('{')) {
                        bindingJson =
                            bindingStr
                                .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
                                .replace(/(:\s*)'([\w\s\n\r!"#$%&()*+,-./:;<=>?@[\]^_`{|}~]+)'/g, '$1"$2"')
                    }
                    else if (/^true$/i.test(bindingStr)) {
                        bindingJson = true
                    }
                    else if (/^false$/i.test(bindingStr)) {
                        bindingJson = false
                    }
                    else if (/[a-z]/i.test(bindingStr)) {
                        bindingJson = bindingStr.replace(/^['"\s]*(\w+)['"\s]*$/gi, '"$1"')
                    }
                    else {
                        bindingJson = bindingStr
                    }

                    let binding;

                    try {
                        binding = JSON.parse(`{"__weld__":${bindingJson}}`)
                    } catch (error) {
                        console.error('The following binding is invalid: \n' + dataBind, error)
                        binding = {}
                    }
                    binders[name](el, binding.__weld__, targets)
                }
            }
        }
    }

    if (typeof define === 'function' && define.amd) {
        define(function () { return weld; });
    }
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = weld;
    }
    else {
        GLOBAL.weld = weld;
    }
})(this);