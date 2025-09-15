export type ZoomerMode = 'x'|'y'|'xy';
export interface ZoomerOptions {
  enabled: boolean,
  mode: ZoomerMode
}

export const zoomerOptionDefaults : ZoomerOptions = {
  enabled: true,
  mode: 'xy'
};

export enum ZoomerEventState {
  NULL,
  DOWN,
  UP,
  MOVING
}

export interface ZoomerState {
  position: number,
  source: string,
  state : ZoomerEventState
}





export class ZoomerEvent extends Event {
  readonly state : ZoomerState;
  private readonly hasPos : boolean;
  constructor(state: ZoomerEventState, source : string='', position: number = Number.NaN) {
    super('zoomer-event');
    this.state = {
      position: position,
      source: source,
      state: state
    };
  }
  get shouldCancel() : boolean {
    return this.state.state===ZoomerEventState.NULL || Number.isNaN(this.state.position);
  }
}

export const ZoomerEventTarget : Element = document.body;


