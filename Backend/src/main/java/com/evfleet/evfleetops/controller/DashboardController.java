package com.evfleet.evfleetops.controller;

import com.evfleet.evfleetops.model.AtRiskVehicle;
import com.evfleet.evfleetops.model.StatusCount;
import com.evfleet.evfleetops.model.Trip;
import com.evfleet.evfleetops.service.DashboardService;
import com.evfleet.evfleetops.service.TripService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final TripService tripService;

    public DashboardController(DashboardService dashboardService,
                               TripService tripService) {
        this.dashboardService = dashboardService;
        this.tripService = tripService;
    }

    @GetMapping("/ev-status")
    public List<StatusCount> getEvStatusSummary() {
        return dashboardService.getEvStatusSummary();
    }

    @GetMapping("/charger-status")
    public List<StatusCount> getChargerStatusSummary() {
        return dashboardService.getChargerStatusSummary();
    }

    @GetMapping("/at-risk")
    public List<AtRiskVehicle> getAtRiskVehicles(
            @RequestParam(name = "hours", defaultValue = "4") int hoursAhead) {
        return dashboardService.getAtRiskVehicles(hoursAhead);
    }

    @GetMapping("/today-trips")
    public List<Trip> getTodayTrips() {
        return tripService.getTodayTrips();
    }
}
