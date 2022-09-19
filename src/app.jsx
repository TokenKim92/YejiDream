import './app.css';
import FrameList from './components/frame_list/frame_list';

function App() {
  let count = 0;
  const frames = [
    { id: count++, title: 'example1', content: '' },
    { id: count++, title: 'example2', content: '' },
    { id: count++, title: 'example2', content: '' },
  ];

  return <FrameList frames={frames} />;
}

export default App;
