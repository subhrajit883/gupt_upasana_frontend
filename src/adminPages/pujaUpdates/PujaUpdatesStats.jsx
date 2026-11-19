import React from "react";
import { Bell, CheckCircle2, CalendarDays, Send } from "lucide-react";

const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl border border-[#eee8dc] p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-[#4a0a0d] mt-2">{value}</h3>
                <p className="text-xs text-gray-400 mt-2">{subtitle}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} />
            </div>
        </div>
    </div>
);

const PujaUpdatesStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Total Updates"
                value={stats.total}
                subtitle="All recorded puja updates"
                icon={Bell}
                color="bg-[#f8edf0] text-[#4a0a0d]"
            />
            <StatCard
                title="Published"
                value={stats.published}
                subtitle={`${stats.draft} draft updates`}
                icon={CheckCircle2}
                color="bg-green-50 text-green-600"
            />
            <StatCard
                title="Scheduled Pujas"
                value={stats.scheduled}
                subtitle="Upcoming puja announcements"
                icon={CalendarDays}
                color="bg-[#fbf2d9] text-[#98701b]"
            />
            <StatCard
                title="Push Broadcasts"
                value={stats.pushSent}
                subtitle="Updates pushed to user devices"
                icon={Send}
                color="bg-blue-50 text-blue-600"
            />
        </div>
    );
};

export default PujaUpdatesStats;
