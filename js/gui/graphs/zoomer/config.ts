import { DOM } from "../../dom";


export type ZoomerMode = 'x'|'y'|'xy';
export interface ZoomerOptions {
  enabled: boolean,
  mode: ZoomerMode,
  element: DOM|null
}

export function zoomerOptions(element : DOM|null) : ZoomerOptions {
  return {
    enabled: true,
    mode: 'xy',
    element: element
  };
}

