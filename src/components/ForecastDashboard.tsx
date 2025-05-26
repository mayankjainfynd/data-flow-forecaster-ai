
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Brain, Download, Play, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const ForecastDashboard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [forecastHorizon, setForecastHorizon] = useState("12");

  // Sample forecast data
  const forecastData = [
    { period: "2024-01", actual: 1200, forecast: 1180, lower: 1100, upper: 1260 },
    { period: "2024-02", actual: 1350, forecast: 1320, lower: 1240, upper: 1400 },
    { period: "2024-03", actual: 1100, forecast: 1150, lower: 1070, upper: 1230 },
    { period: "2024-04", actual: 1450, forecast: 1420, lower: 1340, upper: 1500 },
    { period: "2024-05", actual: null, forecast: 1380, lower: 1300, upper: 1460 },
    { period: "2024-06", actual: null, forecast: 1420, lower: 1340, upper: 1500 },
    { period: "2024-07", actual: null, forecast: 1350, lower: 1270, upper: 1430 },
    { period: "2024-08", actual: null, forecast: 1390, lower: 1310, upper: 1470 },
  ];

  const modelPerformance = [
    { model: "Prophet", accuracy: 94.2, mape: 5.8, rmse: 125.3, selected: true },
    { model: "ARIMA", accuracy: 91.5, mape: 8.5, rmse: 142.1, selected: false },
    { model: "LightGBM", accuracy: 88.7, mape: 11.3, rmse: 167.8, selected: false },
    { model: "Linear", accuracy: 82.1, mape: 17.9, rmse: 198.5, selected: false },
  ];

  const generateForecast = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate model training and forecast generation
    const steps = [
      { step: "Data validation", duration: 500 },
      { step: "Model selection", duration: 1000 },
      { step: "Training models", duration: 2000 },
      { step: "Generating forecasts", duration: 1000 },
      { step: "Calculating confidence intervals", duration: 500 },
    ];

    let totalProgress = 0;
    for (const { step, duration } of steps) {
      toast.info(`${step}...`);
      await new Promise(resolve => setTimeout(resolve, duration));
      totalProgress += 20;
      setGenerationProgress(totalProgress);
    }

    setIsGenerating(false);
    toast.success("Forecast generated successfully!");
  };

  const exportForecast = () => {
    toast.success("Forecast exported to CSV successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Generate Forecasts</h2>
        <p className="text-lg text-slate-600">
          Configure and generate intelligent forecasts for your data
        </p>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Forecast Configuration
          </CardTitle>
          <CardDescription>Configure your forecasting parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Model Selection
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-select best model</SelectItem>
                  <SelectItem value="prophet">Prophet</SelectItem>
                  <SelectItem value="arima">ARIMA</SelectItem>
                  <SelectItem value="lightgbm">LightGBM</SelectItem>
                  <SelectItem value="ensemble">Ensemble</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Forecast Horizon (periods)
              </label>
              <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 periods</SelectItem>
                  <SelectItem value="8">8 periods</SelectItem>
                  <SelectItem value="12">12 periods</SelectItem>
                  <SelectItem value="24">24 periods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={generateForecast} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Forecast
                  </>
                )}
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Generating forecast...</span>
                <span className="text-sm text-slate-500">{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Tabs defaultValue="forecast" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecast">Forecast Results</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-6">
          {/* Forecast Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Forecast Visualization</CardTitle>
                  <CardDescription>Historical data and future forecasts with confidence intervals</CardDescription>
                </div>
                <Button onClick={exportForecast} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="forecast" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Forecast"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="upper" 
                      stroke="#94a3b8" 
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      name="Upper Bound"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lower" 
                      stroke="#94a3b8" 
                      strokeWidth={1}
                      strokeDasharray="2 2"
                      name="Lower Bound"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Next Period</p>
                    <p className="text-xl font-bold">1,380</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Confidence</p>
                    <p className="text-xl font-bold">94.2%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Trend</p>
                    <p className="text-xl font-bold">+2.1%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Volatility</p>
                    <p className="text-xl font-bold">Low</p>
                  </div>
                  <Badge variant="secondary">Stable</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
              <CardDescription>Performance metrics for different forecasting models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelPerformance.map((model) => (
                  <div key={model.model} className={`p-4 border rounded-lg ${
                    model.selected ? "border-blue-500 bg-blue-50" : "border-slate-200"
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-slate-900">{model.model}</h4>
                        {model.selected && <Badge>Selected</Badge>}
                      </div>
                      <div className="text-lg font-bold text-slate-900">{model.accuracy}%</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">MAPE:</span>
                        <span className="ml-2 font-medium">{model.mape}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500">RMSE:</span>
                        <span className="ml-2 font-medium">{model.rmse}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Accuracy:</span>
                        <span className="ml-2 font-medium">{model.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Strong seasonal pattern detected with 94.2% confidence
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Upward trend of 2.1% identified over the forecast horizon
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      External drivers (promotions) show significant impact
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Consider inventory adjustments for peak periods
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      Monitor forecast accuracy weekly for best results
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-800">
                      Include weather data to improve accuracy by ~3%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForecastDashboard;
