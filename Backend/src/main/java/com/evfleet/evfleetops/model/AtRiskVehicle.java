package com.evfleet.evfleetops.model;

import java.time.Instant;

public class AtRiskVehicle {

    private Long evId;
    private String registration;
    private Integer currentBatteryPercent;
    private Instant lastSeenAt;

    private Long tripId;
    private Instant tripStartTime;
    private String tripOrigin;
    private String tripDestination;

    public AtRiskVehicle() {
    }

    public AtRiskVehicle(Long evId, String registration,
                         Integer currentBatteryPercent, Instant lastSeenAt,
                         Long tripId, Instant tripStartTime,
                         String tripOrigin, String tripDestination) {
        this.evId = evId;
        this.registration = registration;
        this.currentBatteryPercent = currentBatteryPercent;
        this.lastSeenAt = lastSeenAt;
        this.tripId = tripId;
        this.tripStartTime = tripStartTime;
        this.tripOrigin = tripOrigin;
        this.tripDestination = tripDestination;
    }

    public Long getEvId() {
        return evId;
    }

    public void setEvId(Long evId) {
        this.evId = evId;
    }

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public Integer getCurrentBatteryPercent() {
        return currentBatteryPercent;
    }

    public void setCurrentBatteryPercent(Integer currentBatteryPercent) {
        this.currentBatteryPercent = currentBatteryPercent;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public Instant getTripStartTime() {
        return tripStartTime;
    }

    public void setTripStartTime(Instant tripStartTime) {
        this.tripStartTime = tripStartTime;
    }

    public String getTripOrigin() {
        return tripOrigin;
    }

    public void setTripOrigin(String tripOrigin) {
        this.tripOrigin = tripOrigin;
    }

    public String getTripDestination() {
        return tripDestination;
    }

    public void setTripDestination(String tripDestination) {
        this.tripDestination = tripDestination;
    }
}
