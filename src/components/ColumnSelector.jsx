import { useState } from "react";

export const ColumnSelector = ({ sheetA, sheetB, onSelect, stats }) => {
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