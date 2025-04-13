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

  // Icon component
  const GlassesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

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
      <div className="min-h-screen flex flex-col bg-gray-950 text-gray-200">
        <NavBar setJournalData={setJournalData} />
        
        <div className="flex flex-1 p-4">
          <div className="w-64 mr-6">
            <div className="p-4 bg-gray-800/50 rounded-lg shadow-lg border border-teal-900/50">
              <h3 className="text-lg font-medium mb-3 text-center text-teal-300 flex items-center justify-center">
                <GlassesIcon /> 
                Select Recording Date
              </h3>
              <Datepicker 
                onChange={handleDateChange} 
                value={date}
                theme={{
                  root: {
                    base: "relative",
                  },
                  popup: {
                    root: {
                      base: "absolute top-10 z-50 block pt-2",
                      inline: "relative top-0 z-auto",
                      inner: "inline-block rounded-lg bg-gray-700 p-4 shadow-lg dark:bg-gray-700",
                    },
                    header: {
                      base: "",
                      title: "bg-gray-700 px-2 py-3 text-center font-semibold text-white dark:bg-gray-700 dark:text-white",
                      selectors: {
                        base: "mb-2 flex justify-between",
                        button: {
                          base: "rounded-lg bg-gray-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                          prev: "",
                          next: "",
                          view: "",
                        },
                      },
                    },
                    view: {
                      base: "p-1",
                    },
                    footer: {
                      base: "mt-2 flex justify-between",
                      button: {
                        base: "w-full rounded-lg px-5 py-2 text-center text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-gray-500",
                        today: "bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700",
                        clear: "border border-gray-300 bg-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600",
                      },
                    },
                  },
                  views: {
                    days: {
                      header: {
                        base: "mb-1 grid grid-cols-7",
                        title: "h-6 text-center text-sm font-medium leading-6 text-gray-400 dark:text-gray-400",
                      },
                      items: {
                        base: "grid w-64 grid-cols-7",
                        item: {
                          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-100 hover:bg-gray-600 dark:text-white dark:hover:bg-gray-600",
                          selected: "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700",
                          disabled: "text-gray-500",
                        },
                      },
                    },
                    months: {
                      items: {
                        base: "grid w-64 grid-cols-4",
                        item: {
                          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-100 hover:bg-gray-600 dark:text-white dark:hover:bg-gray-600",
                          selected: "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700",
                          disabled: "text-gray-500",
                        },
                      },
                    },
                    years: {
                      items: {
                        base: "grid w-64 grid-cols-4",
                        item: {
                          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-100 hover:bg-gray-600 dark:text-white dark:hover:bg-gray-600",
                          selected: "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700",
                          disabled: "text-gray-500",
                        },
                      },
                    },
                    decades: {
                      items: {
                        base: "grid w-64 grid-cols-4",
                        item: {
                          base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-100 hover:bg-gray-600 dark:text-white dark:hover:bg-gray-600",
                          selected: "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700",
                          disabled: "text-gray-500",
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          
          <div className="flex-1 bg-gray-800/50 rounded-lg shadow-lg p-6 border border-teal-900/50">
            <Routes>
              <Route path='/' element={<Main />}/>
              <Route path='/journal' element={<Page title={journalData.title} text={journalData.text} />}/>
            </Routes>
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