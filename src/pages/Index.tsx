
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [uploadedData, setUploadedData] = useState(null);
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
            { id: "dashboard", label: "Dashboard" },
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
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Process Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Forecasting Workflow</CardTitle>
                <CardDescription>Complete these steps to generate your forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        step.completed ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                      }`}>
                        <step.icon className="w-6 h-6" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900">{step.label}</p>
                        <Badge variant={step.completed ? "default" : "secondary"} className="mt-1">
                          {step.completed ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`mx-8 h-0.5 w-16 ${
                          step.completed ? "bg-green-300" : "bg-slate-200"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with your forecasting workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <Upload className="w-6 h-6" />
                    <span>Upload New Dataset</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("schema")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                    disabled={!uploadedData}
                  >
                    <Database className="w-6 h-6" />
                    <span>Map Schema</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("forecast")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                    disabled={!schemaMapped}
                  >
                    <TrendingUp className="w-6 h-6" />
                    <span>Generate Forecast</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Upload View */}
        {activeTab === "upload" && (
          <DataUpload onDataUploaded={setUploadedData} />
        )}

        {/* Schema Mapping View */}
        {activeTab === "schema" && (
          <SchemaMapping 
            uploadedData={uploadedData} 
            onSchemaComplete={() => setSchemaMapped(true)}
          />
        )}

        {/* Forecast View */}
        {activeTab === "forecast" && (
          <ForecastDashboard />
        )}
      </div>
    </div>
  );
};

export default Index;
