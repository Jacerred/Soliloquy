import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Page from './components/Page';
import NavBar from './components/Navbar';
import Main from './pages/Main';
import { Datepicker } from "flowbite-react";

function App() {
  return (
    <>
      <div className='flex'>

      </div>
      <div className='bg-gray-900 text-white'>
        <Router>
          <NavBar />
          <div className='flex'>
            <div className='h-full'>
              <Datepicker/>
            </div>
            <div className='w-full h-full'>
              <Routes>
                <Route path='/' element={< Main />}/>
                <Route path='/journal' element= {< Page />}/>
              </Routes>
            </div>
          </div>
          
        </Router>
      </div>
    </>
  );
}

export default App;