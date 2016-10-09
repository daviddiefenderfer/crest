'use strict';

const {app, BrowserWindow, session} = require('electron');

let browser;
app.on('ready', function() {
    browser = new BrowserWindow({
        width: 800,
        height: 600,
        titleBarStyle: 'hidden-inset'
    });
    browser.loadURL(`file://${__dirname}/index.html`);
    //session.defaultSession.webRequest.onBeforeSendHeaders((details) => console.log(details))
});
