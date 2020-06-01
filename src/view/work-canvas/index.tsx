import * as React from 'react';
import classnames from 'classnames';
import styles from './index.module.less';

export interface CanvasSpaceProps{
  className?: string;
  style?: React.CSSProperties;
  controller: any;
}

export default class CanvasSpace extends React.Component<CanvasSpaceProps> {


  componentDidMount() {
    const { controller } = this.props;  
    const workspaceNode = this.refs.workspace;
    if (!workspaceNode) {
      throw new Error('failed to get canvas element!');
    }
    controller.mountAt(workspaceNode);

  }

  render() {

    const { className, style } = this.props;

    return (
      <div className={classnames([styles['work-canvas'], className])} style={style}>
        <div ref="workspace" className={styles['canvas-zone']}></div>
      </div>
    )
  }


}