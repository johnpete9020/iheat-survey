import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './App.css'; // Reuses your existing dashboard styling

const AdminDashboard = () => {
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllSubmissions();
  }, []);

  const fetchAllSubmissions = async () => {
    setIsLoading(true);
    // Fetch all rows from your Supabase table
    const { data, error } = await supabase
      .from('iheat_responses')
      .select('*')
      .order('id', { ascending: false }); // Ensures newest entries show up first

    if (error) {
      console.error("Error fetching admin data:", error);
    } else {
      setAllData(data || []);
    }
    setIsLoading(false);
  };

  // --- CSV EXPORT LOGIC ---
  const exportToCSV = () => {
    if (allData.length === 0) {
      alert("No data to export!");
      return;
    }

    // Grab headers from the first row
    const headers = Object.keys(allData[0]).join(',');

    // Map through rows and handle potential commas or quotes inside the data
    const csvRows = allData.map(row => {
      return Object.values(row).map(value => {
        const escaped = ('' + (value !== null ? value : '')).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',');
    });

    // Create and trigger download
    const csvString = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'iheat_all_responses.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // --- CHART AGGREGATION LOGIC ---
  // Calculates the top 10 most frequently selected food items
  const getChartData = () => {
    const counts = {};
    allData.forEach(row => {
      const item = row.food_item;
      if (item && item !== 'None') {
        counts[item] = (counts[item] || 0) + 1;
      }
    });

    return Object.keys(counts)
      .map(key => ({ name: key, count: counts[key] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Adjust this number to show more or fewer bars
  };

  const chartData = getChartData();

  return (
    <div className="app-container" style={{ maxWidth: '1000px' }}>
      <h1 className="main-page-title">IHEAT Admin Dashboard</h1>
      
      {isLoading ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading database records...</p>
      ) : (
        <div className="dashboard-container">
          
          {/* HEADER CONTROLS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <p style={{ fontSize: '1.1rem', color: '#1e293b' }}>
              <strong>Total Records:</strong> {allData.length}
            </p>
            <button 
              onClick={exportToCSV} 
              style={{
                backgroundColor: '#10b981', color: '#fff', padding: '12px 20px', 
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              📥 Export All to CSV
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* TILE 1: DATA VISUALIZATION */}
            <div className="dashboard-card">
              <h3>Top 10 Logged Food Items</h3>
              <p className="score-desc" style={{ marginBottom: '15px' }}>Most frequently selected foods across all user sessions.</p>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      tick={{ fontSize: 12 }} 
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TILE 2: RECENT SUBMISSIONS TABLE */}
            <div className="dashboard-card" style={{ overflowX: 'auto' }}>
              <h3>Recent Database Submissions</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e1', color: '#475569' }}>
                    <th style={{ padding: '12px 10px' }}>Session ID</th>
                    <th style={{ padding: '12px 10px' }}>Food Group</th>
                    <th style={{ padding: '12px 10px' }}>Item</th>
                    <th style={{ padding: '12px 10px' }}>Portion</th>
                    <th style={{ padding: '12px 10px' }}>FNDDS Code</th>
                  </tr>
                </thead>
                <tbody>
                  {allData.slice(0, 15).map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 10px', fontFamily: 'monospace', color: '#64748b' }}>
                        {row.session_id ? row.session_id.substring(0, 8) + '...' : 'N/A'}
                      </td>
                      <td style={{ padding: '12px 10px' }}>{row.food_group}</td>
                      <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>{row.food_item}</td>
                      <td style={{ padding: '12px 10px' }}>{row.portion_size}</td>
                      <td style={{ padding: '12px 10px', color: '#0ea5e9' }}>{row.fndds_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.85rem' }}>
                Showing the 15 most recent rows. Use the CSV export button to view all {allData.length} records.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;