import { fabric } from 'fabric';
import { 
  INIT_WIDTH, INIT_HEIGHT, CANVAS_PADDING, TEMPLATE_TYPE_NORMAL,  
  TYPE_IMAGE_BOX, TYPE_TEXT_BOX, FILL_TYPE_IMAGE, FILL_TYPE_COLOR,
} from '../const';
import { getCoordinates } from 'web-util-kit'
import { generateUuid } from 'util-kit'


const LINE_WIDTH = 4;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.padding = 2;
fabric.Object.prototype.strokeWidth = LINE_WIDTH;
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.lockRotation = true;

const FONT = '30px Helvetica';

if (!fabric.LableRect) {
  const LabelRect = fabric.util.createClass(fabric.Rect, {

    type: 'label-rect',

    _dimensionAffectingProps: ['label'],

    initialize: function(options: any) {
      options || (options = { });
      this.callSuper('initialize', options);
      this.set('label', options.label || '');
    },

    set: function(key: any, value: any) {
      this.callSuper('set', key, value);
      let needsDims = false;
      if (typeof key === 'object') {
        for (var _key in key) {
          needsDims = needsDims || this._dimensionAffectingProps.indexOf(_key) !== -1;
        }
      } else {
        needsDims = this._dimensionAffectingProps.indexOf(key) !== -1;
      }
      if (needsDims) {
        this.dirty = true;
      }
      return this;
    },

    toObject: function() {
      return fabric.util.object.extend(this.callSuper('toObject'), {
        label: this.get('label'),
      });
    },

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG: function() {
      var x = -this.width / 2, y = -this.height / 2;
      return [
        '<rect ', 'COMMON_PARTS',
        'x="', x, '" y="', y,
        '" rx="', this.rx, '" ry="', this.ry,
        '" width="', this.width, '" height="', this.height,
        '" />\n',
        `<Text  x="${this.labelOffsetX}" y="0" rx="${this.rx}" ry="${this.ry}"
          width="${this.width}" height="${this.height}" fill="${this.stroke}" 
          style="font: ${FONT};"
        >${this.label}</Text>`
        
      ];
    },


    _render: function(ctx: CanvasRenderingContext2D) {
      this.callSuper('_render', ctx);

      ctx.save();
      ctx.font = FONT;
      ctx.fillStyle = this.stroke;

      const size = ctx.measureText(this.label || '');
      this.labelOffsetX = -size.width/2
      
      // ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
      ctx.fillText(this.label, this.labelOffsetX, 0);


      ctx.restore();
    }

  });

  fabric.LabelRect = LabelRect;

}



export default class Controller {

  templateType = TEMPLATE_TYPE_NORMAL;  // TEMPLATE_TYPE_TEMPLATE

  templateName = '';

  fabricInstance: fabric.Canvas;

  cmp: any;
  container: HTMLElement;

  width: number = INIT_WIDTH;
  height: number = INIT_HEIGHT;
  cssScale: number = 1;


  // 背景填充类型
  bgFillType = FILL_TYPE_IMAGE;

  bgFillContent = {
    url: undefined,
    color: undefined,
  };
  

  layerList: any[] = [];
  

  constructor() {
    const ele = document.createElement('canvas') as HTMLCanvasElement;
    ele.width = this.width;
    ele.height = this.height;
    this.fabricInstance = new fabric.Canvas(ele, {
      preserveObjectStacking: true,
      enableRetinaScaling: false,
      perPixelTargetFind: false,
      containerClass: 'toy-editor-canvas-container',
    });

    this.fabricInstance.on('object:modified', this.onObjectModified);
    // always show latest state
    this.fabricInstance.on('mouse:up', () => {
      if (this.cmp) {
        this.cmp.forceUpdate();
      }
    });
    this.limitMoveAndScale();
    (window as any)._f_ = this.fabricInstance;
  }

  mountAt(container: HTMLElement) {
    if (!( container instanceof HTMLElement)) {
      throw new Error('must mount at a HTML Element');
    }
    // clean the container if has any children
    while (container.firstChild) {
      container.removeChild(container.lastChild);
    }
    container.appendChild(this.fabricInstance.wrapperEl);
    this.container = container;
    container.addEventListener('drop', this.onDropObject);
    this.autofit();
  }

  mountReactCmp(cmp: any) {
    this.cmp = cmp;
  }

  unmount() {
    this.container.removeEventListener('drop', this.onDropObject);
    this.container = null;
    this.cmp = null;
  }

  onDropObject = (e: DragEvent) => {
    e.preventDefault();
    const dt = e.dataTransfer;
    const { x, y } = getCoordinates(e, this.fabricInstance.lowerCanvasEl);
    const data = dt.getData('text/plain');
    console.log('data', data);
    let object;
    try {
      object = JSON.parse(data);
    } catch (error) {
      console.error('failed to get the shape');
    }
    if (!object || !object.toolType) {
      return;
    }

    const width = object.width / this.cssScale;
    const height = object.height / this.cssScale;
    
    const obj = {
      ...object,
      width,
      height,
      left: x - width/2,
      top: y - height/2,
      id: generateUuid(),
    };

    let target;
    if (object.toolType === TYPE_TEXT_BOX) {
      target = new fabric.Textbox('这是一个文本输入框', obj);
      console.log('textbox', obj);

    } else if (object.toolType === TYPE_IMAGE_BOX) {
      target = new fabric.LabelRect({...obj, label: '图片区'});
    } else {
      console.error('未知的图形类型', obj);
      return;
    }

    this.fabricInstance.add(target);
    this.update();
  }

