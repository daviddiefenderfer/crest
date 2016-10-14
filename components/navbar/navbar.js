"use strict";

const {input, i, div} = require('@cycle/dom');
const {startHTTPCapture} = require('../../utils/webviewHandler');
let isCapturing;

function makeValidUrl(query) {
    if (query === '') {
        return query;
    }
    const re = new RegExp('^(http|https)://.');
    let url = re.test(query) ? query : 'http://' + query;
    if(!isCapturing) {
        startHTTPCapture();
        isCapturing = true
    }

    return url;
}

function Navbar(sources) {

    const actions = {
        submit$: sources.DOM.select('#navbar-search')
            .events('change')
            .map(e => e.target.value)
    };

    const state$ = actions.submit$.startWith('')
        .map(val => makeValidUrl(val));

    const view$ = state$.map(state =>
        div('#navbar', [
            i('.fa.fa-search', {attrs: {ariaHidden: true}}),
            input('#navbar-search', {attrs: {
                type: 'text',
                placeholder: 'ex. http://www.google.com',
                autofocus: true,
                class: state === '' ? 'first-search' : ''
            }})
        ])
    );

    return {
        DOM: view$,
        url: state$.map(state => state)
    }
}

module.exports = Navbar;
