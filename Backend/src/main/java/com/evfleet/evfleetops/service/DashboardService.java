package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.*;
import com.evfleet.evfleetops.repository.ChargerRepository;
import com.evfleet.evfleetops.repository.EvRepository;
import com.evfleet.evfleetops.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class DashboardService {

    private final EvRepository evRepository;
    private final ChargerRepository chargerRepository;
    private final TripRepository tripRepository;

    public DashboardService(EvRepository evRepository,
                            ChargerRepository chargerRepository,
                            TripRepository tripRepository) {
        this.evRepository = evRepository;
        this.chargerRepository = chargerRepository;
        this.tripRepository = tripRepository;
    }

    public List<StatusCount> getEvStatusSummary() {
        Map<EvStatus, Long> map = new EnumMap<>(EvStatus.class);
        for (EvStatus status : EvStatus.values()) {
            long count = evRepository.findByStatus(status).size();
            map.put(status, count);
        }
        List<StatusCount> result = new ArrayList<>();
        map.forEach((status, count) ->
                result.add(new StatusCount(status.name(), count)));
        return result;
    }

    public List<StatusCount> getChargerStatusSummary() {
        Map<ChargerStatus, Long> map = new EnumMap<>(ChargerStatus.class);
        for (ChargerStatus status : ChargerStatus.values()) {
            long count = chargerRepository.findByStatus(status).size();
            map.put(status, count);
        }
        List<StatusCount> result = new ArrayList<>();
        map.forEach((status, count) ->
                result.add(new StatusCount(status.name(), count)));
        return result;
    }

    public List<AtRiskVehicle> getAtRiskVehicles(int hoursAhead) {
        Instant now = Instant.now();
        Instant future = now.plus(hoursAhead, ChronoUnit.HOURS);

        List<Trip> plannedTrips = tripRepository
                .findByStatusAndStartTimeBetween(TripStatus.PLANNED, now, future);

        List<AtRiskVehicle> result = new ArrayList<>();

        for (Trip trip : plannedTrips) {
            Ev ev = trip.getEv();
            if (ev.getCurrentBatteryPercent() != null
                    && ev.getCurrentBatteryPercent() < 25) {
                result.add(new AtRiskVehicle(
                        ev.getId(),
                        ev.getRegistration(),
                        ev.getCurrentBatteryPercent(),
                        ev.getLastSeenAt(),
                        trip.getId(),
                        trip.getStartTime(),
                        trip.getOrigin(),
                        trip.getDestination()
                ));
            }
        }
        return result;
    }
}
