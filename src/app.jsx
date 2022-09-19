import './app.css';
import FrameList from './components/frame_list/frame_list';

function App() {
  const frames = [1, 2, 3];

  return <FrameList frames={frames} />;
}

export default App;
