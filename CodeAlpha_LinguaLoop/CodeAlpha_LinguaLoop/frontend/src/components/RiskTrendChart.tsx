import React from 'react';
import { useMissionStore } from '../stores/useMissionStore';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';

export const RiskTrendChart: React.FC = () => {
  const history = useMissionStore((state) => state.history);

  const data = history.map((t, idx) => ({
    step: t.step_count || idx,
    battery: t.battery,
    sensor: t.sensor_health,
    comms: t.communication_quality,
    risk: Math.min(100, (100 - t.battery) * 0.25 + (100 - t.communication_quality) * 0.2 + t.environment_risk * 100 * 0.15),
  }));

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-sm p-4 font-mono">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-200 flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-purple-400" />
          TELEMETRY & RISK TREND HISTORY
        </span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Battery</span>
          <span className="text-purple-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Comms</span>
          <span className="text-amber-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Risk</span>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="step" stroke="#737373" fontSize={10} tickLine={false} />
            <YAxis domain={[0, 100]} stroke="#737373" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#404040', fontSize: '11px' }}
              labelStyle={{ color: '#a3a3a3' }}
            />
            <Line type="monotone" dataKey="battery" stroke="#10b981" strokeWidth={1.5} dot={false} name="Battery %" />
            <Line type="monotone" dataKey="comms" stroke="#a855f7" strokeWidth={1.5} dot={false} name="Signal Quality %" />
            <Line type="monotone" dataKey="risk" stroke="#f59e0b" strokeWidth={2} dot={false} name="Overall Risk Score" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
