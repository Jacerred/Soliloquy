import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Page from './components/Page';
import NavBar from './components/Navbar';
import Main from './pages/Main';
import { Datepicker } from "flowbite-react";
import { useState } from 'react';

function App() {
  const [date, setDate] = useState(new Date());
  const [journalData, setJournalData] = useState({ title: "", text: "" });

  // Main content component that includes the date picker and navigation logic
  function MainContent() {
    const navigate = useNavigate();
    
    const handleDateChange = (selectedDate) => {
      setDate(selectedDate);
      console.log('Datepicker value:', selectedDate);
      
      // Format date as YYYY-MM-DD for API request
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Create form data
      const formData = new FormData();
      formData.append('date', formattedDate);
      
      // Make POST request to backend
      fetch('http://localhost:8000/api/getJournal', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          // Save journal data and navigate to journal page
          setJournalData({
            title: formattedDate,
            text: data.response
          });
          navigate('/journal');
        })
        .catch(error => {
          console.error('Error fetching journal:', error);
        });
    };

    return (
      <>
        <NavBar />
        <div className='flex'>
          <div className='h-full'>
            <Datepicker onChange={handleDateChange} value={date}/>
          </div>
          <div className='w-full h-full'>
            <Routes>
              <Route path='/' element={< Main />}/>
              <Route path='/journal' element={< Page title={journalData.title} text={journalData.text} />}/>
            </Routes>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className='flex'>

      </div>
      <div className='bg-gray-900 text-white'>
        <Router>
          <MainContent />
        </Router>
      </div>
    </>
  );
}

export default App;