import React, { useState } from 'react';
import type { MaintenanceLog } from '../../types/elevator';
import { History, Plus, Filter, Calendar } from 'lucide-react';

interface MaintenanceHistoryViewProps {
  logs: MaintenanceLog[];
  onAddLog: (log: MaintenanceLog) => void;
}

export const MaintenanceHistoryView: React.FC<MaintenanceHistoryViewProps> = ({
  logs,
  onAddLog
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newComponent, setNewComponent] = useState<string>('Brake');
  const [newDesc, setNewDesc] = useState<string>('');

  const filteredLogs = logs.filter(l => filterType === 'all' || l.type.toLowerCase() === filterType.toLowerCase());

  const getBadgeColor = (type: string) => {
    if (type === 'Anomaly') return 'bg-red-950/80 text-red-300 border-red-500/40';
    if (type === 'Upgrade') return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
    if (type === 'Inspection') return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
    return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc) return;

    onAddLog({
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Preventive',
      component: newComponent,
      description: newDesc,
      technician: 'Field Technician',
      status: 'Completed'
    });

    setNewDesc('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-cyan-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
            <History className="w-4 h-4 text-cyan-400" />
            <span>AUDIT TRAIL & COMPONENT LIFECYCLE</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Maintenance & Service History Timeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comprehensive ledger of work orders, inspections, anomaly detections, and component upgrades.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs shadow-lg glow-cyan flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Maintenance Event</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono w-fit">
        <span className="px-3 text-slate-400 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Filter:</span>
        </span>
        {['all', 'Inspection', 'Anomaly', 'Upgrade', 'Preventive'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterType === t ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Timeline Section Required by Section 11 */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 relative">
        <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-cyan-500/30" />

        <div className="space-y-6 relative z-10 pl-10">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-[43px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center glow-cyan">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>

              {/* Event Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 group-hover:border-cyan-500/40 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getBadgeColor(log.type)}`}>
                      {log.type.toUpperCase()}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">{log.component}</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{log.date}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-2 leading-relaxed">{log.description}</p>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                  <span>Log Tech: {log.technician}</span>
                  <span className="text-emerald-400 font-bold">Status: {log.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Log Maintenance */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0D1527] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white font-mono mb-4">Log Maintenance Record</h3>
            <form onSubmit={handleCreateLog} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Target Subsystem</label>
                <select
                  value={newComponent}
                  onChange={(e) => setNewComponent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Brake">Brake System</option>
                  <option value="Doors">Door Operator</option>
                  <option value="Motor">Main Motor</option>
                  <option value="VFD">VFD Inverter</option>
                  <option value="Ropes">Hoisting Ropes</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Work Order Details</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe inspection results or technician service actions..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white h-24"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 bg-slate-900 border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-slate-950 font-bold bg-cyan-400 hover:bg-cyan-300"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
