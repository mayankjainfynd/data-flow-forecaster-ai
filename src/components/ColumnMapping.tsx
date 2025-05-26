import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

interface ColumnMappingProps {
  detectedColumns: string[];
  onMappingSubmit: (mapping: any) => void;
}

const ColumnMapping = ({ detectedColumns, onMappingSubmit }: ColumnMappingProps) => {
  const [dateCol, setDateCol] = useState("");
  const [valueCol, setValueCol] = useState("");
  const [categoryCol, setCategoryCol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateCol || !valueCol) return;
    onMappingSubmit({
      date: dateCol,
      value: valueCol,
      category: categoryCol || null,
    });
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Map Your Columns</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Date/Time Column</label>
            <Select value={dateCol} onValueChange={setDateCol} required>
              <SelectItem value="">Select column</SelectItem>
              {detectedColumns.map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Value/Target Column</label>
            <Select value={valueCol} onValueChange={setValueCol} required>
              <SelectItem value="">Select column</SelectItem>
              {detectedColumns.map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Category/ID Column (optional)</label>
            <Select value={categoryCol} onValueChange={setCategoryCol}>
              <SelectItem value="">None</SelectItem>
              {detectedColumns.map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </Select>
          </div>
          <Button type="submit" className="w-full mt-4" disabled={!dateCol || !valueCol}>
            Save Mapping
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ColumnMapping; 