package com.evfleet.evfleetops.model;

import java.time.Instant;

public class TelemetryRequest {

    private Long evId;
    private Integer batteryPercent;
    private EvStatus state;
    private Double odometerKm;
    private Double latitude;
    private Double longitude;
    private Instant timestamp; // can be null, we will default

    public TelemetryRequest() {
    }

    public Long getEvId() {
        return evId;
    }

    public void setEvId(Long evId) {
        this.evId = evId;
    }

    public Integer getBatteryPercent() {
        return batteryPercent;
    }

    public void setBatteryPercent(Integer batteryPercent) {
        this.batteryPercent = batteryPercent;
    }

    public EvStatus getState() {
        return state;
    }

    public void setState(EvStatus state) {
        this.state = state;
    }

    public Double getOdometerKm() {
        return odometerKm;
    }

    public void setOdometerKm(Double odometerKm) {
        this.odometerKm = odometerKm;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
