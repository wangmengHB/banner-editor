import * as React from 'react';
import classnames from 'classnames';
import { Icon, Button, Input, InputNumber, Form, Row, Col } from 'antd';
import styles from './index.module.less';
import Controller from '../../controller';
import { MIN_POS_VAL, MAX_POS_VAL } from '../../const';


const FormItem = Form.Item;


const formLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};



export default class TextBox extends React.Component<any, any> {


  onChange = (key, value) => {
    const { layer, controller } = this.props;
    controller.updateTextBox(layer, key, value);
  }

  render() {
    const {layer, controller } = this.props;
    const { name, id, text, fontSize, fontFamily, stroke, fill,  maxLength} = layer;

    const isActive = controller.isItemActive(id);

    return (
      <div className={classnames({[styles.layer]: true, [styles.active]: isActive}) }>
        <div className={styles.fieldItem}>
          <span className={styles.label}>类型: </span>
          <span className={styles.value}>{name}</span>
        </div>
        <Form >
          <FormItem {...formLayout2} label="字体">
            <Input 
              value={fontFamily} 
              onChange={(e:any) => this.onChange('fontFamily', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="大小">
            <Input 
              value={fontSize} 
              onChange={(e:any) => this.onChange('fontSize', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="颜色">
            <Input 
              value={stroke} 
              onChange={(e:any) => this.onChange('stroke', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="文本">
            <Input 
              value={text} 
              onChange={(e:any) => this.onChange('text', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="最大字数">
            <Input 
              value={maxLength} 
              onChange={(e:any) => this.onChange('maxLength', e.target.value)}
            />
          </FormItem>
               
        </Form>
      </div>
    )
  }

}

