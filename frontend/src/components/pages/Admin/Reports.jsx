import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { UploadCloud, ChevronDown } from "lucide-react";
import { LineChart } from "@mui/x-charts/LineChart";
import { API_BASE } from "../../../utils/api";
import DashboardHeader from "../../ui/DashboardHeader";
import Container from "../../ui/Container";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PERIODS = ["Weekly", "Monthly", "Yearly"];

const StatTile = ({ title, value, subtitle, valueClass = "text-primary" }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col gap-1 shadow-sm">
        <p className="text-xs font-semibold text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400">{subtitle}</p>}
    </div>
);

export default function Reports() {
    const { token, apiFetch } = useAuth();
    const [reportData, setReportData] = useState({
        total_revenue: 0,
        total_transactions: 0,
        total_volume: 0,
        total_weight: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState("Weekly");
    const [periodOpen, setPeriodOpen] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            if (!token) return;
            try {
                setLoading(true);
                const response = await apiFetch(`${API_BASE}/reports/`);
                if (!response.ok) throw new Error("Failed to fetch reports");
                const data = await response.json();
                setReportData(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [token]);

    const handleExport = async () => {
        // Log the export action in AuditTrail
        await apiFetch(`${API_BASE}/reports/`, { method: "POST" }).catch(() => { });

        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("System Report", 14, 22);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString("en-PH")}`, 14, 30);
        
        const tableData = [
            ["Total Revenue", `Php ${parseFloat(reportData.total_revenue || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`],
            ["Total Transactions", reportData.total_transactions || "0"],
            ["Total Volume", `${parseFloat(reportData.total_volume || 0).toFixed(2)} m2`],
            ["Total Weight", `${parseFloat(reportData.total_weight || 0).toFixed(2)} m`]
        ];
        
        autoTable(doc, {
            startY: 40,
            head: [["Metric", "Value"]],
            body: tableData,
            theme: "grid",
            headStyles: { fillColor: [245, 158, 11] }, // Amber color matches the theme
            styles: { fontSize: 11, cellPadding: 6 },
            columnStyles: {
                0: { fontStyle: "bold", textColor: [50, 50, 50] },
                1: { halign: "right" }
            }
        });
        
        doc.save(`report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="flex flex-col gap-4">
            <Container>
                <div className="flex flex-row justify-between items-center">
                    <DashboardHeader title="All Reports" />
                </div>
            </Container>
            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading reports...</div>
            ) : error ? (
                <div className="text-center py-12 text-red-400">Error: {error}</div>
            ) : (
                <>
                    {/* Stat Tiles */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatTile
                            title="Total Revenue"
                            value={`₱${parseFloat(reportData.total_revenue || 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
                            subtitle="All Time"
                        />
                        <StatTile
                            title="Total Transactions"
                            value={reportData.total_transactions || 0}
                            subtitle="Processed successfully"
                            valueClass="text-gray-800"
                        />
                        <StatTile
                            title="Total Volume"
                            value={`${parseFloat(reportData.total_volume || 0).toFixed(2)} m²`}
                        />
                        <StatTile
                            title="Total Weight"
                            value={`${parseFloat(reportData.total_weight || 0).toFixed(2)}m`}
                            valueClass="text-gray-800"
                        />
                    </div>

                    {/* Chart Card  */}
                    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                        {/* Period selector */}
                        <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                            <div className="relative">
                                <button
                                    onClick={() => setPeriodOpen((o) => !o)}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-amber-600 transition-colors"
                                >
                                    {period} <ChevronDown size={14} />
                                </button>
                                {periodOpen && (
                                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-md z-10 min-w-[110px]">
                                        {PERIODS.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${p === period ? "text-primary font-semibold" : "text-gray-600"}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chart area */}
                        <div className="p-4 min-h-[280px] flex items-center justify-center">
                            {reportData.total_transactions > 0 ? (
                                <LineChart
                                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7], label: period }]}
                                    series={[{
                                        data: [0, 0, 0, 0, 0, 0, parseFloat(reportData.total_revenue || 0)],
                                        label: "Revenue",
                                        color: "#000000",
                                    }]}
                                    height={240}
                                    margin={{ top: 16, bottom: 32, left: 48, right: 16 }}
                                />
                            ) : (
                                <p className="text-gray-400 text-sm">Chart will be displayed here...</p>
                            )}
                        </div>
                    </div>

                    {/*  Export Button  */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                        >
                            <UploadCloud size={15} /> Export Report
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
