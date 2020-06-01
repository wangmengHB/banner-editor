import * as React from 'react';
import { Button, Modal, Slider, Icon, Divider, Checkbox, message } from 'antd';
import styles from './index.module.less';
import classnames from 'classnames';
import ToolItem from './tool-item';
import { TOOL_TEXT_BOX, TOOL_IMAGE_ZONE } from '../../const';



export interface ToolboxProps{
  className?: string;
  style?: React.CSSProperties;
  controller: any;
}




export default class Toolbox extends React.Component<ToolboxProps>{

  
  render() {
    const { className, style, controller } = this.props;
    let TOOL_LIST = [ TOOL_IMAGE_ZONE, TOOL_TEXT_BOX ];
    
    
    return (
      <div className={classnames([styles['toolbox-panel'], className])} style={style}>
        <div className={styles['title']}>工具箱</div>
        <div className={styles['toolbox']}>
          {
            TOOL_LIST.map((shape, index) => <ToolItem shape={shape} key={shape.type || index} />)
          }  
        </div>
      </div>
    )
  }

}