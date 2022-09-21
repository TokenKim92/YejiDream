import Gallery from './components/gallery/gallery';
import styles from './app.module.css';
import MockYoutube from './service/mock_youtube/mock_youtube';

function App() {
  const youtube = new MockYoutube();

  return <Gallery youtube={youtube} />;
}

export default App;
