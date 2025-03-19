import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format, isValid } from "date-fns";
import { Questionnaire } from "./questionnaires-table";

interface DetailItemProps {
  label: string;
  value: string | number | null;
  className?: string;
}

const DetailItem = ({ label, value, className = "" }: DetailItemProps) => (
  <div className={`space-y-0.5 ${className}`}>
    <p className="text-xs font-medium text-muted-foreground">{label}</p>
    <p className="text-sm font-medium">{value || "-"}</p>
  </div>
);

// Safe date formatting helper
const formatDate = (dateString: string | null, formatStr: string = "PP"): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return isValid(date) ? format(date, formatStr) : "-";
};

export function QuestionnaireDetailView({ questionnaire }: { questionnaire: Questionnaire }) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 py-3">
        <div className="flex items-center">
          <Badge variant={questionnaire.workload === "100%" ? "default" : "secondary"}>
            {questionnaire.workload || "No workload"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        {/* Main content in a 3-column layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Column 1: Basic details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Basic Info</h3>
            <div className="space-y-2">
              <DetailItem label="ID" value={questionnaire.id} />
              <DetailItem label="Applicant ID" value={questionnaire.applicant_id} />
              <DetailItem label="Job Title" value={questionnaire.job_title} />
              <DetailItem label="Region" value={questionnaire.region} />
            </div>
          </div>

          {/* Column 2: Salary information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Salary Info</h3>
            <div className="space-y-2">
              <DetailItem
                label="Current Salary"
                value={questionnaire.salary_current || null}
              />
              <DetailItem
                label="Expected Salary"
                value={questionnaire.salary_expectation || null}
              />
            </div>
          </div>

          {/* Column 3: Additional information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Additional Info</h3>
            <div className="space-y-2">
              <DetailItem label="Termination Reason" value={questionnaire.termination_reason} />
              <DetailItem
                label="Availability"
                value={formatDate(questionnaire.availability)}
              />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <DetailItem
                  label="Created"
                  value={formatDate(questionnaire.created_at)}
                />
                <DetailItem
                  label="Updated"
                  value={formatDate(questionnaire.updated_at)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-0 pt-2 pb-0 flex justify-end">
        <p className="text-xs text-muted-foreground">
          Reference ID: {questionnaire.id}
        </p>
      </CardFooter>
    </Card>
  );
}
