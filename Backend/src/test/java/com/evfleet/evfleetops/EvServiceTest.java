package com.evfleet.evfleetops;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.repository.EvRepository;
import com.evfleet.evfleetops.service.EvService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;

class EvServiceTest {

    @Test
    void testCreateEv() {
        // mock repository
        EvRepository repo = Mockito.mock(EvRepository.class);

        // fake save response
        Ev input = new Ev();
        input.setRegistration("KA01AB0001");
        input.setModel("Test Model");
        Mockito.when(repo.findAll()).thenReturn(Collections.emptyList());
        Mockito.when(repo.save(Mockito.any(Ev.class))).thenReturn(input);

        EvService service = new EvService(repo);

        Ev saved = service.createEv(input);

        Assertions.assertNotNull(saved);
        Assertions.assertEquals("KA01AB0001", saved.getRegistration());
    }
}
