package com.evfleet.evfleetops;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.EvStatus;
import com.evfleet.evfleetops.model.EvTelemetry;
import com.evfleet.evfleetops.model.TelemetryRequest;
import com.evfleet.evfleetops.repository.EvRepository;
import com.evfleet.evfleetops.repository.EvTelemetryRepository;
import com.evfleet.evfleetops.service.TelemetryService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Instant;
import java.util.Optional;

class TelemetryServiceTest {

    @Test
    void testTelemetryUpdatesEvBattery() {
        // mock repositories
        EvRepository evRepo = Mockito.mock(EvRepository.class);
        EvTelemetryRepository telemetryRepo = Mockito.mock(EvTelemetryRepository.class);

        // existing EV in DB
        Ev ev = new Ev();
        ev.setRegistration("KA01AB1234");
        ev.setModel("Test EV");
        ev.setBatteryCapacityKWh(20.0);
        ev.setCurrentBatteryPercent(80);
        ev.setStatus(EvStatus.IDLE);

        // when findById(1L) is called, return our EV
        Mockito.when(evRepo.findById(1L)).thenReturn(Optional.of(ev));
        // when saving EV or telemetry, just return the same object
        Mockito.when(evRepo.save(Mockito.any(Ev.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        Mockito.when(telemetryRepo.save(Mockito.any(EvTelemetry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TelemetryService service = new TelemetryService(evRepo, telemetryRepo);

        // build telemetry request
        TelemetryRequest request = new TelemetryRequest();
        request.setEvId(1L);
        request.setBatteryPercent(25);
        request.setState(EvStatus.DRIVING);
        request.setOdometerKm(1000.0);
        request.setLatitude(12.9);
        request.setLongitude(77.5);
        request.setTimestamp(Instant.now());

        // act
        Ev updated = service.ingestTelemetry(request);

        // assert – EV fields updated correctly
        Assertions.assertEquals(25, updated.getCurrentBatteryPercent());
        Assertions.assertEquals(EvStatus.DRIVING, updated.getStatus());
    }
}
