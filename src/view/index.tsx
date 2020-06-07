import * as React from 'react';
import { Spin } from 'antd';
import ControlPanel from './control-panel';
import WorkCanvas from './work-canvas';
import Toolbox from './toolbox';
import classnames from 'classnames';
import styles from './style.less';
import Controller from '../controller';


export interface ImageEditorProps {
  className?: string;
  style?: React.CSSProperties;
  controller: Controller;
}

export interface ImageEditorState {
  
}


export default class ImageEditorView extends React.Component<ImageEditorProps, ImageEditorState> {

  constructor(props: ImageEditorProps) {
    super(props);
    const { controller } = this.props;
    controller.mountReactCmp(this);
  }

  

  render() {
    const { className, style, controller } = this.props;
    
    
    return (
      <Spin spinning={false} tip="处理中...">
        <div className={classnames([styles['banner-editor'], className])} style={style}>
          <div className={styles['main']}>
            <ControlPanel 
              className={styles['control-panel']}
              controller={controller}
            />
            <Toolbox 
              className={styles['toolbox']}
              controller={controller}
            />
            <WorkCanvas 
              className={styles['work-canvas']}
              controller={controller}
            />

          </div>

        </div>
      </Spin>
    )

  }

}

