
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, Database, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DataUploadProps {
  onDataUploaded: (data: any) => void;
}

const DataUpload = ({ onDataUploaded }: DataUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success("File uploaded successfully!");
          onDataUploaded({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const supportedFormats = [
    { name: "CSV", description: "Comma-separated values", icon: FileSpreadsheet },
    { name: "Excel", description: "Microsoft Excel files", icon: FileSpreadsheet },
    { name: "Parquet", description: "Columnar storage format", icon: Database },
  ];

  const sampleDatasets = [
    { name: "Retail Sales Sample", description: "SKU-Store-Week sales data", size: "2.3 MB" },
    { name: "E-commerce Demo", description: "Product-Region-Day transactions", size: "1.8 MB" },
    { name: "Inventory Sample", description: "Warehouse stock levels", size: "890 KB" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Upload Your Data</h2>
        <p className="text-lg text-slate-600">
          Start by uploading your time-series data in any supported format
        </p>
      </div>

      {/* Upload Area */}
      <Card className="relative">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Drop your files here, or click to browse
            </h3>
            <p className="text-slate-500 mb-4">
              Supports CSV, Excel, and Parquet files up to 100MB
            </p>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              accept=".csv,.xlsx,.xls,.parquet"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Choose File
              </label>
            </Button>
          </div>

          {uploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Uploading...</span>
                <span className="text-sm text-slate-500">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {uploadedFile && !uploading && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-900">{uploadedFile.name}</p>
                  <p className="text-sm text-green-700">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supported Formats */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Formats</CardTitle>
          <CardDescription>Upload your data in any of these formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportedFormats.map((format) => (
              <div key={format.name} className="flex items-center p-4 border rounded-lg">
                <format.icon className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-slate-900">{format.name}</h4>
                  <p className="text-sm text-slate-500">{format.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Datasets */}
      <Card>
        <CardHeader>
          <CardTitle>Try Sample Datasets</CardTitle>
          <CardDescription>Get started quickly with our pre-loaded sample data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleDatasets.map((dataset) => (
              <div key={dataset.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div>
                  <h4 className="font-medium text-slate-900">{dataset.name}</h4>
                  <p className="text-sm text-slate-500">{dataset.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{dataset.size}</Badge>
                  <Button size="sm" variant="outline">
                    Load Sample
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataUpload;
