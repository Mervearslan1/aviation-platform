import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FlightShell } from './flight/FlightShell'
import { Home } from './flight/pages/Home'
import { PathPage } from './flight/pages/PathPage'
import { Cockpit } from './flight/pages/Cockpit'
import { Login } from './flight/pages/Login'
import { OpsShell } from './ops/OpsShell'
import { OpsDashboard, OpsDesk } from './ops/pages/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FlightShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/tower" element={<PathPage track="tower" />} />
          <Route path="/pilot" element={<PathPage track="pilot" />} />
          <Route path="/cockpit" element={<Cockpit />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/ops" element={<OpsShell />}>
          <Route index element={<OpsDashboard />} />
          <Route path="users" element={<OpsDesk k="opsUsers" />} />
          <Route path="content" element={<OpsDesk k="opsContent" />} />
          <Route path="curriculum" element={<OpsDesk k="opsCurriculum" />} />
          <Route path="aircraft" element={<OpsDesk k="opsAircraft" />} />
          <Route path="audit" element={<OpsDesk k="opsAudit" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
