import React, { useEffect, useState } from "react";
import { apiGet } from "./api/apiClient";
import type { AtRiskVehicle, StatusCount, Trip } from "./types";

const DashboardPage: React.FC = () => {
  const [evStatus, setEvStatus] = useState<StatusCount[]>([]);
  const [chargerStatus, setChargerStatus] = useState<StatusCount[]>([]);
  const [atRisk, setAtRisk] = useState<AtRiskVehicle[]>([]);
  const [todayTrips, setTodayTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="section">
      <h2>Dashboard</h2>

      {loading && <p>Loading dashboard...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Status cards row */}
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          marginTop: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 8,
            minWidth: 200,
          }}
        >
          <h3>EVs by Status</h3>
          {evStatus.length === 0 && <p>No EV data.</p>}
          {evStatus.map((s) => (
            <div key={s.status}>
              {s.status}: <strong>{s.count}</strong>
            </div>
          ))}
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: 12,
            borderRadius: 8,
            minWidth: 200,
          }}
        >
          <h3>Chargers by Status</h3>
          {chargerStatus.length === 0 && <p>No charger data.</p>}
          {chargerStatus.map((s) => (
            <div key={s.status}>
              {s.status}: <strong>{s.count}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* At-risk vehicles (Table 1) */}
      <div style={{ marginBottom: 24 }}>
        <h3>At-risk Vehicles (next 4 hours)</h3>
        {atRisk.length === 0 && <p>No at-risk vehicles.</p>}
        {atRisk.length > 0 && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>EV ID</th>
                  <th>Registration</th>
                  <th>Battery %</th>
                  <th>Last Seen</th>
                  <th>Trip ID</th>
                  <th>Trip Start</th>
                  <th>Origin</th>
                  <th>Destination</th>
                </tr>
              </thead>
              <tbody>
                {atRisk.map((v) => (
                  <tr key={v.tripId}>
                    <td>{v.evId}</td>
                    <td>{v.registration}</td>
                    <td>{v.currentBatteryPercent}</td>
                    <td>{v.lastSeenAt}</td>
                    <td>{v.tripId}</td>
                    <td>{v.tripStartTime}</td>
                    <td>{v.tripOrigin}</td>
                    <td>{v.tripDestination}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Today's trips (Table 2) */}
      <div style={{ marginBottom: 24 }}>
        <h3>Today&apos;s Trips</h3>
        {todayTrips.length === 0 && <p>No trips today.</p>}
        {todayTrips.length > 0 && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>EV</th>
                  <th>Driver</th>
                  <th>Status</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Origin</th>
                  <th>Destination</th>
                </tr>
              </thead>
              <tbody>
                {todayTrips.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.ev.registration}</td>
                    <td>{t.driver.name}</td>
                    <td>{t.status}</td>
                    <td>{t.startTime}</td>
                    <td>{t.endTime ?? "-"}</td>
                    <td>{t.origin}</td>
                    <td>{t.destination}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button onClick={loadData} style={{ width: 180 }}>
        Refresh Dashboard
      </button>
    </div>
  );
};

export default DashboardPage;
