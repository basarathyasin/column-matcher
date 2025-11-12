import React, { useState, useCallback, useEffect } from 'react';
import { Sheet } from './components/Sheet';
import { ColumnSelector } from './components/ColumnSelector';
import { Notification } from './components/Notification';
import { Results } from './components/Results';

const App = () => {
  const [sheetA, setSheetA] = useState([]);
  const [sheetB, setSheetB] = useState([]);
  const [highlightedValuesA, setHighlightedValuesA] = useState(new Set());
  const [highlightedValuesB, setHighlightedValuesB] = useState(new Set());
  const [stats, setStats] = useState({ matched: 0, unmatched: 0 });
  const [matchedData, setMatchedData] = useState([]);
  const [unmatchedData, setUnmatchedData] = useState([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedColA, setSelectedColA] = useState('');
  const [selectedColB, setSelectedColB] = useState('');

  // Load data from memory on mount
  useEffect(() => {
    const savedA = sessionStorage.getItem('sheetA');
    const savedB = sessionStorage.getItem('sheetB');
    if (savedA) setSheetA(JSON.parse(savedA));
    if (savedB) setSheetB(JSON.parse(savedB));
  }, []);

  // Save data to memory whenever it changes
  useEffect(() => {
    if (sheetA.length > 0) {
      sessionStorage.setItem('sheetA', JSON.stringify(sheetA));
    }
  }, [sheetA]);

  useEffect(() => {
    if (sheetB.length > 0) {
      sessionStorage.setItem('sheetB', JSON.stringify(sheetB));
    }
  }, [sheetB]);

  // Reset results when either sheet is cleared
  useEffect(() => {
    if (sheetA.length === 0 || sheetB.length === 0) {
      setHighlightedValuesA(new Set());
      setHighlightedValuesB(new Set());
      setStats({ matched: 0, unmatched: 0 });
      setMatchedData([]);
      setUnmatchedData([]);
      setSelectedColA('');
      setSelectedColB('');
    }
  }, [sheetA.length, sheetB.length]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset everything? This will clear all data and cannot be undone.')) {
      setSheetA([]);
      setSheetB([]);
      setHighlightedValuesA(new Set());
      setHighlightedValuesB(new Set());
      setStats({ matched: 0, unmatched: 0 });
      setMatchedData([]);
      setUnmatchedData([]);
      setSelectedColA('');
      setSelectedColB('');
      sessionStorage.removeItem('sheetA');
      sessionStorage.removeItem('sheetB');
      showNotification('All data has been reset!', 'info');
    }
  };

  const handleColumnSelect = useCallback((colA, colB) => {
    setSelectedColA(colA);
    setSelectedColB(colB);

    const processValue = (v) => {
      if (!v) return '';
      let processed = v.toString();
      if (trimWhitespace) processed = processed.trim();
      if (!caseSensitive) processed = processed.toLowerCase();
      return processed;
    };

    const valuesA = sheetA
      .map(row => row[colA]?.toString())
      .filter(v => v);
    
    const valuesB = sheetB
      .map(row => row[colB]?.toString())
      .filter(v => v);

    const valuesASet = new Set(valuesA.map(processValue).filter(v => v));
    const valuesBSet = new Set(valuesB.map(processValue).filter(v => v));

    const matches = new Set([...valuesASet].filter(v => valuesBSet.has(v)));
    const allValues = new Set([...valuesASet, ...valuesBSet]);
    const unmatched = [...allValues].filter(v => !matches.has(v));

    setHighlightedValuesA(matches);
    setHighlightedValuesB(matches);
    setStats({ matched: matches.size, unmatched: unmatched.length });
    
    const matchedOriginal = [...matches].map(m => {
      return valuesA.find(v => processValue(v) === m) || 
             valuesB.find(v => processValue(v) === m);
    });
    
    const unmatchedOriginal = unmatched.map(u => {
      return valuesA.find(v => processValue(v) === u) || 
             valuesB.find(v => processValue(v) === u);
    });

    setMatchedData(matchedOriginal);
    setUnmatchedData(unmatchedOriginal);
  }, [sheetA, sheetB, caseSensitive, trimWhitespace]);

  const handleExport = (type) => {
    let data = [];
    let filename = '';

    if (type === 'matched') {
      data = matchedData;
      filename = 'matched_values.csv';
    } else {
      data = [
        'Matched Values',
        ...matchedData,
        '',
        'Unmatched Values',
        ...unmatchedData
      ];
      filename = 'comparison_results.csv';
    }

    const csv = data.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification(`Exported ${type === 'matched' ? 'matched values' : 'all results'} successfully!`);
  };

  return (
    <>
  
      <div className="app">
        {notification && (
          <Notification 
            message={notification.message} 
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <header>
          <div className="header-content">
            <div className="header-text">
              <h1>📊 Sheet Comparison Tool</h1>
              <p>Compare data from Excel/Google Sheets • Paste, Compare, Analyze • Auto-saves your work</p>
            </div>
            <button className="reset-all-btn" onClick={handleResetAll}>
              🔄 Reset All
            </button>
          </div>
        </header>

        <Results 
          matchedData={matchedData} 
          unmatchedData={unmatchedData}
          onExport={handleExport}
        />
        
        <div className="main-content">
          <Sheet 
            data={sheetA} 
            setData={setSheetA} 
            sheetName="Sheet A" 
            highlightedValues={highlightedValuesA}
          />
          
          <ColumnSelector 
            sheetA={sheetA} 
            sheetB={sheetB} 
            onSelect={handleColumnSelect}
            stats={stats}
            caseSensitive={caseSensitive}
            setCaseSensitive={setCaseSensitive}
            trimWhitespace={trimWhitespace}
            setTrimWhitespace={setTrimWhitespace}
            selectedColA={selectedColA}
            selectedColB={selectedColB}
          />
          
          <Sheet 
            data={sheetB} 
            setData={setSheetB} 
            sheetName="Sheet B" 
            highlightedValues={highlightedValuesB}
          />
        </div>
      </div>
    </>
  );
};

export default App;