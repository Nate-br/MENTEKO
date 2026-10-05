import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SessionProvider } from '@/hooks/useSession';
import { Home } from '@/pages/Home';
import { Learn } from '@/pages/Learn';
import { Simulate } from '@/pages/Simulate';
import { ScenarioPage } from '@/pages/Scenario';
import { Result } from '@/pages/Result';
import { Assessment } from '@/pages/Assessment';
import { About } from '@/pages/About';
import { DrillView } from '@/pages/DrillView';

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/simulate" element={<Simulate />} />
            <Route path="/simulate/:id" element={<ScenarioPage />} />
            <Route path="/drill" element={<DrillView />} />
            <Route path="/drills/:drillId" element={<DrillView />} />
            <Route path="/result" element={<Result />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}
