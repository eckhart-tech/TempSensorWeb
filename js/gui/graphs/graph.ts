import { Chart } from 'chart.js/auto';
import { DOM} from '../dom/dom';
import {GraphDataSet, Parameter} from './graphData';




class ChartConfiguration {
  private formatter: Intl.DateTimeFormat;
    /**
     *
     * @param {string} locale
     */
    constructor(
        locale = 'en-GB'
    ) {
        this.formatter = new Intl.DateTimeFormat(locale);
    }

    /**
     *
     * @param {GraphDataSet} data
     * @param {string} parameter
     * @returns {{type: string, data: {datasets}, options: {animation: boolean}, plugins: {legends: {display: boolean}, title: {display: boolean, text: string}}, scales: {x: {min, max, ticks: {callback: (function(*): string)}}, y: {min: number, max: number, ticks: {callback: (function(*): string)}}}}}
     */
    config(data: GraphDataSet ,parameter:Parameter) {
        let datasets = data.dataSet(parameter);
        let unit = GraphDataSet.unit(parameter);
        let beacons = data.beacons.join(', ');
        let title = `${parameter} for ${beacons} (${unit})`;

        return {
            type: 'scatter',
            data: {
                datasets: datasets
            },
            options: {
                animation: false
            },
            plugins: {
                legends : {
                    display : true
                },
                title : {
                    display : true,
                    text : title
                }
            },
            scales : {
                x: {
                    min: data.bounds.min,
                    max: data.bounds.max,
                    ticks: {
                        callback: (value: Date | number)  => this.formatter.format(value)
                    }
                },
                y: {
                    min: 0.0,
                    max: 100.0,
                    ticks: {
                        callback: (value : number ) => `${value}${unit}`
                    }
                }
            }
        };
    }
}


class Graphic {
   configuration: ChartConfiguration;
  element: DOM;
    /**
     *
     * @param {string} id
     */
    constructor(id: string) {
        this.configuration = new ChartConfiguration();
        this.element = DOM.withID(id);
    }

    clean() {
        this.element.empty();
    }

    /**
     *
     * @param {GraphDataSet} data
     * @param {string} parameter
     * @returns {Promise<void>}
     */
    async draw(data: GraphDataSet,parameter: Parameter) {
        this.clean();
        let config = this.configuration.config(data,parameter);
        let canvas = new DOM('canvas').addClass(parameter);
        new Chart(canvas.dom as HTMLCanvasElement, config);
        this.element.append(canvas);
    }
}



