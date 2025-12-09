package com.evfleet.evfleetops.repository;

import com.evfleet.evfleetops.model.Trip;
import com.evfleet.evfleetops.model.TripStatus;
import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByEv(Ev ev);

    List<Trip> findByStatusAndStartTimeBetween(
            TripStatus status, Instant start, Instant end);

    List<Trip> findByStartTimeBetween(Instant start, Instant end);
    
    @Query("SELECT t FROM Trip t WHERE " +
           "t.driver = :driver AND " +
           "((t.startTime < :endTime AND t.endTime > :startTime) OR " +
           "(t.startTime = :startTime AND t.endTime = :endTime))")
    List<Trip> findByDriverAndTimeOverlap(
        @Param("driver") Driver driver,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime
    );

    @Query("SELECT t FROM Trip t WHERE " +
           "t.ev = :ev AND " +
           "((t.startTime < :endTime AND t.endTime > :startTime) OR " +
           "(t.startTime = :startTime AND t.endTime = :endTime))")
    List<Trip> findByEvAndTimeOverlap(
        @Param("ev") Ev ev,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime
    );
    
    @Query("SELECT t FROM Trip t WHERE " +
           "t.driver = :driver AND " +
           "t.id != :excludeId AND " +
           "((t.startTime < :endTime AND t.endTime > :startTime) OR " +
           "(t.startTime = :startTime AND t.endTime = :endTime))")
    List<Trip> findByDriverAndTimeOverlapExcludingId(
        @Param("driver") Driver driver,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime,
        @Param("excludeId") Long excludeId
    );

    @Query("SELECT t FROM Trip t WHERE " +
           "t.ev = :ev AND " +
           "t.id != :excludeId AND " +
           "((t.startTime < :endTime AND t.endTime > :startTime) OR " +
           "(t.startTime = :startTime AND t.endTime = :endTime))")
    List<Trip> findByEvAndTimeOverlapExcludingId(
        @Param("ev") Ev ev,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime,
        @Param("excludeId") Long excludeId
    );
}
