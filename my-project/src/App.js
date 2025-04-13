import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Page from './components/Page';
import NavBar from './components/Navbar';
import Main from './pages/Main';
import { Datepicker } from "flowbite-react";
import { useState } from 'react';
import JournalDatesList from './components/JournalDatesList';

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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white font-sans">
        <NavBar setJournalData={setJournalData} />
        
        <div className="flex flex-1 p-6">
          <div className="w-72 mr-6 relative z-10">
            <div className="p-5 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-indigo-500/20">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h3 className="text-lg font-medium text-center text-cyan-100">Your Memories</h3>
              </div>
              <p className="text-xs text-indigo-300 mb-4">Select a date to view your memories captured by your smart glasses</p>
              <Datepicker 
                onChange={handleDateChange} 
                value={date}
                theme={{
                  root: {
                    base: "relative"
                  }
                }}
              />
              
              {/* Journal Dates List */}
              <JournalDatesList setJournalData={setJournalData} />
            </div>
          </div>
          
          <div className="flex-1 bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-indigo-500/20">
            <Routes>
              <Route path='/' element={<Main />}/>
              <Route path='/journal' element={<Page title={journalData.title} text={journalData.text} />}/>
            </Routes>
          </div>
        </div>
        
        <div className="px-6 py-3 text-center text-xs text-indigo-300">
          <p>MemoryLens - Your personal memory journal powered by smart glasses</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

export default App;