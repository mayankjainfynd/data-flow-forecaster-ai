import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Database, TrendingUp, Settings, FileSpreadsheet, BarChart3, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataUpload from "@/components/DataUpload";
import SchemaMapping from "@/components/SchemaMapping";
import ForecastDashboard from "@/components/ForecastDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [schemaMapped, setSchemaMapped] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { id: "upload", label: "Data Upload", icon: Upload, completed: !!uploadedData },
    { id: "schema", label: "Schema Mapping", icon: Database, completed: schemaMapped },
    { id: "forecast", label: "Generate Forecast", icon: TrendingUp, completed: false },
  ];

  const stats = [
    { label: "Datasets Processed", value: "1,234", icon: FileSpreadsheet, change: "+12%" },
    { label: "Active Forecasts", value: "89", icon: BarChart3, change: "+5%" },
    { label: "Model Accuracy", value: "94.2%", icon: Zap, change: "+2.1%" },
  ];

  const handleDataUploaded = (data: any) => {
    console.log('Data uploaded in Index:', data);
    setUploadedData(data);
    setActiveTab("schema");
  };

  const handleSchemaComplete = () => {
    console.log('Schema mapping completed');
    setSchemaMapped(true);
    setActiveTab("forecast");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Intelligent Forecasting System</h1>
                <p className="text-sm text-slate-500">Dynamic schema-agnostic forecasting</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          {[
            { id: "upload", label: "Data Upload" },
            { id: "schema", label: "Schema Mapping" },
            { id: "forecast", label: "Forecasting" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
              disabled={
                (tab.id === "schema" && !uploadedData) ||
                (tab.id === "forecast" && !schemaMapped)
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {activeTab === "upload" && (
            <DataUpload 
              onDataUploaded={handleDataUploaded}
              onUploadComplete={() => setActiveTab("schema")}
            />
          )}

          {activeTab === "schema" && uploadedData && (
            <SchemaMapping 
              uploadedData={uploadedData}
              onSchemaComplete={handleSchemaComplete}
            />
          )}

          {activeTab === "forecast" && schemaMapped && (
            <ForecastDashboard />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
