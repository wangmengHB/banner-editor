import 'antd/dist/antd.less';
import React from 'react';
import ReactDOM from 'react-dom';
import View from './view';
import Controller from './controller';


const root = document.createElement('div');
document.body.appendChild(root);

const controller = new Controller();


ReactDOM.render(<View controller={controller}/>, root);

