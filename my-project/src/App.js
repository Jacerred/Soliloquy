import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Upload from './components/Upload';
import Page from './components/Page';
import NavBar from './components/Navbar';
import Query from './components/Query';

function App() {
  return (
    <>
      <NavBar />
      <div className='flex'>

      </div>
      <div className='bg-gray=900 text-white'>
        <Router>
          <Routes>
            <Route path='/' element={< Query />}/>
            <Route path='/journal' element= {< Page />}/>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;