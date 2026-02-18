"use client";

import { useEffect, useState } from "react";

export default function TestConnectionPage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHealth = async () => {
        setLoading(true);
        setError(null);
        try {
            const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "https://invoices-api-xappee.vercel.app/api";
            const res = await fetch(`${serverUrl}/health-check`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setStatus(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
    }, []);

    return (
        <div className="p-8 font-sans">
            <h1 className="text-2xl font-bold mb-4">Vercel Connection & DB Test</h1>

            <div className="mb-6">
                <button
                    onClick={fetchHealth}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Re-test Connection
                </button>
            </div>

            {loading && <p className="text-gray-600">Loading status...</p>}

            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
                    <p className="font-bold">Error:</p>
                    <p>{error}</p>
                    <p className="mt-2 text-sm">Check if NEXT_PUBLIC_SERVER_URL is set correctly in Vercel.</p>
                </div>
            )}

            {status && (
                <div className="space-y-4">
                    <div className={`p-4 rounded ${status.database.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <h2 className="font-bold">Database Status: {status.database.status.toUpperCase()}</h2>
                        <p className="text-sm">Ready State: {status.database.readyState}</p>
                    </div>

                    <div className="p-4 bg-gray-100 rounded">
                        <h2 className="font-bold mb-2">Backend Details:</h2>
                        <pre className="text-xs overflow-auto bg-white p-2 border">
                            {JSON.stringify(status, null, 2)}
                        </pre>
                    </div>

                    <div className="p-4 bg-blue-50 rounded">
                        <h2 className="font-bold mb-2">Frontend Env Vars:</h2>
                        <ul className="text-sm space-y-1">
                            <li><strong>NEXT_PUBLIC_SERVER_URL:</strong> {process.env.NEXT_PUBLIC_SERVER_URL || 'Not Set'}</li>
                            <li><strong>NEXT_PUBLIC_SERVER:</strong> {process.env.NEXT_PUBLIC_SERVER || 'Not Set'}</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
