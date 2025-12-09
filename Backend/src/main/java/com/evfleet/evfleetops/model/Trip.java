package com.evfleet.evfleetops.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which EV
    @ManyToOne(optional = false)
    @JoinColumn(name = "ev_id")
    private Ev ev;

    // Which driver
    @ManyToOne(optional = false)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @Column(nullable = false)
    private Instant startTime;   // planned or actual

    private Instant endTime;     // can be null if not finished yet

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.PLANNED;

    private String origin;
    private String destination;

    public Trip() {
    }

    public Trip(Ev ev, Driver driver, Instant startTime,
                Instant endTime, TripStatus status,
                String origin, String destination) {
        this.ev = ev;
        this.driver = driver;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.origin = origin;
        this.destination = destination;
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

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }
}
