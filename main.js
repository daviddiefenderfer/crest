'use strict';

const {app, BrowserWindow} = require('electron');

let browser;
app.on('ready', function() {
    browser = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'cReST',
        titleBarStyle: 'hidden-inset'
    });
    browser.loadURL(`file://${__dirname}/index.html`);
});
