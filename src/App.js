import './App.css';
import Dashboard from './pages/dashboard';
import { useState } from 'react';

function App() {
  const [view, setView] = useState('HOME');
 
  document.title = 'Ticket Dashboard';
  return (
    <div>
      {view === 'HOME' ?
        <Dashboard setView={setView}/>
      :null}
    </div>
  );
}

export default App;
