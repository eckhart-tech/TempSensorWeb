export type ZoomerMode = 'x'|'y'|'xy';
export interface ZoomerOptions {
  enabled: boolean,
  mode: ZoomerMode
}

export function makeZoomerOptions() : ZoomerOptions {
  return {
    enabled: true,
    mode: "xy"
  };
}