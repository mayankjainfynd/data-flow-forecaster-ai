import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DataUpload from "./components/DataUpload";
import AuthContainer from "./components/AuthContainer";
import ColumnMapping from "./components/ColumnMapping";
import axios from "axios";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [mappingSaved, setMappingSaved] = useState(false);
  const [schemaMappingId, setSchemaMappingId] = useState<string | null>(null);
  const [forecastResult, setForecastResult] = useState<any>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUploadedData(null);
    setMappingSaved(false);
    setSchemaMappingId(null);
    setForecastResult(null);
  };

  // Step 1: Data upload
  const handleDataUploaded = (data: any) => {
    setUploadedData(data);
    setMappingSaved(false);
    setSchemaMappingId(null);
    setForecastResult(null);
  };

  // Step 2: Save column mapping
  const handleMappingSubmit = async (mapping: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8001/api/v1/schema/mappings",
        {
          file_name: uploadedData.name,
          columns: mapping,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMappingSaved(true);
      setSchemaMappingId(response.data.id);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to save mapping");
    }
  };

  // Step 3: Trigger forecast
  const handleGenerateForecast = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8001/api/v1/forecast/generate",
        {
          mapping_id: schemaMappingId,
          forecast: {}, // You can add forecast config here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setForecastResult(response.data);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to generate forecast");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Toaster />
        <AuthContainer onAuth={handleAuth} />
      </>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Data Flow Forecaster</h1>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {!uploadedData && (
            <DataUpload onDataUploaded={handleDataUploaded} />
          )}
          {uploadedData && !mappingSaved && (
            <ColumnMapping
              detectedColumns={uploadedData.detectedColumns.columns || []}
              onMappingSubmit={handleMappingSubmit}
            />
          )}
          {mappingSaved && !forecastResult && (
            <div className="mt-8 text-center">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                onClick={handleGenerateForecast}
              >
                Generate Forecast
              </button>
            </div>
          )}
          {forecastResult && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Forecast Result</h2>
              <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(forecastResult, null, 2)}
              </pre>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
