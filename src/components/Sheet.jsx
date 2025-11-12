import React, { useCallback } from 'react';

export const Sheet = ({ data, setData, sheetName, highlightedValues }) => {
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const rows = pastedText.split('\n').map(row => row.split('\t'));
    
    // Auto-expand: create enough rows and columns
    const maxCols = Math.max(...rows.map(r => r.length));
    const newData = rows.map((row) => {
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