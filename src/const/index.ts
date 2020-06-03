
export const INIT_WIDTH = 1200;
export const INIT_HEIGHT = 300;



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

export const FILL_TYPE_IMAGE = 'IMAGE';
export const FILL_TYPE_COLOR = 'COLOR';

export const TOOL_IMAGE_ZONE = Object.freeze({
  toolType: 'IMAGE_BOX',
  name: '图片区域', 
  width: 150,
  height: 100,
  stroke: 'green',
  fill: 'rgba(255, 255, 255, 0)',
});


export const TOOL_TEXT_BOX = Object.freeze({
  toolType: 'TEXT_BOX',
  name: '文本框',
  width: 300,
  height: 60,
  stroke: 'blue',
  fill: 'blue',
  fontFamily: 'Comic Sans',
  fontSize: 60,
  text: '这是一个文本输入框',
  maxLength: 9,
});






