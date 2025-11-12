import { useEffect, useState } from "react";

export const ColumnSelector = ({ sheetA, sheetB, onSelect, stats, caseSensitive, setCaseSensitive, trimWhitespace, setTrimWhitespace, selectedColA, selectedColB }) => {
  const [colA, setColA] = useState(selectedColA || '');
  const [colB, setColB] = useState(selectedColB || '');

  const columnsA = sheetA.length > 0 ? Object.keys(sheetA[0]) : [];
  const columnsB = sheetB.length > 0 ? Object.keys(sheetB[0]) : [];

  // Auto-select if only one column exists
  useEffect(() => {
    if (columnsA.length === 1 && !colA) {
      setColA(columnsA[0]);
      if (colB) {
        onSelect(columnsA[0], colB);
      }
    }
  }, [columnsA, colA, colB, onSelect]);

  useEffect(() => {
    if (columnsB.length === 1 && !colB) {
      setColB(columnsB[0]);
      if (colA) {
        onSelect(colA, columnsB[0]);
      }
    }
  }, [columnsB, colB, colA, onSelect]);

  // Update when selected columns change from parent
  useEffect(() => {
    if (selectedColA !== undefined) setColA(selectedColA);
  }, [selectedColA]);

  useEffect(() => {
    if (selectedColB !== undefined) setColB(selectedColB);
  }, [selectedColB]);

  const handleSelection = (newColA, newColB) => {
    setColA(newColA);
    setColB(newColB);
    if (newColA && newColB) {
      onSelect(newColA, newColB);
    }
  };

  return (
    <div className="column-selector">
      <h3>📊 Compare Columns</h3>
      
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

      <div className="options-group">
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
          />
          Case Sensitive
        </label>
        <label className="checkbox-label">
          <input 
            type="checkbox" 
            checked={trimWhitespace}
            onChange={(e) => setTrimWhitespace(e.target.checked)}
          />
          Trim Whitespace
        </label>
      </div>
    </div>
  );
};
