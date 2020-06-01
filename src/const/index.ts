
export const INIT_WIDTH = 1600;
export const INIT_HEIGHT = 900;



export const CANVAS_MAX_WIDTH = 1000;
export const CANVAS_MAX_HEIGHT = 500;

export const CANVAS_INIT_WIDTH = 400;
export const CANVAS_INIT_HEIGHT = 400;

export const CANVAS_PADDING = 10;


export const MIN_SCALE = 0.0001;

export const MAX_CANVAS_PIXEL_SIZE = 40000;
export const MIN_CANVAS_PIXEL_SIZE = 20;

export const MAX_POS_VAL = 40000;
export const MIN_POS_VAL = -MAX_POS_VAL;

export const CROP_ZONE_ID = 'crop_zone_id';

export const PRECISION_SCENE_RATIO = 0.001;



export const KEY_CODES = {
  Z: 90,
  Y: 89,
  SHIFT: 16,
  BACKSPACE: 8,
  DEL: 46
};


export const TEMPLATE_TYPE_NORMAL = 'normal';
export const TEMPLATE_TYPE_TEMPLATE = 'template';


export const TYPE_TEXT_BOX = 'TEXT_BOX';
export const TYPE_IMAGE_BOX = 'IMAGE_BOX';

export const TOOL_IMAGE_ZONE = Object.freeze({
  type: 'IMAGE_BOX',
  name: '图像区',
  width: 150,
  height: 100,
  stroke: 'green',
  fill: 'rgba(255, 255, 255, 0)',
});


export const TOOL_TEXT_BOX = Object.freeze({
  type: 'TEXT_BOX',
  name: '文本框区域',
  width: 300,
  height: 60,
  stroke: 'blue',
});






