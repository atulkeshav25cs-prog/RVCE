"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, MapPin, Megaphone, Loader2 } from "lucide-react";

export default function CitizenAlertsBanner() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts/citizen", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (err) {
      console.error("Error fetching citizen alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-600 border-red-700 text-white shadow-red-900/20";
      case "High": return "bg-orange-500 border-orange-600 text-white shadow-orange-900/20";
      case "Medium": return "bg-yellow-400 border-yellow-500 text-yellow-900 shadow-yellow-900/10";
      case "Low": return "bg-blue-500 border-blue-600 text-white shadow-blue-900/20";
      default: return "bg-slate-800 border-slate-900 text-white";
    }
  };

  const getSeverityIconColor = (severity: string) => {
    switch (severity) {
      case "Medium": return "text-yellow-900";
      default: return "text-white";
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex justify-center items-center shadow-sm mb-6">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-3" />
        <span className="text-slate-500 font-medium">Checking for emergency broadcasts...</span>
      </div>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {alerts.map((alert) => {
        const isCritical = alert.severity === "Critical";
        const style = getSeverityStyle(alert.severity);
        const iconColor = getSeverityIconColor(alert.severity);

        return (
          <div key={alert.alertId} className={`rounded-xl border shadow-lg overflow-hidden relative transition-all duration-300 hover:-translate-y-0.5 ${style}`}>
            {isCritical && (
              <div className="absolute top-0 left-0 w-full h-1 bg-white/40 animate-pulse"></div>
            )}
            <div className="p-5 flex flex-col md:flex-row gap-4 md:items-start">
              <div className={`p-3 rounded-full bg-black/10 shrink-0 ${isCritical ? 'animate-bounce' : ''}`}>
                <Megaphone className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-sm bg-black/20 ${iconColor}`}>
                    {alert.severity} • {alert.alertType}
                  </span>
                </div>
                <h3 className={`text-lg font-bold mb-2 leading-tight ${iconColor}`}>{alert.title}</h3>
                <p className={`text-sm mb-4 leading-relaxed opacity-90 ${iconColor}`}>
                  {alert.description}
                </p>
                <div className={`flex flex-wrap items-center gap-4 text-xs font-semibold opacity-80 ${iconColor}`}>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {alert.targetArea}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Issued: {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center bg-black/10 px-2 py-1 rounded">
                    Expires: {new Date(alert.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
