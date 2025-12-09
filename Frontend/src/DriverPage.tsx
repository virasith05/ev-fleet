import React, { useEffect, useState } from "react";
import type { Driver } from "./types";
import { apiGet, apiPost, apiPut } from "./api/apiClient";

const emptyForm: Omit<Driver, "id"> = {
  name: "",
  phone: "",
  licenseId: "",
  active: true,
};

const DriverPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Driver, "id">>(emptyForm);
  const [creating, setCreating] = useState(false);

  async function loadDrivers() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet<Driver[]>("/drivers");
      setDrivers(data);
    } catch {
      setError("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      if (type === "checkbox") {
        return { ...prev, active: checked };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      setError(null);
      const newDriver = await apiPost<Driver, typeof form>("/drivers", form);
      setDrivers((prev) => [...prev, newDriver]);
      setForm(emptyForm);
    } catch {
      setError("Failed to create driver");
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (driver: Driver) => {
    try {
      setError(null);
      const updated = await apiPut<Driver, Driver>(`/drivers/${driver.id}`, {
        ...driver,
        active: !driver.active,
      });
      setDrivers((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    } catch {
      setError("Failed to update driver");
    }
  };

  return (
    <div className="section" style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
      <div style={{ flex: 2 }}>
        <h2>Drivers</h2>
        {loading && <p>Loading drivers...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && drivers.length === 0 && <p>No drivers found.</p>}
        {!loading && drivers.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>License</th>
                <th>Active</th>
                <th>Toggle</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.phone}</td>
                  <td>{d.licenseId}</td>
                  <td>{d.active ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => toggleActive(d)}>
                      Set {d.active ? "Inactive" : "Active"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ flex: 1 }} className="form-card">
        <h3>Create New Driver</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            License ID:
            <input
              type="text"
              name="licenseId"
              value={form.licenseId}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Active:
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleInputChange}
            />{" "}
            (checked = active)
          </label>

          <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Driver"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverPage;
