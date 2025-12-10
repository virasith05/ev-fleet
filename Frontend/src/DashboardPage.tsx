import React, { useEffect, useState } from "react";
import { apiGet } from "./api/apiClient";
import type { AtRiskVehicle, StatusCount, Trip } from "./types";

// Helper function to format date and time in local timezone
const formatDateTime = (dateTimeString: string | null | undefined) => {
  if (!dateTimeString) return '-';
  
  // Parse the date string and create a Date object
  const date = new Date(dateTimeString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date string:', dateTimeString);
    return 'Invalid date';
  }
  
  // Format the date and time in the local timezone
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  };
  
  return date.toLocaleString('en-US', options);
};

const DashboardPage: React.FC = () => {
  const [evStatus, setEvStatus] = useState<StatusCount[]>([]);
  const [chargerStatus, setChargerStatus] = useState<StatusCount[]>([]);
  const [atRisk, setAtRisk] = useState<AtRiskVehicle[]>([]);
  const [todayTrips, setTodayTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Status color mapping
  const statusColors = {
    COMPLETED: { bg: '#e3fcef', text: '#00a854' },
    IN_PROGRESS: { bg: '#e3f2fd', text: '#1976d2' },
    PLANNED: { bg: '#fff3e0', text: '#f57c00' },
    CANCELLED: { bg: '#f5f5f5', text: '#757575' }
  };
  
  const getStatusStyle = (status: string) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.8em',
    fontWeight: 500,
    backgroundColor: statusColors[status as keyof typeof statusColors]?.bg || '#f5f5f5',
    color: statusColors[status as keyof typeof statusColors]?.text || '#757575',
    display: 'inline-block',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap'
  });

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [evRes, chargerRes, atRiskRes, todayTripsRes] = await Promise.all([
        apiGet<StatusCount[]>("/dashboard/ev-status"),
        apiGet<StatusCount[]>("/dashboard/charger-status"),
        apiGet<AtRiskVehicle[]>("/dashboard/at-risk?hours=4"),
        apiGet<Trip[]>("/dashboard/today-trips"),
      ]);

      setEvStatus(evRes);
      setChargerStatus(chargerRes);
      setAtRisk(atRiskRes);
      setTodayTrips(todayTripsRes);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard Overview</h1>
        <div style={styles.headerActions}>
          <button 
            onClick={loadData} 
            style={styles.refreshButton}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </header>

      {error && (
        <div style={styles.errorAlert}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} style={styles.closeButton}>
            &times;
          </button>
        </div>
      )}

      {/* Status Cards */}
      <div style={styles.cardsContainer}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <span style={styles.cardIcon}>🚗</span> EVs by Status
            </h3>
          </div>
          <div style={styles.cardBody}>
            {evStatus.length === 0 ? (
              <p style={styles.noData}>No EV data available</p>
            ) : (
              <div style={styles.statusList}>
                {evStatus.map((s) => (
                  <div key={s.status} style={styles.statusItem}>
                    <span style={styles.statusLabel}>{s.status.toLowerCase()}:</span>
                    <strong style={styles.statusValue}>{s.count}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>
              <span style={styles.cardIcon}>🔌</span> Chargers by Status
            </h3>
          </div>
          <div style={styles.cardBody}>
            {chargerStatus.length === 0 ? (
              <p style={styles.noData}>No charger data available</p>
            ) : (
              <div style={styles.statusList}>
                {chargerStatus.map((s) => (
                  <div key={s.status} style={styles.statusItem}>
                    <span style={styles.statusLabel}>{s.status.toLowerCase()}:</span>
                    <strong style={styles.statusValue}>{s.count}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* At-risk vehicles */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>At-risk Vehicles</h2>
          <p style={styles.sectionSubtitle}>Vehicles that may require attention in the next 4 hours</p>
        </div>
        
        {atRisk.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No at-risk vehicles detected</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>EV ID</th>
                  <th style={styles.tableHeader}>Registration</th>
                  <th style={{...styles.tableHeader, textAlign: 'right'}}>Battery %</th>
                  <th style={styles.tableHeader}>Last Seen</th>
                  <th style={styles.tableHeader}>Trip ID</th>
                  <th style={styles.tableHeader}>Trip Start</th>
                  <th style={styles.tableHeader}>Origin</th>
                  <th style={styles.tableHeader}>Destination</th>
                </tr>
              </thead>
              <tbody>
                {atRisk.map((v) => (
                  <tr key={v.tripId} style={styles.tableRow}>
                    <td style={styles.tableCell}>{v.evId}</td>
                    <td style={styles.tableCell}><strong>{v.registration}</strong></td>
                    <td style={{...styles.tableCell, textAlign: 'right'}}>
                      <div style={{
                        ...getStatusStyle(v.currentBatteryPercent < 20 ? 'LOW' : 'NORMAL'),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px'
                      }}>
                        {v.currentBatteryPercent}%
                      </div>
                    </td>
                    <td style={styles.tableCell}>{formatDateTime(v.lastSeenAt)}</td>
                    <td style={styles.tableCell}><code>{v.tripId}</code></td>
                    <td style={styles.tableCell}>{formatDateTime(v.tripStartTime)}</td>
                    <td style={styles.tableCell}>{v.tripOrigin}</td>
                    <td style={styles.tableCell}>{v.tripDestination}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Today's trips */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Today's Trips</h2>
          <p style={styles.sectionSubtitle}>All trips scheduled for {new Date().toLocaleDateString()}</p>
        </div>
        
        {todayTrips.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No trips scheduled for today</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Trip ID</th>
                  <th style={styles.tableHeader}>EV</th>
                  <th style={styles.tableHeader}>Driver</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Start Time</th>
                  <th style={styles.tableHeader}>End Time</th>
                  <th style={styles.tableHeader}>Origin</th>
                  <th style={styles.tableHeader}>Destination</th>
                </tr>
              </thead>
              <tbody>
                {todayTrips.map((t) => (
                  <tr key={t.id} style={styles.tableRow}>
                    <td style={styles.tableCell}><code>{t.id}</code></td>
                    <td style={styles.tableCell}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>🚗</span>
                        <span>{t.ev.registration}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span>👤</span>
                        <span>{t.driver.name}</span>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={getStatusStyle(t.status)}>
                        {t.status.toLowerCase().replace('_', ' ')}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{whiteSpace: 'nowrap'}}>{formatDateTime(t.startTime)}</div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{whiteSpace: 'nowrap', color: t.endTime ? 'inherit' : '#999'}}>
                        {t.endTime ? formatDateTime(t.endTime) : '-'}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} 
                           title={t.origin}>
                        {t.origin}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}
                           title={t.destination}>
                        {t.destination}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  dashboardContainer: {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '24px',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1a1a1a',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc'
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  refreshButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2563eb'
    },
    ':disabled': {
      backgroundColor: '#93c5fd',
      cursor: 'not-allowed'
    }
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeft: '4px solid #ef4444'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#b91c1c',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '0 8px',
    lineHeight: 1
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
    }
  },
  cardHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc'
  },
  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  cardIcon: {
    fontSize: '20px'
  },
  cardBody: {
    padding: '20px'
  },
  statusList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '8px',
    borderBottom: '1px solid #f1f5f9',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0
    }
  },
  statusLabel: {
    color: '#64748b',
    textTransform: 'capitalize',
    fontSize: '14px'
  },
  statusValue: {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: 600
  },
  noData: {
    color: '#64748b',
    textAlign: 'center',
    padding: '16px 0',
    margin: 0,
    fontSize: '14px'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    marginBottom: '24px',
    overflow: 'hidden'
  },
  sectionHeader: {
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 4px 0'
  },
  sectionSubtitle: {
    color: '#64748b',
    margin: 0,
    fontSize: '14px'
  },
  emptyState: {
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
    color: '#64748b',
    border: '1px dashed #e2e8f0'
  },
  tableContainer: {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '16px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1000px'
  },
  tableHeaderRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  tableHeader: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap'
  },
  tableRow: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f8fafc'
    },
    ':last-child': {
      borderBottom: 'none'
    }
  },
  tableCell: {
    padding: '16px',
    verticalAlign: 'middle',
    fontSize: '14px',
    color: '#334155',
    lineHeight: 1.5
  }
} as const;

// Add keyframes for the loading spinner
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Add the keyframes to a style element in the head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = keyframes;
  document.head.appendChild(styleElement);
}

export default DashboardPage;
