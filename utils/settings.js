"use strict";

const fs = require('fs');
const remote = require('electron').remote;
const path = remote.app.getPath('userData');
const defaults = {
    recentPlaces: [],
    HTTPCapture: {
        methods: ['POST', 'PUT']
    }
};

let get = () => {
    let data;
    fs.stat(path + '/config.json', function (error) {
        if(error == null) {
            data = JSON.parse(fs.readFileSync(path + '/config.json'));
        } else if(error.code === 'ENOENT') {
            fs.writeFileSync(path + '/config.json', JSON.stringify(defaults));
        }
    });
    return data || defaults;
};



module.exports = {}