import React, { useState } from "react";
import EvPage from "./EvPage";
import ChargerPage from "./ChargerPage";
import DriverPage from "./DriverPage";
import DashboardPage from "./DashboardPage";

type Page = "EV" | "CHARGER" | "DRIVER" | "DASHBOARD";

function App() {
  const [page, setPage] = useState<Page>("DASHBOARD");

  return (
    <div className="page-container">
      <h1 className="page-title">EV Fleet Ops Console</h1>

      {/* Navigation */}
      <div className="navbar-spacing" style={{ display: "flex", gap: 8 }}>
        <button
          className={page === "DASHBOARD" ? "navbar-btn-active" : ""}
          onClick={() => setPage("DASHBOARD")}
        >
          Dashboard
        </button>
        <button
          className={page === "EV" ? "navbar-btn-active" : ""}
          onClick={() => setPage("EV")}
        >
          EVs
        </button>
        <button
          className={page === "CHARGER" ? "navbar-btn-active" : ""}
          onClick={() => setPage("CHARGER")}
        >
          Chargers
        </button>
        <button
          className={page === "DRIVER" ? "navbar-btn-active" : ""}
          onClick={() => setPage("DRIVER")}
        >
          Drivers
        </button>
      </div>

      {/* Page View */}
      {page === "DASHBOARD" && <DashboardPage />}
      {page === "EV" && <EvPage />}
      {page === "CHARGER" && <ChargerPage />}
      {page === "DRIVER" && <DriverPage />}
    </div>
  );
}

export default App;
