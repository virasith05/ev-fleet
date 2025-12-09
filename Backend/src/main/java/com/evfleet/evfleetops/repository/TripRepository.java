package com.evfleet.evfleetops.repository;

import com.evfleet.evfleetops.model.Trip;
import com.evfleet.evfleetops.model.TripStatus;
import com.evfleet.evfleetops.model.Ev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByEv(Ev ev);

    List<Trip> findByStatusAndStartTimeBetween(
            TripStatus status, Instant start, Instant end);

    List<Trip> findByStartTimeBetween(Instant start, Instant end);
}
