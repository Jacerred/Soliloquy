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
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Memory wave pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxwYXRoIGQ9Ik0gMCwxMCBDIDEwLDIwIDIwLDAgMjAsLTEwIiBzdHJva2U9InJnYmEoNjIsMTA0LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSI+PC9wYXRoPjwvcGF0dGVybj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIj48L3JlY3Q+PC9zdmc+')] opacity-20 pointer-events-none"></div>
        
        {/* Main content */}
        <div className="relative z-10 flex flex-col flex-1">
          <NavBar setJournalData={setJournalData} />
          
          <div className="flex flex-1 p-6">
            <div className="w-64 mr-6">
              <div className="p-4 bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(74,109,255,0.2)] border border-indigo-500/10">
                <h3 className="text-lg font-medium mb-4 text-center text-indigo-200">Memory Timeline</h3>
                <Datepicker 
                  onChange={handleDateChange} 
                  value={date}
                  theme={{
                    root: {
                      base: "relative",
                      input: {
                        base: "z-20 rounded-lg bg-slate-700/40 border border-indigo-500/30 focus:border-indigo-400"
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="flex-1 bg-slate-800/70 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(74,109,255,0.2)] p-6 border border-indigo-500/10">
              <Routes>
                <Route path='/' element={<Main />}/>
                <Route path='/journal' element={<Page title={journalData.title} text={journalData.text} />}/>
              </Routes>
            </div>
          </div>
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