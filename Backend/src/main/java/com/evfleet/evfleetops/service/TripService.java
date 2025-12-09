package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.*;
import com.evfleet.evfleetops.repository.DriverRepository;
import com.evfleet.evfleetops.repository.EvRepository;
import com.evfleet.evfleetops.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final EvRepository evRepository;
    private final DriverRepository driverRepository;

    public TripService(TripRepository tripRepository,
                       EvRepository evRepository,
                       DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.evRepository = evRepository;
        this.driverRepository = driverRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Optional<Trip> getTripById(Long id) {
        return tripRepository.findById(id);
    }

    public Trip createTrip(TripRequest request) {
        // Validate that end time is provided
        if (request.getEndTime() == null) {
            throw new RuntimeException("End time is required");
        }
        
        // Validate that end time is after start time
        Instant startTime = request.getStartTime() != null ? request.getStartTime() : Instant.now();
        if (request.getEndTime().isBefore(startTime)) {
            throw new RuntimeException("End time must be after start time");
        }

        Ev ev = evRepository.findById(request.getEvId())
                .orElseThrow(() -> new RuntimeException("EV not found with id " + request.getEvId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + request.getDriverId()));

        // Check for existing trips that would cause a scheduling conflict for the driver
        List<Trip> conflictingDriverTrips = tripRepository.findByDriverAndTimeOverlap(
                driver,
                startTime,
                request.getEndTime()
        );
        if (!conflictingDriverTrips.isEmpty()) {
            throw new RuntimeException("Driver is already assigned to another trip during the requested time period");
        }

        // Check for existing trips that would cause a scheduling conflict for the EV
        List<Trip> conflictingEvTrips = tripRepository.findByEvAndTimeOverlap(
                ev,
                startTime,
                request.getEndTime()
        );
        if (!conflictingEvTrips.isEmpty()) {
            throw new RuntimeException("EV is already assigned to another trip during the requested time period");
        }

        Trip trip = new Trip();
        trip.setEv(ev);
        trip.setDriver(driver);
        trip.setStartTime(startTime);
        trip.setEndTime(request.getEndTime());
        trip.setStatus(request.getStatus() != null ? request.getStatus() : TripStatus.PLANNED);
        trip.setOrigin(request.getOrigin());
        trip.setDestination(request.getDestination());

        return tripRepository.save(trip);
    }

    public Trip updateTrip(Long id, TripRequest request) {
        return tripRepository.findById(id)
                .map(existing -> {
                    // Validate that end time is provided
                    if (request.getEndTime() == null) {
                        throw new RuntimeException("End time is required");
                    }
                    
                    // Validate that end time is after start time
                    Instant startTime = request.getStartTime() != null ? request.getStartTime() : existing.getStartTime();
                    if (request.getEndTime().isBefore(startTime)) {
                        throw new RuntimeException("End time must be after start time");
                    }

                    Ev ev = request.getEvId() != null ? 
                        evRepository.findById(request.getEvId())
                            .orElseThrow(() -> new RuntimeException("EV not found with id " + request.getEvId())) :
                        existing.getEv();
                    
                    Driver driver = request.getDriverId() != null ? 
                        driverRepository.findById(request.getDriverId())
                            .orElseThrow(() -> new RuntimeException("Driver not found with id " + request.getDriverId())) :
                        existing.getDriver();

                    // Check for scheduling conflicts (excluding current trip)
                    if (request.getDriverId() != null || request.getStartTime() != null) {
                        List<Trip> conflictingDriverTrips = tripRepository.findByDriverAndTimeOverlapExcludingId(
                                driver,
                                startTime,
                                request.getEndTime(),
                                id
                        );
                        if (!conflictingDriverTrips.isEmpty()) {
                            throw new RuntimeException("Driver is already assigned to another trip during the requested time period");
                        }
                    }

                    if (request.getEvId() != null || request.getStartTime() != null) {
                        List<Trip> conflictingEvTrips = tripRepository.findByEvAndTimeOverlapExcludingId(
                                ev,
                                startTime,
                                request.getEndTime(),
                                id
                        );
                        if (!conflictingEvTrips.isEmpty()) {
                            throw new RuntimeException("EV is already assigned to another trip during the requested time period");
                        }
                    }

                    if (request.getEvId() != null) {
                        existing.setEv(ev);
                    }
                    if (request.getDriverId() != null) {
                        existing.setDriver(driver);
                    }
                    if (request.getStartTime() != null) {
                        existing.setStartTime(request.getStartTime());
                    }
                    existing.setEndTime(request.getEndTime());
                    if (request.getStatus() != null) {
                        existing.setStatus(request.getStatus());
                    }
                    existing.setOrigin(request.getOrigin());
                    existing.setDestination(request.getDestination());
                    return tripRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Trip not found with id " + id));
    }

    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip not found with id " + id);
        }
        tripRepository.deleteById(id);
    }

    public List<Trip> getTodayTrips() {
        // Use system default timezone instead of UTC
        ZoneId zoneId = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zoneId);
        Instant startOfDay = today.atStartOfDay(zoneId).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(zoneId).toInstant();
        return tripRepository.findByStartTimeBetween(startOfDay, endOfDay);
    }
}
