import * as React from 'react';
import { Button, Modal, Slider, Icon, Divider, Checkbox, message } from 'antd';
import styles from './index.module.less';
import classnames from 'classnames';
import { TOOL_TEXT_BOX, TOOL_IMAGE_ZONE, TYPE_TEXT_BOX, TYPE_IMAGE_BOX } from '../../const';


const LINE_WIDTH = 4;


function createDragCanvas(shape: any) {

  const { width, height, type, radius, stroke } = shape;
  const canvas = document.createElement('canvas');
  canvas.style.position = "absolute";
  canvas.style.left = "-1000px";
  
  document.body.appendChild(canvas);

  canvas.width = width + LINE_WIDTH * 2;
  canvas.height = height + LINE_WIDTH * 2;
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = LINE_WIDTH;
  ctx.strokeStyle = stroke || 'red';

  ctx.beginPath();  
  ctx.strokeRect(LINE_WIDTH, LINE_WIDTH, width, height);
  ctx.closePath();
  
  return {
    element: canvas,
    offsetX: width/2,
    offsetY: height/2,
    dispose: () => {
      document.body.removeChild(canvas);
    }
  };
}


export default class ToolItem extends React.Component<any, any> {
  
  _disposeDrag: Function;
  
  onDragStart = e => {
    const { shape } = this.props;
    const dt = e.dataTransfer;
    dt.setData('text/plain', JSON.stringify(shape));
    const { element, offsetX, offsetY, dispose } = createDragCanvas(shape);
    this._disposeDrag = dispose;
    dt.setDragImage(element, offsetX, offsetY);
  }


  onDragEnd = e => {
    if (typeof this._disposeDrag === 'function') {
      this._disposeDrag();
    }  
  }



  render() {
    const { shape } = this.props;
    const { type, name, stroke } = shape;

    let iconType;
    if (type === TYPE_IMAGE_BOX) {
      iconType = 'picture';
    } else if (type === TYPE_TEXT_BOX) {
      iconType = 'font-colors';
    }

    return (
      <div 
        className={styles['item']} 
        draggable={true} 
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        
      >
        <div 
          className={styles[`item-icon`]} 
        >
          <Icon type={iconType} />
        </div>
        <div className={styles['item-label']}>{name}</div>
      </div>
    )

  }

}