  onObjectModified = (e: any) => {
    const { target } = e;
    const { width, height, scaleX, scaleY } = target;
    target.set({ scaleX: 1, scaleY: 1, width: scaleX * width, height: scaleY * height});
    // reset scale
    target.width = width * scaleX;
    target.height = height * scaleY;
    this.update();
  }

  getLayerList() {
    const objects = this.fabricInstance.getObjects();
    this.layerList = objects.map((item) => {
      const { left, top, width, height, scaleX, scaleY } = item;
      // TODO convert shape info into template info
      const dims = this.getDimension();    
      // update coordinates
      item.conf = item.conf || {};
      item.conf.x = left / (dims.width);
      item.conf.y = top / (dims.height); 
      item.conf.w = width * scaleX / (dims.width);
      item.conf.h = height * scaleY / (dims.height);
      return item;
    })
    return this.layerList; 
  }

  updateRule(item: any) {
    const { id, x, y, w, h } = item;
  
    const objects = this.fabricInstance.getObjects();
    const dims = this.getDimension();
    objects.filter(sub => sub.id === id).forEach((obj: any) => {
      obj.set({
        left: x * dims.width,
        top: y * dims.height,
        width: w * dims.width,
        height: h * dims.height,
        scaleX: 1,
        scaleY: 1,
      });
    })
    this.update();
  }

  isItemActive(id: string) {
    return !!this.fabricInstance.getActiveObjects().find(item => item.id === id);
  }


  loadTemplate() {


  }

  toSvg() {
    return this.fabricInstance.toSvg();
  }


  update() {
    if (this.cmp && typeof this.cmp.forceUpdate === 'function') {
      this.cmp.forceUpdate();
    }
    this.fabricInstance.renderAll();
  }


  getDimension() {
    return {
      width: this.fabricInstance.getWidth(),
      height: this.fabricInstance.getHeight(),
    };
  }

  changeDimension(type, val) {
    this.fabricInstance.setDimensions({ [type]: val });
    const outline = this.fabricInstance.getObjects()[0];
    outline.set({ [type]: val - LINE_WIDTH });
    this.autofit();
  }

  private autofit = () => {    
    const pixelWidth = this.fabricInstance.getWidth();
    const pixelHeight = this.fabricInstance.getHeight();
    const image_aspect = pixelWidth / pixelHeight;
    const MAX_AVAILABLE_WIDTH = this.container.clientWidth - CANVAS_PADDING;
    const MAX_AVAILABLE_HEIGHT = this.container.clientHeight - CANVAS_PADDING;
    const canvasAspect = MAX_AVAILABLE_WIDTH / MAX_AVAILABLE_HEIGHT;
    let zoom = 1;
    if (image_aspect < canvasAspect) {
      zoom = MAX_AVAILABLE_HEIGHT / pixelHeight;
    } else {
      zoom = MAX_AVAILABLE_WIDTH / pixelWidth;
    }
    this.cssScale = zoom;
    this.fabricInstance._setCssDimension('width', `${pixelWidth * zoom}px`);
    this.fabricInstance._setCssDimension('height', `${pixelHeight * zoom}px`);

    this.update();
  };


  limitMoveAndScale() {
    // this.fabricInstance.observe('object:scaling', function (e) {
      
    //   var obj = e.target;
    //   if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
    //     obj.setScaleY(obj.originalState.scaleY);
    //     obj.setScaleX(obj.originalState.scaleX);        
    //   }
    //   obj.setCoords();
    //   if(obj.getBoundingRect().top - (obj.cornerSize / 2) < 0 || 
    //     obj.getBoundingRect().left -  (obj.cornerSize / 2) < 0) {
    //     obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top + (obj.cornerSize / 2));
    //     obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left + (obj.cornerSize / 2));    
    //   }
    //   if(obj.getBoundingRect().top+obj.getBoundingRect().height + obj.cornerSize  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width + obj.cornerSize  > obj.canvas.width) {
    
    //     obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top - obj.cornerSize / 2);
    //     obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left - obj.cornerSize /2);    
    //   }
    // });
  
    this.fabricInstance.observe('object:moving', function (e) {
      var obj = e.target;

      // TODO: for exception case just return


      // if object is too big ignore
      if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
        return;
      }
      obj.setCoords();
      // top-left  corner
      if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
      }
      // bot-right corner
      if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
      }
    });
  }

  setBgImage(url: any) {
    this.bgFillType = FILL_TYPE_IMAGE;
    this.fabricInstance.backgroundColor = null;
    // TODO, auto layout the bg image
    this.fabricInstance.setBackgroundImage(url, 
      this.fabricInstance.renderAll.bind(this.fabricInstance),
      {
        left: 100,
        top: 100,
      }
    )

  }

  setBgImageLayout() {

  }


  setBgColor(color: any) {
    this.bgFillType = FILL_TYPE_COLOR;
    this.fabricInstance.backgroundImage = null;
    this.fabricInstance.setBackgroundColor(color, this.update.bind(this));




  }






}


