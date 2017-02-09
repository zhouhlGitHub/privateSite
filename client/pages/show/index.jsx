import Page from '../../page';

export default class HomePage extends Page {
  constructor(...args) {
    super(...args);
  }
  render() {
    return (
      <div class="home-page">this is a show page from react </div>
    )
  }
}
