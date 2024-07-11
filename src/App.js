import './App.css';
import Table from './pages/table';
import { useState } from 'react';

function App() {
  const [view, setView] = useState('HOME');
 
  document.title = 'Tickets Table';
  return (
    <div>
      {view === 'HOME' ?
        <Table setView={setView}/>
      :null}
    </div>
  );
}

export default App;
