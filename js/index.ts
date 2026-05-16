import {ApplicationGUI, Notifications} from './gui';



function start() {
    let appGUI = new ApplicationGUI();
    appGUI.load().then( () => {
        window.console.log('GUI loaded');
    },
      (reason) => {
        window.console.error(`There has been an error: ${reason}`);
        Notifications.load("error", [
          "There has been a problem loading the application",
          "Error message:",
          reason.toString(),
          'Please contact the site administrator'
        ]);
      });
}


window.onload = () => {
    window.console.log('Starting');
    start();
    window.onload = () => {};
};