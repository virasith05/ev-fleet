import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "./api/apiClient";
import type { Trip, TripStatus, Ev, Driver } from "./types";

// Helper function to get local datetime string in YYYY-MM-DDThh:mm format
const getLocalDateTimeString = (date = new Date()) => {
  const tzOffset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
};

const emptyForm = {
  evId: 0,
  driverId: 0,
  startTime: getLocalDateTimeString(),
  endTime: getLocalDateTimeString(new Date(Date.now() + 3600000)), // 1 hour from now
  status: "PLANNED" as TripStatus,
  origin: "",
  destination: "",
};

const statusOptions: TripStatus[] = ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const TripPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [evs, setEvs] = useState<Ev[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch data...');
      
      // Test each endpoint individually to identify which one is failing
      try {
        console.log('Testing connection to /api/evs...');
        const testEvs = await fetch('http://localhost:8081/api/evs', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('EVs test response status:', testEvs.status);
        const testEvsData = await testEvs.text();
        console.log('EVs test response data:', testEvsData);
      } catch (testError) {
        console.error('Test fetch to /api/evs failed:', testError);
      }

      console.log('Fetching all data in parallel...');
      const [tripsRes, evsRes, driversRes] = await Promise.all([
        apiGet<Trip[]>("/trips").catch(err => {
          console.error('Error fetching trips:', err);
          return [];
        }),
        apiGet<Ev[]>("/evs").catch(err => {
          console.error('Error fetching EVs:', err);
          return [];
        }),
        apiGet<Driver[]>("/drivers").catch(err => {
          console.error('Error fetching drivers:', err);
          return [];
        }),
      ]);

      console.log('Trips data received:', tripsRes);
      console.log('EVs data received:', evsRes);
      console.log('Drivers data received:', driversRes);

      setTrips(tripsRes || []);
      setEvs(evsRes || []);
      setDrivers((driversRes || []).filter(d => d.active));
    } catch (err) {
      console.error('Error in loadData:', err);
      setError("Failed to load data. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'evId' || name === 'driverId' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate end time is after start time
    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError("End time must be after start time");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      // Log the form data before sending
      console.log('Form data before submission:', form);

      // Prepare trip data with proper date formatting
      const tripData = {
        evId: Number(form.evId),
        driverId: Number(form.driverId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: form.endTime ? new Date(form.endTime).toISOString() : null,
        status: form.status,
        origin: form.origin,
        destination: form.destination,
      };

      console.log('Submitting trip data:', JSON.stringify(tripData, null, 2));

      if (editingId) {
        console.log(`Updating trip with ID: ${editingId}`);
        const updated = await apiPut<Trip>(`/trips/${editingId}`, tripData);
        console.log('Trip updated successfully:', updated);
        setTrips(prev => prev.map(t => t.id === editingId ? updated : t));
      } else {
        console.log('Creating new trip');
        const newTrip = await apiPost<Trip>("/trips", tripData);
        console.log('Trip created successfully:', newTrip);
        setTrips(prev => [...prev, newTrip]);
      }

      // Reset form after successful submission
      setForm(emptyForm);
      setEditingId(null);
      
      // Refresh the data to ensure everything is in sync
      await loadData();
      
    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      
      // Default error message
      let errorMessage = `Failed to ${editingId ? 'update' : 'create'} trip`;
      
      if (err.message) {
        // Check for specific error patterns from the backend
        if (err.message.includes('Driver is already assigned to another trip')) {
          errorMessage = 'This driver is already booked for another trip during the selected time.';
        } else if (err.message.includes('EV is already assigned to another trip')) {
          errorMessage = 'This EV is already booked for another trip during the selected time.';
        } else if (err.message.includes('End time must be after start time')) {
          errorMessage = 'End time must be after start time';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please check your connection.';
        } else {
          // For other errors, try to extract a clean message
          try {
            const errorMatch = err.message.match(/\{.*\}/);
            if (errorMatch) {
              const errorObj = JSON.parse(errorMatch[0]);
              errorMessage = errorObj.message || errorMessage;
            } else {
              errorMessage = err.message;
            }
          } catch (e) {
            console.log('Could not parse error message');
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip: Trip) => {
    // Convert UTC times to local timezone for the form
    const formatForInput = (dateString: string) => {
      const date = new Date(dateString);
      return getLocalDateTimeString(date);
    };

    setForm({
      evId: trip.ev.id,
      driverId: trip.driver.id,
      startTime: formatForInput(trip.startTime),
      endTime: trip.endTime ? formatForInput(trip.endTime) : getLocalDateTimeString(new Date(trip.startTime)),
      status: trip.status,
      origin: trip.origin ?? "",
      destination: trip.destination ?? "",
    });
    setEditingId(trip.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      setLoading(true);
      await apiDelete(`/trips/${id}`);
      setTrips(prev => prev.filter(t => t.id !== id));
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Error deleting trip:', err);
      setError(err.message || 'Failed to delete trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  return (
    <div className="section">
      <h2>Trips</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Trip Form */}
      <div className="form-card" style={{ marginBottom: 32 }}>
        <h3>{editingId ? 'Edit' : 'Create New'} Trip</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <label>EV:</label>
            <select 
              name="evId" 
              value={form.evId} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select EV</option>
              {evs.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.registration} - {ev.model} ({ev.currentBatteryPercent}%)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Driver:</label>
            <select 
              name="driverId" 
              value={form.driverId} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.licenseId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Start Time:</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>End Time:</label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleInputChange}
              min={form.startTime}
              required
            />
          </div>

          <div>
            <label>Status:</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleInputChange}
              required
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Origin:</label>
            <input
              type="text"
              name="origin"
              value={form.origin}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>Destination:</label>
            <input
              type="text"
              name="destination"
              value={form.destination}
              onChange={handleInputChange}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading}>
              {editingId ? 'Update' : 'Create'} Trip
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Trips List */}
      <div>
        <h3>All Trips</h3>
        {trips.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>EV</th>
                  <th>Driver</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Route</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map(trip => (
                  <tr key={trip.id}>
                    <td>{trip.id}</td>
                    <td>{trip.ev?.registration || 'N/A'}</td>
                    <td>{trip.driver?.name || 'N/A'}</td>
                    <td>{formatDateTime(trip.startTime)}</td>
                    <td>{trip.endTime ? formatDateTime(trip.endTime) : '-'}</td>
                    <td>{trip.status.replace('_', ' ')}</td>
                    <td>{trip.origin} → {trip.destination}</td>
                    <td>
                      <button 
                        onClick={() => handleEdit(trip)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(trip.id)}
                        style={{ backgroundColor: '#ff4444' }}
                      >
                        Delete
                      </button>
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

export default TripPage;
