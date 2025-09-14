export type ZoomerMode = 'x'|'y'|'xy';
export interface ZoomerOptions {
  enabled: boolean,
  mode: ZoomerMode
}

export const zoomerOptionDefaults : ZoomerOptions = {
  enabled: true,
  mode: 'xy'
};



