
type ZoomRangeValue = number|'original';

interface ZoomRange {
  min: ZoomRangeValue,
  max: ZoomRangeValue
}

type ZoomWheelModifierKey = 'ctrl'|'alt'|'shift'|'meta'|null;

interface ZoomWheel {
  enabled: boolean,
  modifierKey?: ZoomWheelModifierKey
}
type ZoomMode = 'x'|'y'|'xy';

export interface ZoomPlugin {
  pan? : {
    enabled: boolean,
    mode: ZoomMode
  },
  limits?: {
    x : ZoomRange,
    y : ZoomRange
  },
  zoom: {
    wheel: ZoomWheel,
    pinch: {
      enabled: boolean
    },
    mode: ZoomMode;
  }
}

export function makeZoomRange(min : ZoomRangeValue, max : ZoomRangeValue) : ZoomRange {
  return {
    min: min,
    max: max
  };
}

export function makeZoomWheel(enabled: boolean = false, key : ZoomWheelModifierKey = null) {
  let w: ZoomWheel = {
    enabled: enabled
  };
  if(enabled && key!=null) {
    w.modifierKey=key;
  }
  return w;
}

export function makeZoomConfiguration(
  mode: ZoomMode,
  x: ZoomRange|null = null,
  y: ZoomRange|null = null,
  wheel: ZoomWheel|null = null,
  pinch: boolean = false,
  pan: boolean = false
) : ZoomPlugin {
  let z : ZoomPlugin = {
    limits: {
      x: x ?? makeZoomRange('original','original'),
      y: y ?? makeZoomRange(0,100)
    },
    zoom: {
      wheel: wheel ?? makeZoomWheel(),
      pinch: {
        enabled: pinch
      },
      mode: mode
    }
  };
  if(pan) {
    z.pan = {
      enabled: true,
      mode: mode
    };
  }
  return z;
}

