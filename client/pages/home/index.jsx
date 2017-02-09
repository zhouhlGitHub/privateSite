import React from 'react';
import Page from '../../page';

export default class HomePage extends Page {
  constructor(...args) {
    super(...args);
  }
  clickDiv(e) {
    console.log(e);
    console.log('click a text');
  }
  render() {
    return (
      <button class="home-page" onClick={this.clickDiv}>this is a home page from react </button>
    )
  }
}
