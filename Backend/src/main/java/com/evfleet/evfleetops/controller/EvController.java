package com.evfleet.evfleetops.controller;

import com.evfleet.evfleetops.model.Ev;
import com.evfleet.evfleetops.model.EvStatus;
import com.evfleet.evfleetops.service.EvService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evs")
@CrossOrigin(origins = "*") // allow React to call this later
public class EvController {

    private final EvService evService;

    public EvController(EvService evService) {
        this.evService = evService;
    }

    @GetMapping
    public List<Ev> getAllEvs() {
        return evService.getAllEvs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ev> getEvById(@PathVariable Long id) {
        return evService.getEvById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ev> createEv(@RequestBody Ev ev) {
        Ev created = evService.createEv(ev);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ev> updateEv(@PathVariable Long id, @RequestBody Ev ev) {
        try {
            Ev updated = evService.updateEv(id, ev);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEv(@PathVariable Long id) {
        try {
            evService.deleteEv(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status/{status}")
    public List<Ev> getEvsByStatus(@PathVariable EvStatus status) {
        return evService.getEvsByStatus(status);
    }
}
