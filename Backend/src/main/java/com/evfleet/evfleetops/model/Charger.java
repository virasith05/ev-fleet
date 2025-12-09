package com.evfleet.evfleetops.model;

import jakarta.persistence.*;

@Entity
@Table(name = "chargers")
public class Charger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String locationName;

    @Column(nullable = false)
    private Double maxPowerKW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChargerStatus status = ChargerStatus.AVAILABLE;

    public Charger() {
    }

    public Charger(String locationName, Double maxPowerKW, ChargerStatus status) {
        this.locationName = locationName;
        this.maxPowerKW = maxPowerKW;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Double getMaxPowerKW() {
        return maxPowerKW;
    }

    public void setMaxPowerKW(Double maxPowerKW) {
        this.maxPowerKW = maxPowerKW;
    }

    public ChargerStatus getStatus() {
        return status;
    }

    public void setStatus(ChargerStatus status) {
        this.status = status;
    }
}
