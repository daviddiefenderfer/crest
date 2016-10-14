"use strict";

function changeRequestPopup(data) {
    const message = document.getElementById('message');
    const title = document.getElementById('app-message-title');
    const content = document.getElementById('app-message-content');

    document.getElementById('app-messages').className = 'show';
    message.className = 'show';

    title.innerText = 'Request';
    content.innerText = data;
    return new Promise((resolve, reject) => {

        function editRequest(e){
            content.className = 'hide';
            document.getElementById('app-message-content-edit').value = data;
            document.getElementById('app-message-content-edit').className = 'show';
            document.getElementById('continue-request').style.display = 'none';
            document.getElementById('edit-request').innerText = 'Send';
            document.getElementById('edit-request').removeEventListener('click', editRequest);
            document.getElementById('edit-request').addEventListener('click', (e)=> {
                message.className = 'hide';
                resolve(document.getElementById('app-message-content-edit').value);
            });
        }
        document.getElementById('continue-request').addEventListener('click', (e) => {
            message.className = 'hide';
            reject();
        });
        document.getElementById('edit-request').addEventListener('click', editRequest())
    });
}

function startHTTPCapture() {
    const webview = document.getElementById('webview');
    // On Webview ready
    webview.addEventListener('dom-ready', () => {
        webview.openDevTools();
        webview.send('startCapture');
    });
    webview.addEventListener('ipc-message', (event) => {
        if(event.channel === 'prompt-request') {
            const originalRequest = event.args[0];
            let promise = new Promise((resolve, reject) => {
                changeRequestPopup(originalRequest).then(
                    (newRequestData) => resolve(newRequestData)
                ).catch(
                    () => reject()
                )
            });
            promise.then((newData) => webview.send('return-request', newData)
            ).catch(() => webview.send('return-request', originalRequest))
        }
    });
}

module.exports = {
    startHTTPCapture: startHTTPCapture
};
