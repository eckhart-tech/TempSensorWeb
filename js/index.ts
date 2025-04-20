import {ApplicationGUI} from './gui';


function start() {
    let appGUI = new ApplicationGUI();
    appGUI.load().then( () => {
        window.console.log('GUI loaded');
    });
}


window.onload = () => {
    window.console.log('Starting');
    start();
    window.onload = () => {};
};