import type { Scenario } from '@/types';
import { ScenarioContentView } from '@/components/scenario/ScenarioContentView';
import { WebmailSimulation } from '@/components/simulation/webmail/WebmailSimulation';
import { isWebmailScenario } from '@/components/simulation/webmail/parseEmailContent';

interface SimulationStageProps {
  scenario: Scenario;
  onCtaClick?: () => void;
}

export function SimulationStage({ scenario, onCtaClick }: SimulationStageProps) {
  if (isWebmailScenario(scenario)) {
    return <WebmailSimulation scenario={scenario} onCtaClick={onCtaClick} />;
  }
  return <ScenarioContentView scenario={scenario} />;
}
