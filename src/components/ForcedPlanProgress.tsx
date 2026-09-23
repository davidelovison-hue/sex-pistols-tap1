import { PLAN_STEPS, type PlanStepId } from '../data/planCatalog';
import './ForcedPlanProgress.css';

type ForcedPlanProgressProps = {
  activeStep: PlanStepId;
};

export function ForcedPlanProgress({ activeStep }: ForcedPlanProgressProps) {
  const total = PLAN_STEPS.length;
  const index = Math.max(0, PLAN_STEPS.findIndex((step) => step.id === activeStep));
  const current = PLAN_STEPS[index] ?? PLAN_STEPS[0];
  const next = PLAN_STEPS[index + 1];
  const stepNumber = index + 1;
  const percent = (stepNumber / total) * 100;
  const statusLabel = next
    ? `Step ${stepNumber} of ${total}: ${current.title}. Up next: ${next.title}`
    : `Step ${stepNumber} of ${total}: ${current.title}. Last step`;

  return (
    <div className="forcedPlanProgress" role="status" aria-label={statusLabel}>
      <div className="forcedPlanProgressHead">
        <p className="forcedPlanProgressTitle" id={`plan-step-${current.id}`}>
          {current.title}
        </p>
        <p className="forcedPlanProgressCount">
          {stepNumber} of {total}
        </p>
      </div>
      {next ? (
        <p className="forcedPlanProgressNext">Up next: {next.title}</p>
      ) : (
        <p className="forcedPlanProgressNext">Last stop - then checkout</p>
      )}
      <div className="forcedPlanProgressTrack" aria-hidden="true">
        <div className="forcedPlanProgressFill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
