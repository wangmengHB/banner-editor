import * as React from 'react';
import classnames from 'classnames';
import { Icon, Button, Input, InputNumber, Form, Row, Col, Radio } from 'antd';
import styles from './index.module.less';
import Controller from '../../controller';
import { MIN_POS_VAL, MAX_POS_VAL } from '../../const';

import SAMPLE from '../../../assets/style_2_wave.jpeg';
import SAMPLE2 from '../../../assets/person.jpg';

let uid = 0;
function getSample() {
  let idx = uid % 2;
  uid++;
  return [SAMPLE, SAMPLE2][idx];
}


const FormItem = Form.Item;


const formLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};



export default class ImageBox extends React.Component<any, any> {

  addOrReplaceImage = () => {
    const { controller, layer } = this.props;
    controller.addOrReplaceImage(layer, getSample());
  }

  render() {
    const {layer, controller } = this.props;
    const { name, id, actMode } = layer;
    const image = controller.getReferenceImage(id);
    const isActive = controller.isItemActive(id);
    let ele;
    if (image) {
      ele = image.getElement();
    }
    
    return (
      <div className={classnames({[styles.layer]: true, [styles.active]: isActive}) }>
        <div className={styles.fieldItem}>
          <span className={styles.label}>类型: </span>
          <span className={styles.value}>{name}</span>
        </div>
        

        <Form >
          <FormItem {...formLayout2} label="图片">
            <div
              onClick={this.addOrReplaceImage}  
              className={classnames({ [styles['thunb-container']]: true })}
              ref={(node: HTMLElement | null) => {
                if (node && ele) {
                  node.innerHTML = '';
                  node.appendChild(ele);
                }
              }}
            />
          </FormItem>
          <FormItem {...formLayout2} label="操作">
            <Radio.Group value={actMode} disabled={!image} buttonStyle="solid" onChange={(e: any) => { controller.changeActMode(layer, e.target.value)}}>
              <Radio.Button value="rect">区域</Radio.Button>
              <Radio.Button value="image">图片</Radio.Button>
            </Radio.Group>
          </FormItem>
        </Form>
      </div>
    )
  }

}

