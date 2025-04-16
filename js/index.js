import {ApplicationGUI} from './gui/applicationGUI.js';


function start() {
    let appGUI = new ApplicationGUI();
    appGUI.load().then( _ => {
        window.console.log('GUI loaded');
    });
}


window.onload = (_) => {
    window.console.log('Starting');
    start();
    window.onload = (_) => {};
};