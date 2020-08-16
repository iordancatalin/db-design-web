import { Dimension } from '../graphics/dimension';
import { Position } from '../graphics/position';
import { Color } from '../graphics/color';

const DUMMY_POSITION: Position = new Position(0, 0);

const DIAGRAM_DEFAULT_DIMENSION: Dimension = new Dimension(1200, 600);

export const DIAGRAM_DEFAULT_POSITION: Position = new Position(4650, 4510);

export const SUPER_POSITION: Position = new Position(-4500, -4500);

export const DIAGRAM_MIN_WIDTH = 1200;

export const DIAGRAM_MIN_HEIGHT = 600;

export const DIAGRAM_PADDING = 10;

export const ERROR_MOVE = 100;

export const DISTANCE_ERROR = 100;

export const OPTIONS_PADDING = 5;

export const TIMER_DURATION = 10;

export const TABLE_DEFAULT_WIDTH = 250;

export const TABLE_WIDTH_UNIT = 20;

export const SAVE_TIMER = 10000;

export const DEBOUNCE_TIME = 500;

export const SMALL_DEVICE_WIDTH = 576;

export function getDummyPosition(): Position {
  return DUMMY_POSITION.clone();
}

export function getDiagramDefaultDimension(): Dimension {
  return DIAGRAM_DEFAULT_DIMENSION.clone();
}

export function getDiagramDefaultPosition(): Position {
  return DIAGRAM_DEFAULT_POSITION.clone();
}

let Z_INDEX = 1;

export function getZIndex() {
  return Z_INDEX++;
}

export function getSuperPosition(): Position {
  return SUPER_POSITION.clone();
}

