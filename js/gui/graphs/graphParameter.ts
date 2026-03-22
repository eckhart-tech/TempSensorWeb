import { Record } from "../../sensors";

enum _Parameter {
  Temperature = "temperature",
  Humidity = "humidity",
  Battery = "battery",
}

export class Parameter {
  readonly parameter: _Parameter;
  readonly units: string;
  readonly min: number;
  readonly max: number;

  constructor(parameter: _Parameter) {
    this.parameter = parameter;

    switch (parameter) {
      case _Parameter.Temperature:
        this.units = "C";
        break;
      case _Parameter.Battery:
      case _Parameter.Humidity:
        this.units = "%";
        break;
      default:
        this.units = "";
        break;
    }

    this.min = 0;
    this.max = 100;
  }

  toString(): string {
    return this.parameter;
  }

  static Temperature = new Parameter(_Parameter.Temperature);
  static Humidity = new Parameter(_Parameter.Humidity);
  static Battery = new Parameter(_Parameter.Battery);

  static All = [Parameter.Temperature, Parameter.Humidity, Parameter.Battery];
}

function getParameter(record: Record, parameter: Parameter): number {
  return record[parameter.parameter];
}
