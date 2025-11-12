import React, { useState, useCallback } from 'react';
import { Sheet } from './components/Sheet';
import { ColumnSelector } from './components/CoumnSelector';

const App = () => {
  const [sheetA, setSheetA] = useState([]);
  const [sheetB, setSheetB] = useState([]);
  const [highlightedValuesA, setHighlightedValuesA] = useState(new Set());
  const [highlightedValuesB, setHighlightedValuesB] = useState(new Set());
  const [stats, setStats] = useState({ matched: 0, unmatched: 0 });

  const handleColumnSelect = useCallback((colA, colB) => {
    // Get values from selected columns
    const valuesA = new Set(
      sheetA
        .map(row => row[colA]?.toString().trim().toLowerCase())
        .filter(v => v)
    );
    const valuesB = new Set(
      sheetB
        .map(row => row[colB]?.toString().trim().toLowerCase())
        .filter(v => v)
    );

    // Find intersection
    const matches = new Set([...valuesA].filter(v => valuesB.has(v)));
    
    // Calculate stats - total unique values from both sheets
    const allValues = new Set([...valuesA, ...valuesB]);
    const matchedCount = matches.size;
    const unmatchedCount = allValues.size - matchedCount;

    setHighlightedValuesA(matches);
    setHighlightedValuesB(matches);
    setStats({ matched: matchedCount, unmatched: unmatchedCount });
  }, [sheetA, sheetB]);

  return (
    <>
      <div className="app">
        <header>
          <h1>Sheet Comparison Tool</h1>
          <p>Paste data from Excel/Google Sheets (Ctrl+V), then select columns to compare</p>
        </header>
        
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