import * as React from 'react';
import classnames from 'classnames';
import { Icon, Button, Input, InputNumber, Form, Row, Col, Radio } from 'antd';
import styles from './index.module.less';
import Controller from '../../controller';
import { 
  MIN_POS_VAL, MAX_POS_VAL, TEMPLATE_TYPE_NORMAL,
  FILL_TYPE_IMAGE, FILL_TYPE_COLOR,
  TYPE_TEXT_BOX, TYPE_IMAGE_BOX,
} from '../../const';
import TextBox from './TextBox';
import ImageBox from './ImageBox';

import SAMPLE from '../../../assets/style_2_wave.jpeg';

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
    const layerList = controller.getLayerList();
    const { bgFillType } = controller;


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
            <Input />
          </FormItem>
          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}  label="适用场景">
            <Input />
          </FormItem>
        </Form>
          
        </div>
        
        <div className={styles['title']}>
          背景设置
        </div>
        <div className={styles['list']}>
          <Radio.Group 
            value={bgFillType} 
            buttonStyle="solid"
            onChange={(e) => {
              controller.bgFillType = e.target.value;
              this.forceUpdate();
            }}
          >
            <Radio.Button value={FILL_TYPE_IMAGE}>指定素材</Radio.Button>
            <Radio.Button value={FILL_TYPE_COLOR}>填充颜色</Radio.Button>
          </Radio.Group>
          {
            bgFillType === FILL_TYPE_IMAGE? (
              <div className={styles.imgList}>
                <div className={styles.imgItem} onClick={() => controller.setBgImage(SAMPLE)}>
                  <img src={SAMPLE}/>
                </div>
              </div>
            ): (
              <div className={styles.colorList}>
                <Button 
                  style={{ background: 'green'}} 
                  onClick={() => controller.setBgColor('green')}
                >
                  绿色
                </Button>
              </div>
            )
          }

        </div>
        <div className={styles['title']}>
          图层设置
        </div>
        <div className={styles['list']}>
          {
            layerList.map((layer) => {
              const { toolType } = layer;
              let tool = null;
              if ( toolType === TYPE_TEXT_BOX ) {
                tool = ( <TextBox key={layer.id} layer={layer} controller={controller}/> )
              } else if ( toolType === TYPE_IMAGE_BOX ) {
                tool = ( <ImageBox key={layer.id} layer={layer} controller={controller}/>)
              }
              return tool;
            })
          }

        </div>
      </div>
    )
  }


}

