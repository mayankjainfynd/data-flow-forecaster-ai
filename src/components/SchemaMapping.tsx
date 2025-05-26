import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Database, MapPin, Calendar, TrendingUp, Tag, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface SchemaMappingProps {
  uploadedData: {
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
    detectedColumns: {
      dimensions: {
        product: string[];
        location: string[];
        time: string[];
      };
      metrics: string[];
      external_drivers: string[];
    };
  };
  onSchemaComplete: () => void;
}

const SchemaMapping = ({ uploadedData, onSchemaComplete }: SchemaMappingProps) => {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [validationResults, setValidationResults] = useState<any>(null);

  useEffect(() => {
    console.log('SchemaMapping received data:', uploadedData);
  }, [uploadedData]);

  // Get all detected columns from the uploaded data
  const detectedColumns = [
    ...uploadedData.detectedColumns.dimensions.product,
    ...uploadedData.detectedColumns.dimensions.location,
    ...uploadedData.detectedColumns.dimensions.time,
    ...uploadedData.detectedColumns.metrics,
    ...uploadedData.detectedColumns.external_drivers
  ];

  const schemaCategories = [
    {
      id: "dimensions",
      label: "Dimensions",
      icon: Database,
      description: "Core business dimensions for hierarchical forecasting",
      fields: [
        { id: "product", label: "Product Identifier", required: true, suggestions: uploadedData.detectedColumns.dimensions.product },
        { id: "location", label: "Location Identifier", required: true, suggestions: uploadedData.detectedColumns.dimensions.location },
        { id: "time", label: "Time Identifier", required: true, suggestions: uploadedData.detectedColumns.dimensions.time },
      ]
    },
    {
      id: "metrics",
      label: "Metrics",
      icon: TrendingUp,
      description: "Quantitative measures to forecast",
      fields: [
        { id: "target_metric", label: "Primary Target Metric", required: true, suggestions: uploadedData.detectedColumns.metrics },
      ]
    },
    {
      id: "drivers",
      label: "External Drivers",
      icon: MapPin,
      description: "External factors that influence forecasts",
      fields: [
        { id: "external_driver", label: "External Driver", required: false, suggestions: uploadedData.detectedColumns.external_drivers },
      ]
    }
  ];

  const handleMappingChange = (fieldId: string, columnName: string) => {
    console.log('Mapping changed:', { fieldId, columnName });
    setMappings(prev => ({ ...prev, [fieldId]: columnName }));
  };

  const validateSchema = () => {
    console.log('Validating schema with mappings:', mappings);
    const requiredFields = schemaCategories
      .flatMap(cat => cat.fields)
      .filter(field => field.required)
      .map(field => field.id);

    const missingRequired = requiredFields.filter(fieldId => !mappings[fieldId]);
    const mappedCount = Object.keys(mappings).length;

    const results = {
      isValid: missingRequired.length === 0,
      missingRequired,
      mappedCount,
      totalDetected: detectedColumns.length,
      warnings: mappedCount < 4 ? ["Consider mapping more fields for better forecast accuracy"] : []
    };

    setValidationResults(results);

    if (results.isValid) {
      toast.success("Schema validation completed successfully!");
      onSchemaComplete();
    } else {
      toast.error(`Missing required fields: ${missingRequired.join(", ")}`);
    }
  };

  const getFieldStatus = (field: any) => {
    if (field.required && !mappings[field.id]) return "error";
    if (mappings[field.id]) return "success";
    return "default";
  };

  if (!uploadedData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Database className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Data Uploaded</h3>
          <p className="text-slate-500">Please upload a dataset first to proceed with schema mapping.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Map Your Data Schema</h2>
        <p className="text-lg text-slate-600">
          Map your data columns to our forecasting schema for optimal results
        </p>
      </div>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-slate-500">File Name</p>
              <p className="font-medium">{uploadedData.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Detected Columns</p>
              <p className="font-medium">{detectedColumns.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">File Size</p>
              <p className="font-medium">{(uploadedData.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Upload Date</p>
              <p className="font-medium">{new Date(uploadedData.uploadedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schema Mapping */}
      {schemaCategories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <category.icon className="w-5 h-5 mr-2" />
              {category.label}
            </CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.fields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-slate-900">{field.label}</h4>
                      {field.required && <Badge variant="destructive">Required</Badge>}
                      {getFieldStatus(field) === "success" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {getFieldStatus(field) === "error" && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    {field.suggestions.length > 0 && (
                      <p className="text-sm text-slate-500">
                        Suggested: {field.suggestions.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="w-64">
                    <Select
                      value={mappings[field.id] || ""}
                      onValueChange={(value) => handleMappingChange(field.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select column..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No mapping</SelectItem>
                        {detectedColumns.map((column) => (
                          <SelectItem key={column} value={column}>
                            {column}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Validation Results */}
      {validationResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {validationResults.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              )}
              Schema Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Mapped Fields:</span>
                <Badge variant="outline">{validationResults.mappedCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Total Detected Columns:</span>
                <Badge variant="outline">{validationResults.totalDetected}</Badge>
              </div>
              {validationResults.warnings.length > 0 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-1">Warnings:</h4>
                  {validationResults.warnings.map((warning, index) => (
                    <p key={index} className="text-sm text-yellow-700">{warning}</p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setMappings({})}>
          Reset Mappings
        </Button>
        <Button onClick={validateSchema} disabled={Object.keys(mappings).length === 0}>
          Validate & Continue
        </Button>
      </div>
    </div>
  );
};

export default SchemaMapping;
