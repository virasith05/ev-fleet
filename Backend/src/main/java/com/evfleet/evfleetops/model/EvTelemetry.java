package com.evfleet.evfleetops.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "ev_telemetry")
public class EvTelemetry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Each telemetry sample belongs to one EV
    @ManyToOne(optional = false)
    @JoinColumn(name = "ev_id")
    private Ev ev;

    private Integer batteryPercent;

    @Enumerated(EnumType.STRING)
    private EvStatus state;

    private Double odometerKm;

    private Double latitude;
    private Double longitude;

    private Instant timestamp;

    public EvTelemetry() {
    }

    public EvTelemetry(Ev ev, Integer batteryPercent, EvStatus state,
                       Double odometerKm, Double latitude, Double longitude,
                       Instant timestamp) {
        this.ev = ev;
        this.batteryPercent = batteryPercent;
        this.state = state;
        this.odometerKm = odometerKm;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public Ev getEv() {
        return ev;
    }

    public void setEv(Ev ev) {
        this.ev = ev;
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
