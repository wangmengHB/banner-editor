import { fabric } from 'fabric';
import { 
  INIT_WIDTH, INIT_HEIGHT, CANVAS_PADDING, TEMPLATE_TYPE_NORMAL,  
  TYPE_IMAGE_BOX, TYPE_TEXT_BOX,
} from '../const';
import { getCoordinates } from 'web-util-kit'
import { generateUuid } from 'util-kit'


const LINE_WIDTH = 4;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.padding = 2;
fabric.Object.prototype.strokeWidth = LINE_WIDTH;
fabric.Object.prototype.cornerStyle = 'circle';





export default class Controller {

  templateType = TEMPLATE_TYPE_NORMAL;  // TEMPLATE_TYPE_TEMPLATE

  templateName = '';

  fabricInstance: fabric.Canvas;

  cmp: any;
  container: HTMLElement;

  width: number = INIT_WIDTH;
  height: number = INIT_HEIGHT;

  cssScale: number = 1;

  ruleLineList: any[] = [];
  ruleMap = new Map();


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
      flexible: true,
      id: generateUuid(),
    };

    let target;
    if (object.toolType === TYPE_TEXT_BOX) {
      target = new fabric.Textbox('这是一个文本输入框', obj);
    } else if (object.toolType === TYPE_IMAGE_BOX) {
      target = new fabric.Rect(obj);
    } else {
      console.error('未知的图形类型', obj);
      return;
    }


    this.fabricInstance.add(target);
    this.update();
  }

  onObjectModified = (e: any) => {
    const { target } = e;
    const {id, left, top, width, height, scaleX, scaleY, flexible } = target;
    target.set({ scaleX: 1, scaleY: 1, width: scaleX * width, height: scaleY * height});
  
    let rule: any = this.ruleMap.get(id);  
    if (!rule) {
      return console.error('failed to find rule!');
    }
    // update coordinates
    rule.left = left;
    rule.top = top; 
    rule.width = width * scaleX;
    rule.height = height * scaleY;
    this.update();
  }

  getRuleLineList() {
    const objects = this.fabricInstance.getObjects().filter(item => !!item.flexible);
    this.ruleLineList = objects.map((item) => {
      const {id, left, top, width, height, scaleX, scaleY } = item;
      let rule: any;
      rule = this.ruleMap.get(id);
      if (!rule) {
        rule = { id, name: "规则线名称", description: "规则线描述" };
        this.ruleMap.set(id, rule); 
      }
      // TODO convert shape info into template info
      const dims = this.getDimension();    
      // update coordinates
      rule.x = left / (dims.width);
      rule.y = top / (dims.height); 
      rule.w = width * scaleX / (dims.width);
      rule.h = height * scaleY / (dims.height);
      return rule;
    })
    return this.ruleLineList; 
  }

  updateRule(rule: any) {
    const { id, x, y, w, h, name, description } = rule;
    this.ruleMap.set(id, rule);
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




}


