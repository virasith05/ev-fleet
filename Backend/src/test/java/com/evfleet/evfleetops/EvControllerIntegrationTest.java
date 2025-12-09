package com.evfleet.evfleetops;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.EvStatus;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class EvControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testCreateAndGetEv() {
        // Build EV object to send to the REST API
        Ev ev = new Ev();
        ev.setRegistration("KA01XY1111");
        ev.setModel("IntegrationModel");
        ev.setBatteryCapacityKWh(21.0);
        ev.setCurrentBatteryPercent(90);
        ev.setStatus(EvStatus.IDLE);   // ✅ use enum, not string

        // ---- POST /api/evs ----
        ResponseEntity<Ev> postResponse =
                restTemplate.postForEntity("/api/evs", ev, Ev.class);

        Assertions.assertEquals(HttpStatus.OK, postResponse.getStatusCode());
        Ev created = postResponse.getBody();
        Assertions.assertNotNull(created);
        Assertions.assertNotNull(created.getId());

        // ---- GET /api/evs/{id} ----
        ResponseEntity<Ev> getResponse =
                restTemplate.getForEntity("/api/evs/" + created.getId(), Ev.class);

        Assertions.assertEquals(HttpStatus.OK, getResponse.getStatusCode());
        Assertions.assertNotNull(getResponse.getBody());
        Assertions.assertEquals("KA01XY1111", getResponse.getBody().getRegistration());
    }
}
