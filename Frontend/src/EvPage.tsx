import React, { useEffect, useState } from "react";
import type { Ev, EvStatus } from "./types";
import { apiGet, apiPost } from "./api/apiClient";

const emptyForm: Omit<Ev, "id"> = {
  registration: "",
  model: "",
  batteryCapacityKWh: 0,
  currentBatteryPercent: 100,
  status: "IDLE",
  lastKnownLatitude: null,
  lastKnownLongitude: null,
  lastSeenAt: null,
};

const statusOptions: EvStatus[] = ["IDLE", "DRIVING", "CHARGING", "MAINTENANCE"];

const EvPage: React.FC = () => {
  const [evs, setEvs] = useState<Ev[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Ev, "id">>(emptyForm);
  const [creating, setCreating] = useState<boolean>(false);

  async function loadEvs() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Ev[]>("/evs");
      setEvs(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load EVs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvs();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "batteryCapacityKWh") {
        return { ...prev, [name]: Number(value) };
      }
      if (name === "currentBatteryPercent") {
        return { ...prev, [name]: Number(value) };
      }
      if (name === "status") {
        return { ...prev, status: value as EvStatus };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);

      console.log('Creating EV with data:', form);
      
      try {
        // First, test the connection to the API
        const testResponse = await fetch('http://localhost:8081/api/evs', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('Test connection status:', testResponse.status);
        const testData = await testResponse.text();
        console.log('Test response:', testData);
      } catch (testError) {
        console.error('Test connection failed:', testError);
      }

      // Now try to create the EV
      console.log('Sending POST request to /api/evs with data:', JSON.stringify(form, null, 2));
      
      const newEv = await apiPost<Ev, Omit<Ev, "id">>("/evs", form);
      
      console.log('EV created successfully:', newEv);
      
      setEvs((prev) => [...prev, newEv]);
      setForm(emptyForm);
      
      // Refresh the list to ensure we have the latest data
      await loadEvs();
      
    } catch (err: any) {
      console.error('Error in handleCreate:', err);
      
      let errorMessage = 'Failed to create EV';
      
      // Try to extract more detailed error information
      if (err.message) {
        errorMessage += `: ${err.message}`;
        
        // Try to parse the error message as JSON
        try {
          const errorMatch = err.message.match(/\{.*\}/);
          if (errorMatch) {
            const errorObj = JSON.parse(errorMatch[0]);
            if (errorObj.message) {
              errorMessage = errorObj.message;
            }
          }
        } catch (e) {
          console.log('Could not parse error message as JSON');
        }
      }
      
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="section"
      style={{ display: "flex", justifyContent: "space-between", gap: 32 }}
    >
      <div style={{ flex: 1 }}>
        <h2>EVs</h2>
        {loading && <p>Loading EVs...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && evs.length === 0 && <p>No EVs found.</p>}
        {!loading && evs.length > 0 && (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Regn</th>
                  <th>Model</th>
                  <th>Battery kWh</th>
                  <th>Battery %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {evs.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.id}</td>
                    <td>{ev.registration}</td>
                    <td>{ev.model}</td>
                    <td>{ev.batteryCapacityKWh}</td>
                    <td>{ev.currentBatteryPercent}%</td>
                    <td>{ev.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="form-card" style={{ flex: 1 }}>
        <h3>Create New EV</h3>
        <form
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <label>
            Registration:
            <input
              type="text"
              name="registration"
              value={form.registration}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Model:
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Battery Capacity (kWh):
            <input
              type="number"
              name="batteryCapacityKWh"
              value={form.batteryCapacityKWh}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Current Battery (%):
            <input
              type="number"
              name="currentBatteryPercent"
              value={form.currentBatteryPercent}
              onChange={handleInputChange}
              required
              min={0}
              max={100}
            />
          </label>

          <label>
            Status:
            <select name="status" value={form.status} onChange={handleInputChange}>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create EV"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EvPage;
