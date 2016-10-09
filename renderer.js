"use strict";
const remote = require('electron').remote;

/* Helper function for query selector */
function elem(query) {
    return document.querySelector(query);
}

/* Called from 'onchange' event via navbar search */
function searchOnChange(e) {
    elem('#navbar-search').className = '';
    elem('#navbar .fa-search').style.opacity = 1
    elem('#webview').src = elem('#navbar-search').value;
}

function showOptions() {
    elem('#footer-options').className = (elem('#footer-options').className === 'open' ? '' : 'open');
}

function toggleHTTPCapture() {
    const el = elem('#footer-options .fa-cloud');
    el.className = (el.className === 'fa fa-cloud activate' ? stopHTTPCapture() : activateHTTPCapture());
}

function activateHTTPCapture() {

    showMessage('#footer-messages #message', 'Now capturing HTTP requests');
    remote.getCurrentWindow().webContents.session.webRequest.onBeforeSendHeaders( (details, callback) => {
        if (!(details.method === 'POST' || details.method === 'PUT')) {
            callback({cancel: false, responseHeaders: details});
            return;
        }
        const promise = new Promise((resolve, reject) => {
            promptHTTPRequest(details).then(
                function(headers) {
                    resolve(headers)
                }
            ).catch(
                function(headers) {
                    resolve(headers)
                }
            )

        });

        promise.then(
            (headers) => callback({cancel: false, responseHeaders: headers})
        )
    });

    return 'fa fa-cloud activate'
}

function promptHTTPRequest(request) {
    const message = elem('#app-messages #message');
    const promise = new Promise((resolve, reject) => {
        message.innerHTML = `
            ${request.method} Request to ${request.url} Captured: 
            <div>
                <button onclick="requestAnswer = 'edit'">Edit</button>   
                <button onclick="requestAnswer = 'continue'">Continue</button>
            </div>
        `;
        // show message
        message.className = 'show';

        function checkAnswer() {
            console.log('loop')
            if(typeof (requestAnswer) === 'undefined') {
                setTimeout(checkAnswer(), 50);
                return;
            }
            if(requestAnswer === 'edit') {
                resolve(request.requestheaders);
                return;
            }
            reject(request.requestheaders)
        }

        checkAnswer()

    });
    return promise
}

function showMessage(element, string, delay = 2000) {
    const message = elem(element);
    message.innerText = string;
    message.className = 'show';
    setTimeout(() => {
        message.className = '';
        message.innerText = '';
    }, delay);
}

function stopHTTPCapture() {
    return 'fa fa-cloud'
}
