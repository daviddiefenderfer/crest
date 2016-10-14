"use strict";

const {ipcRenderer} = require('electron');
const send = XMLHttpRequest.prototype.send;

function startHTTPCapture() {
    XMLHttpRequest.prototype.send = function (data) {
        if (!data) {
            return send.apply(this, arguments);
        }

        ipcRenderer.sendToHost('prompt-request', data);
        ipcRenderer.on('return-request', (event, data) => {
            return send.apply(this, [data]);
        });
    }

}

ipcRenderer.on('startCapture', () => {
    startHTTPCapture()
});
