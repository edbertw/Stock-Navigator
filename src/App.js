import React, { useState } from 'react';
import './App.css';
import backgroundImage from '/Users/edbertwidjaja/my-app/src/ai-generated-8490532_640.webp'; // Local image
import { useNavigate, Routes, Route } from 'react-router-dom';
import NextPage from './NextPage'; // Import NextPage
import NextNextPage from './NextNextPage'; // Import NextNextPage

const logoImage = 'file.png'; 

const App = () => {
  const [selectedValue, setSelectedValue] = useState(''); // Selected stock
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate(); // Navigation

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value); // Update selected stock
  };

  const handleSubmit = () => {
    setLoading(true); // Show loading
    setError(''); // Clear errors

    // API call to submit stock
    fetch('http://localhost:8000/api/submit-stock/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stock_symbol: selectedValue, // Send selected stock
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.company) {
          // Navigate to NextPage with state
          navigate('/next-page', { state: { stockSymbol: selectedValue, company: data.company } });
        } else {
          setError(data.error || 'Company not found'); // Handle error
        }
        setLoading(false); // Hide loading
      })
      .catch(() => {
        setError('Error fetching company details'); // API call failed
        setLoading(false); // Hide loading
      });
  };

  return (
    <div className="app-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Routes>
        <Route path="/" element={
          <div className="content">
            <img src={logoImage} alt="Logo" className="app-logo" />
            <h1>Navigate Your Stocks in Real-time</h1>

            {/* Stock selection dropdown */}
            <label htmlFor="dropdown">Choose a stock: </label>
            <select id="dropdown" value={selectedValue} onChange={handleSelectChange}>
              <option value="" disabled>Select a stock</option>
              <option value="NVDA">NVIDIA</option>
              <option value="NDAQ">NASDAQ</option>
              <option value="TSLA">TESLA</option>
              <option value="HSBC">HSBC</option>
              <option value="JPM">JP Morgan</option>
            </select>

            {/* Submit button */}
            <button onClick={handleSubmit} disabled={!selectedValue || loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>

            {/* Error message */}
            {error && <p className="error">{error}</p>}
          </div>
        } />
        
        {/* Next pages */}
        <Route path="/next-page" element={<NextPage />} />
        <Route path="/next-next-page" element={<NextNextPage />} />
      </Routes>
    </div>
  );
};

export default App;
