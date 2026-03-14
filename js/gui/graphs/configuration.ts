
import { GraphDataSet } from "./graphData";
import { Parameter, Parameters } from "./parameters";
import { Format } from "../../lib";


import { DOM } from "../dom";
import { GraphicAxis, PlotDataSet } from "./base";



export class GraphicConfiguration {
  parameter: Parameter;
  title: string;
  klass: string;
  data: PlotDataSet;
  xAxis: GraphicAxis;
  yAxis: GraphicAxis;



  constructor(
    parameter:Parameter,
  ) {
    this.parameter=parameter;
    this.klass = parameter.toString();
    this.xAxis = new GraphicAxis("date", function (value, index) {
      return Format.date(value);
    });
    this.yAxis = new GraphicAxis(parameter.toString(), function (value, index) {
      return `${value}${parameter.units}`;
    });

  }

  load(data: GraphDataSet) {
    let beacons = data.beacons.join(", ");
    this.title = `${this.parameter} for ${beacons} (${this.parameter.units})`;
    this.data = data.dataSet(this.parameter);

  }



}

export function  MakeGraphicConfigurations(data: GraphDataSet) : GraphicConfiguration[] {
  return Parameters.All.map(p => {
    let gc = new GraphicConfiguration(p);
    gc.load(data);
    return gc;
  });
}
