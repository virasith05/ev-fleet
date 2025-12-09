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
      
      console.log('Creating driver with data:', form);
      
      // First, test the connection to the API
      try {
        const testResponse = await fetch('http://localhost:8081/api/drivers', {
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

      // Now try to create the driver
      console.log('Sending POST request to /api/drivers with data:', JSON.stringify(form, null, 2));
      
      const newDriver = await apiPost<Driver, typeof form>("/drivers", form);
      
      console.log('Driver created successfully:', newDriver);
      
      setDrivers((prev) => [...prev, newDriver]);
      setForm(emptyForm);
      
      // Refresh the list to ensure we have the latest data
      await loadDrivers();
      
    } catch (err: any) {
      console.error('Error in handleCreate:', err);
      
      let errorMessage = 'Failed to create driver';
      
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
