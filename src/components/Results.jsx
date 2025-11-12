export const Results = ({ matchedData, unmatchedData, onExport }) => {
  if (matchedData.length === 0 && unmatchedData.length === 0) {
    return null;
  }

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>🔍 Analysis Results</h2>
        <div className="export-buttons">
          <button className="export-btn secondary" onClick={() => onExport('matched')}>
            📥 Export Matched
          </button>
          <button className="export-btn" onClick={() => onExport('all')}>
            📥 Export All
          </button>
        </div>
      </div>
      <div className="results-grid">
        <div className="result-card matched">
          <div className="result-header">
            <span className="result-title">✓ Matched Values</span>
            <span className="result-count">{matchedData.length}</span>
          </div>
          <div className="result-list">
            {matchedData.length > 0 ? (
              matchedData.map((item, idx) => (
                <div key={idx} className="result-item">{item}</div>
              ))
            ) : (
              <div className="empty-state">No matching values found</div>
            )}
          </div>
        </div>

        <div className="result-card unmatched">
          <div className="result-header">
            <span className="result-title">✗ Unmatched Values</span>
            <span className="result-count">{unmatchedData.length}</span>
          </div>
          <div className="result-list">
            {unmatchedData.length > 0 ? (
              unmatchedData.map((item, idx) => (
                <div key={idx} className="result-item">{item}</div>
              ))
            ) : (
              <div className="empty-state">All values matched!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};