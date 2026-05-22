import React, { useState, useEffect } from "react";
import Container from "../../ui/Container";
import AuditTable from "../../ui/AuditTable";
import { useAuth } from "../../../context/AuthContext";
import DashboardHeader from "../../ui/DashboardHeader";
import { API_BASE } from '../../../utils/api';

const API = API_BASE;

export default function AuditTrail() {
  const { token, apiFetch } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch_ = async () => {
      if (!token) return;
      setLoading(true); setError(null);
      try {
        const res = await apiFetch(`${API}/audit-trail/`);
        if (!res.ok) throw new Error("Failed to fetch audit logs");
        setLogs(await res.json());
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [token]);

  return (
    <div className="flex flex-col gap-4">
      <Container>
        <div className="flex justify-between items-center mb-2">
          <DashboardHeader title="Audit Trail" subtitle="System activity logs and updates." />
        </div>
        {loading ? <p className="text-sm text-gray-400 py-6 text-center">Loading logs...</p>
          : error ? <p className="text-sm text-red-400 py-6 text-center">{error}</p>
            : <AuditTable logs={logs} />}
      </Container>
    </div>
  );
}