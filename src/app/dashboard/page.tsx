
'use client';

import AiAgentsFeature from "@/components/features/ai-agents";

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
            <p className="mb-6">Select a feature from the sidebar to get started.</p>
            <AiAgentsFeature />
        </div>
    )
}
