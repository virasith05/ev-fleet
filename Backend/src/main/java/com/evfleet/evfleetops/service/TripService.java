package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.*;
import com.evfleet.evfleetops.repository.DriverRepository;
import com.evfleet.evfleetops.repository.EvRepository;
import com.evfleet.evfleetops.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
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
        Ev ev = evRepository.findById(request.getEvId())
                .orElseThrow(() -> new RuntimeException("EV not found with id " + request.getEvId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + request.getDriverId()));

        Trip trip = new Trip();
        trip.setEv(ev);
        trip.setDriver(driver);
        trip.setStartTime(request.getStartTime() != null ? request.getStartTime() : Instant.now());
        trip.setEndTime(request.getEndTime());
        trip.setStatus(request.getStatus() != null ? request.getStatus() : TripStatus.PLANNED);
        trip.setOrigin(request.getOrigin());
        trip.setDestination(request.getDestination());

        return tripRepository.save(trip);
    }

    public Trip updateTrip(Long id, TripRequest request) {
        return tripRepository.findById(id)
                .map(existing -> {
                    if (request.getEvId() != null) {
                        Ev ev = evRepository.findById(request.getEvId())
                                .orElseThrow(() -> new RuntimeException("EV not found with id " + request.getEvId()));
                        existing.setEv(ev);
                    }
                    if (request.getDriverId() != null) {
                        Driver driver = driverRepository.findById(request.getDriverId())
                                .orElseThrow(() -> new RuntimeException("Driver not found with id " + request.getDriverId()));
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
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Instant startOfDay = today.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant endOfDay = today.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        return tripRepository.findByStartTimeBetween(startOfDay, endOfDay);
    }
}
