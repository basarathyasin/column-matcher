import React, { useState, useCallback } from 'react';

const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
  color: #333;
  margin-bottom: 10px;
}

header p {
  color: #666;
  font-size: 14px;
}

.main-content {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}

.sheet-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex: 1;
  min-width: 400px;
  max-width: 600px;
}

.sheet-container h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 8px;
}

.sheet-wrapper {
  overflow: auto;
  max-height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.sheet-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.sheet-table thead {
  position: sticky;
  top: 0;
  background: #f8f9fa;
  z-index: 10;
}

.sheet-table th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #555;
  border: 1px solid #ddd;
  background: #f8f9fa;
  font-size: 14px;
}

.sheet-table td {
  padding: 0;
  border: 1px solid #e0e0e0;
  background: white;
  transition: background-color 0.2s;
}

.sheet-table td:hover {
  background: #f9f9f9;
}

.sheet-table td.highlighted {
  background: #fff59d !important;
}

.sheet-table td.highlighted:hover {
  background: #fff176 !important;
}

.sheet-table td input {
  width: 100%;
  padding: 8px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}

.sheet-table td input:focus {
  background: #e3f2fd;
}

.row-number {
  background: #f8f9fa !important;
  font-weight: 600;
  color: #666;
  text-align: center;
  font-size: 12px;
  width: 40px;
  padding: 8px !important;
}

.column-selector {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 250px;
  align-self: flex-start;
  position: sticky;
  top: 20px;
}

.column-selector h3 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  font-size: 16px;
}

.stats-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.stat-box {
  flex: 1;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.stat-box.matched {
  background: #e8f5e9;
  border: 2px solid #4CAF50;
}

.stat-box.unmatched {
  background: #fff3e0;
  border: 2px solid #FF9800;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-box.matched .stat-number {
  color: #2e7d32;
}

.stat-box.unmatched .stat-number {
  color: #ef6c00;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selector-group {
  margin-bottom: 20px;
}

.selector-group label {
  display: block;
  color: #555;
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 14px;
}

.selector-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.selector-group select:hover {
  border-color: #4CAF50;
}

.selector-group select:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .sheet-container {
    max-width: none;
  }
  
  .column-selector {
    position: static;
    order: -1;
  }
}
`;

// Sheet Component
const Sheet = ({ data, setData, sheetName, highlightedValues }) => {
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const rows = pastedText.split('\n').map(row => row.split('\t'));
    
    // Auto-expand: create enough rows and columns
    const maxCols = Math.max(...rows.map(r => r.length));
    const newData = rows.map((row, i) => {
      const rowData = {};
      for (let j = 0; j < maxCols; j++) {
        const colName = String.fromCharCode(65 + j); // A, B, C...
        rowData[colName] = row[j] || '';
      }
      return rowData;
    });
    
    setData(newData);
  }, [setData]);

  const handleCellChange = (rowIdx, colKey, value) => {
    const newData = [...data];
    newData[rowIdx] = { ...newData[rowIdx], [colKey]: value };
    setData(newData);
  };

  // Get all column keys from first row
  const columns = data.length > 0 ? Object.keys(data[0]) : ['A', 'B', 'C', 'D', 'E'];
  
  // Ensure we have at least 10 rows
  const rows = data.length > 0 ? data : Array(10).fill(null).map(() => {
    const row = {};
    columns.forEach(col => row[col] = '');
    return row;
  });

  return (
    <div className="sheet-container">
      <h2>{sheetName}</h2>
      <div className="sheet-wrapper" onPaste={handlePaste}>
        <table className="sheet-table">
          <thead>
            <tr>
              <th>#</th>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="row-number">{rowIdx + 1}</td>
                {columns.map(col => {
                  const value = row[col] || '';
                  const isHighlighted = highlightedValues.has(value.toString().trim().toLowerCase());
                  return (
                    <td key={col} className={isHighlighted ? 'highlighted' : ''}>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleCellChange(rowIdx, col, e.target.value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ColumnSelector Component
const ColumnSelector = ({ sheetA, sheetB, onSelect, stats }) => {
  const [colA, setColA] = useState('');
  const [colB, setColB] = useState('');

  const columnsA = sheetA.length > 0 ? Object.keys(sheetA[0]) : [];
  const columnsB = sheetB.length > 0 ? Object.keys(sheetB[0]) : [];

  const handleSelection = (newColA, newColB) => {
    setColA(newColA);
    setColB(newColB);
    if (newColA && newColB) {
      onSelect(newColA, newColB);
    }
  };

  return (
    <div className="column-selector">
      <h3>Compare Columns</h3>
      
      {stats.matched > 0 && (
        <div className="stats-container">
          <div className="stat-box matched">
            <div className="stat-number">{stats.matched}</div>
            <div className="stat-label">Matching</div>
          </div>
          <div className="stat-box unmatched">
            <div className="stat-number">{stats.unmatched}</div>
            <div className="stat-label">Not Matching</div>
          </div>
        </div>
      )}
      
      <div className="selector-group">
        <label>
          Sheet A Column:
          <select 
            value={colA} 
            onChange={(e) => handleSelection(e.target.value, colB)}
          >
            <option value="">-- Select --</option>
            {columnsA.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="selector-group">
        <label>
          Sheet B Column:
          <select 
            value={colB} 
            onChange={(e) => handleSelection(colA, e.target.value)}
          >
            <option value="">-- Select --</option>
            {columnsB.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

// Main App Component
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
      <style>{styles}</style>
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