package com.evfleet.evfleetops.service;

import com.evfleet.evfleetops.model.Driver;
import com.evfleet.evfleetops.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Optional<Driver> getDriverById(Long id) {
        return driverRepository.findById(id);
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Long id, Driver updated) {
        return driverRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setPhone(updated.getPhone());
                    existing.setLicenseId(updated.getLicenseId());
                    existing.setActive(updated.isActive());
                    return driverRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Driver not found with id " + id));
    }

    public void deleteDriver(Long id) {
        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Driver not found with id " + id);
        }
        driverRepository.deleteById(id);
    }

    public List<Driver> getActiveDrivers() {
        return driverRepository.findByActive(true);
    }
}
