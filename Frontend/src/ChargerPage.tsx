import React, { useEffect, useState } from "react";
import type { Charger, ChargerStatus } from "./types";
import { apiGet, apiPost } from "./api/apiClient";

const emptyForm: Omit<Charger, "id"> = {
  locationName: "",
  maxPowerKW: 0,
  status: "AVAILABLE",
};

const statusOptions: ChargerStatus[] = ["AVAILABLE", "IN_USE", "FAULTY"];

const ChargerPage: React.FC = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Charger, "id">>(emptyForm);
  const [creating, setCreating] = useState(false);

  async function loadChargers() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Charger[]>("/chargers");
      setChargers(data);
    } catch {
      setError("Failed to load chargers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChargers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "maxPowerKW") return { ...prev, maxPowerKW: Number(value) };
      if (name === "status") return { ...prev, status: value as ChargerStatus };
      return { ...prev, [name]: value };
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);
      const newCharger = await apiPost<Charger, typeof form>("/chargers", form);
      setChargers((prev) => [...prev, newCharger]);
      setForm(emptyForm);
    } catch {
      setError("Failed to create charger");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="section" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 2 }}>
        <h2>Chargers</h2>
        {loading && <p>Loading chargers...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && chargers.length === 0 && <p>No chargers found.</p>}
        {!loading && chargers.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Max Power (kW)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {chargers.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.locationName}</td>
                  <td>{c.maxPowerKW}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ flex: 1 }} className="form-card">
        <h3>Create New Charger</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label>
            Location Name:
            <input
              type="text"
              name="locationName"
              value={form.locationName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Max Power (kW):
            <input
              type="number"
              name="maxPowerKW"
              value={form.maxPowerKW}
              onChange={handleInputChange}
              required
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
            {creating ? "Creating..." : "Create Charger"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChargerPage;
