package com.aviation.platform.module.aircraft.service;

import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.aircraft.dto.AircraftResponse;
import com.aviation.platform.module.aircraft.dto.LearnActionRequest;
import com.aviation.platform.module.aircraft.dto.PartResponse;
import com.aviation.platform.module.aircraft.dto.SessionResponse;
import com.aviation.platform.module.aircraft.dto.SimActionRequest;
import com.aviation.platform.module.aircraft.dto.SimulationResponse;

import java.util.List;

public interface AircraftService {

    List<AircraftResponse> list(CurrentUser actor);

    List<PartResponse> parts(String aircraftCode, CurrentUser actor);

    PartResponse nextLesson(String aircraftCode, CurrentUser actor);

    PartResponse learn(String aircraftCode, LearnActionRequest request, CurrentUser actor);

    List<SimulationResponse> simulations(String aircraftCode);

    SessionResponse startSim(Long simulationId, CurrentUser actor);

    SessionResponse act(Long sessionId, SimActionRequest request, CurrentUser actor);
}
