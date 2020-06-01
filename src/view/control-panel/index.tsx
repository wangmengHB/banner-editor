import * as React from 'react';
import classnames from 'classnames';
import { Icon, Button, Input, InputNumber, Form, Row, Col, Radio } from 'antd';
import styles from './index.module.less';
import Controller from '../../controller';
import { MIN_POS_VAL, MAX_POS_VAL, TEMPLATE_TYPE_NORMAL } from '../../const';
import SpecRule from './spec-rule';

const FormItem = Form.Item;

const formLayout2 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};


export interface ImageLayerListProps{
  className?: string;
  style?: React.CSSProperties;
  controller: Controller;
}



export default class ImageLayerList extends React.Component<ImageLayerListProps> {

  

  render() {
    const { className, style, controller } = this.props;
    const { width, height } = controller.getDimension();
    const ruleLineList = controller.getRuleLineList();


    return (
      <div className={classnames([styles['control-panel'], className])} style={style}>
        <div className={styles['title']}>属性配置</div>
        <div className={styles['list']}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout2}  label="宽">
                <InputNumber
                  disabled={controller.templateType !== TEMPLATE_TYPE_NORMAL}
                  value={Math.floor(width)}
                  min={MIN_POS_VAL}
                  max={MAX_POS_VAL}
                  step={1}
                  onChange={(val) => controller.changeDimension('width', val)}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formLayout2} label="高">
                <InputNumber
                  disabled={controller.templateType !== TEMPLATE_TYPE_NORMAL} 
                  value={Math.floor(height)}
                  min={MIN_POS_VAL}
                  max={MAX_POS_VAL}
                  step={1}
                  onChange={(val) => controller.changeDimension('height', val)}
                />
              </FormItem>
            </Col>
          </Row>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="模板名称">
            <Input
              
            />
          </FormItem>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}  label="适用场景">
            <Input     
            />
          </FormItem>
        </Form>
          
        </div>
        
        <div className={styles['title']}>
          背景设置
        </div>
        <div className={styles['list']}>
          <Radio.Group defaultValue="a" buttonStyle="solid">
            <Radio.Button value="a">指定素材</Radio.Button>
            <Radio.Button value="b">填充颜色</Radio.Button>
          </Radio.Group>
        </div>
        <div className={styles['title']}>
          图层设置
        </div>
        <div className={styles['list']}>
          {
            ruleLineList.map((rule) => <SpecRule key={rule.id} rule={rule} controller={controller}/>)
          }

        </div>
      </div>
    )
  }


}

