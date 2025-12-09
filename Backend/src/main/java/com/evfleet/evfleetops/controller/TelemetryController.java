package com.evfleet.evfleetops.controller;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.TelemetryRequest;
import com.evfleet.evfleetops.service.TelemetryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/telemetry")
@CrossOrigin(origins = "*")
public class TelemetryController {

    private final TelemetryService telemetryService;

    public TelemetryController(TelemetryService telemetryService) {
        this.telemetryService = telemetryService;
    }

    @PostMapping
    public ResponseEntity<Ev> ingestTelemetry(@RequestBody TelemetryRequest request) {
        try {
            Ev updatedEv = telemetryService.ingestTelemetry(request);
            return ResponseEntity.ok(updatedEv);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
