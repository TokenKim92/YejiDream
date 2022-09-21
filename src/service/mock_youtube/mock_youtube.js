import data from './data.json';

class MockYoutube {
  getItems() {
    return data.items;
  }
}

export default MockYoutube;
