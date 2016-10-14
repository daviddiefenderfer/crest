"use strict";

const xs = require('xstream').default;
const {run} = require('@cycle/xstream-run');
const {div, main, h, makeDOMDriver} = require('@cycle/dom');
const settings = require('./utils/settings');
const Navbar = require('./components/navbar/navbar');

function app(sources) {

    const navbar = Navbar(sources);

    const vdom$ = xs.combine(navbar.DOM, navbar.url).map(([dom, url]) =>
        main([
            dom,
            h('webview', {attrs: {
                id: "webview",
                autosize: "on",
                src: url,
                preload: './utils/HTTPCapture.js',
                style: "display:inline-flex; height: 100%; width:100%;"
            }}),
            div('#app-messages')
        ])
    );

    return {
        DOM: vdom$
    }
}

run(app, {DOM: makeDOMDriver('#app')});
