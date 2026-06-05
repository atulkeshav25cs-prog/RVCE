import { CloudRain, Wind, Eye, ThermometerSun } from "lucide-react";

interface WeatherData {
  temp: string;
  condition: string;
  wind: string;
  visibility: string;
  alert?: string;
}

interface WeatherWidgetProps {
  weather: WeatherData;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 uppercase tracking-wider">Local Conditions</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-4xl font-extrabold text-slate-900">{weather.temp}</p>
          <p className="text-sm font-medium text-slate-500">{weather.condition}</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <CloudRain className="w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
          <Wind className="w-4 h-4 text-slate-400 mr-2" />
          <div>
            <p className="text-xs text-slate-500 uppercase">Wind</p>
            <p className="text-sm font-bold text-slate-700">{weather.wind}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
          <Eye className="w-4 h-4 text-slate-400 mr-2" />
          <div>
            <p className="text-xs text-slate-500 uppercase">Visibility</p>
            <p className="text-sm font-bold text-slate-700">{weather.visibility}</p>
          </div>
        </div>
      </div>

      {weather.alert && (
        <div className="mt-2 bg-red-50 border border-red-200 p-3 rounded-lg text-sm font-bold text-red-700 flex items-start">
          <ThermometerSun className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          {weather.alert}
        </div>
      )}
    </div>
  );
}
