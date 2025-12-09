package com.evfleet.evfleetops.model;


import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "evs")
public class Ev {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registration;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Double batteryCapacityKWh;

    @Column(nullable = false)
    private Integer currentBatteryPercent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvStatus status = EvStatus.IDLE;

    // Telemetry-related fields
    private Double lastKnownLatitude;
    private Double lastKnownLongitude;

    private Instant lastSeenAt;

    // Constructors
    public Ev() {
    }

    public Ev(String registration, String model, Double batteryCapacityKWh,
              Integer currentBatteryPercent, EvStatus status) {
        this.registration = registration;
        this.model = model;
        this.batteryCapacityKWh = batteryCapacityKWh;
        this.currentBatteryPercent = currentBatteryPercent;
        this.status = status;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public String getRegistration() {
        return registration;
    }

    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Double getBatteryCapacityKWh() {
        return batteryCapacityKWh;
    }

    public void setBatteryCapacityKWh(Double batteryCapacityKWh) {
        this.batteryCapacityKWh = batteryCapacityKWh;
    }

    public Integer getCurrentBatteryPercent() {
        return currentBatteryPercent;
    }

    public void setCurrentBatteryPercent(Integer currentBatteryPercent) {
        this.currentBatteryPercent = currentBatteryPercent;
    }

    public EvStatus getStatus() {
        return status;
    }

    public void setStatus(EvStatus status) {
        this.status = status;
    }

    public Double getLastKnownLatitude() {
        return lastKnownLatitude;
    }

    public void setLastKnownLatitude(Double lastKnownLatitude) {
        this.lastKnownLatitude = lastKnownLatitude;
    }

    public Double getLastKnownLongitude() {
        return lastKnownLongitude;
    }

    public void setLastKnownLongitude(Double lastKnownLongitude) {
        this.lastKnownLongitude = lastKnownLongitude;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }
}
