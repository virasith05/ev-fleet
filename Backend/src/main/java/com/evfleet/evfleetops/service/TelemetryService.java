package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.*;
import com.evfleet.evfleetops.repository.EvRepository;
import com.evfleet.evfleetops.repository.EvTelemetryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TelemetryService {

    private final EvRepository evRepository;
    private final EvTelemetryRepository telemetryRepository;

    public TelemetryService(EvRepository evRepository,
                            EvTelemetryRepository telemetryRepository) {
        this.evRepository = evRepository;
        this.telemetryRepository = telemetryRepository;
    }

    public Ev ingestTelemetry(TelemetryRequest request) {
        Ev ev = evRepository.findById(request.getEvId())
                .orElseThrow(() -> new RuntimeException("EV not found with id " + request.getEvId()));

        // Determine timestamp
        Instant ts = request.getTimestamp() != null
                ? request.getTimestamp()
                : Instant.now();

        // Update EV live fields
        if (request.getBatteryPercent() != null) {
            ev.setCurrentBatteryPercent(request.getBatteryPercent());
        }
        if (request.getState() != null) {
            ev.setStatus(request.getState());
        }
        if (request.getLatitude() != null) {
            ev.setLastKnownLatitude(request.getLatitude());
        }
        if (request.getLongitude() != null) {
            ev.setLastKnownLongitude(request.getLongitude());
        }
        ev.setLastSeenAt(ts);

        Ev savedEv = evRepository.save(ev);

        // Store telemetry history
        EvTelemetry telemetry = new EvTelemetry();
        telemetry.setEv(savedEv);
        telemetry.setBatteryPercent(request.getBatteryPercent());
        telemetry.setState(request.getState());
        telemetry.setOdometerKm(request.getOdometerKm());
        telemetry.setLatitude(request.getLatitude());
        telemetry.setLongitude(request.getLongitude());
        telemetry.setTimestamp(ts);

        telemetryRepository.save(telemetry);

        return savedEv;
    }
}
