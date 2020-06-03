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



export default class SpecRule extends React.Component<any, any> {


  onChange = (key, value) => {
    const { rule, controller } = this.props;
    const next = {...rule, [key]: value};
    controller.updateRule(next);
  }

  render() {
    const {rule, controller } = this.props;
    const { name, id } = rule;
    const conf = rule.conf || {};
    const { x, y, w, h, } = conf;

    const isActive = controller.isItemActive(id);

    return (
      <div className={classnames({[styles.rule]: true, [styles.active]: isActive}) }>
        <div className={styles.fieldItem}>
          <span className={styles.label}>类型: </span>
          <span className={styles.value}>{name}</span>
        </div>
        <Form >
          <FormItem {...formLayout2} label="字体">
            <Input 
              value={name} 
              onChange={(e:any) => this.onChange('name', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="大小">
            <Input 
              value={name} 
              onChange={(e:any) => this.onChange('name', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="颜色">
            <Input 
              value={name} 
              onChange={(e:any) => this.onChange('name', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="文本">
            <Input 
              value={name} 
              onChange={(e:any) => this.onChange('name', e.target.value)}
            />
          </FormItem>
          <FormItem {...formLayout2} label="最大字数">
            <Input 
              value={name} 
              onChange={(e:any) => this.onChange('name', e.target.value)}
            />
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout2} label="x">
              <InputNumber value={x} disabled onChange={(val:any) => this.onChange('left', val)}/>
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formLayout2} label="y">
              <InputNumber value={y} disabled onChange={(val:any) => this.onChange('top', val)}/>
            </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
            <FormItem {...formLayout2} label="w">
              <InputNumber value={w} disabled onChange={(val:any) => this.onChange('width', val)}/>
            </FormItem>
            </Col>
            <Col span={12}>
            <FormItem {...formLayout2} label="h">
              <InputNumber value={h} disabled onChange={(val:any) => this.onChange('height', val)}/>
            </FormItem>
            </Col>
          </Row>       
        </Form>
      </div>
    )
  }

}

