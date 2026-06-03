import TelemetryCheckIn from '../dashboard/TelemetryCheckIn';
import SupplementVault from '../dashboard/SupplementVault';
import NutritionMatrix from '../dashboard/NutritionMatrix';
import ProgressAnalytics from '../dashboard/ProgressAnalytics';

export default function DashboardTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <TelemetryCheckIn />
          <SupplementVault />
        </div>
        <div className="lg:col-span-8 space-y-6">
          <NutritionMatrix />
        </div>
      </div>
      <ProgressAnalytics />
    </div>
  );
}
