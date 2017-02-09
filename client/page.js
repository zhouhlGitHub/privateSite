// import path from 'path';
import React from 'react';
import ReactDom from 'react-dom';

export default class Page extends React.Component {
  constructor(...args) {
    super(...args);
    let self = this;
    if(process.title == 'browser'){
      document.addEventListener('DOMContentLoaded', function(){
        self.domReady();
      });
    }
  }
  log(...msg){
    console.log(...msg);
  }
  domReady() {
    this.log('✓', 'Ready');
  }
}
