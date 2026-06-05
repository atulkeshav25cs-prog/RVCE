import { User, Phone, Droplet, Users } from "lucide-react";

interface ProfileData {
  fullName: string;
  phone: string;
  age: number;
  bloodGroup: string;
  gender: string;
}

export default function ProfileCard({ profile }: { profile: ProfileData }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Identity Profile</h2>
        <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">VERIFIED</span>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mr-4">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Full Name</p>
            <p className="text-sm font-bold text-slate-900">{profile.fullName}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mr-4">
            <Phone className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Contact</p>
            <p className="text-sm font-bold text-slate-900">{profile.phone}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mr-4">
            <Droplet className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Blood Group</p>
            <p className="text-sm font-bold text-red-600">{profile.bloodGroup}</p>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mr-4">
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Demographics</p>
            <p className="text-sm font-bold text-slate-900">{profile.gender}, {profile.age} Yrs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
