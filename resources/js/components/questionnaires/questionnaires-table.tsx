import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FiEye,
  FiInfo,
  FiChevronUp,
  FiChevronDown
} from "react-icons/fi";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { router } from "@inertiajs/react";
import { QuestionnaireDetailView } from "./questionnaire-detail-view";

export interface Questionnaire {
  id: number;
  applicant_id: number;
  job_title: string | null;
  workload: string | null;
  region: string | null;
  termination_reason: string | null;
  salary_current: string | null;
  salary_expectation: string | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
}

// Laravel pagination metadata interface
interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number | string;
  to: number;
  total: number;
}

interface PaginatedQuestionnaires {
  data: Questionnaire[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

interface QuestionnairesTableProps {
  questionnaires: PaginatedQuestionnaires;
  filters: {
    sort_field: string;
    sort_direction: string;
    per_page: number | string;
    per_page_options: (number | string)[];
    search: string;
  };
}

// Sorting types
type SortableColumn = "id" | "applicant_id" | "created_at" | "updated_at";
type SortDirection = "asc" | "desc";

// Helper function to truncate text and add ellipsis
const truncateText = (text: string | null, maxLength: number = 40): string => {
  if (!text) return "-";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Component for text field with tooltip for full content
const TextWithTooltip = ({ text, label, onClick }: { text: string | null; label: string; onClick?: () => void }) => {
  if (!text) return <span className="text-gray-400">-</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`flex items-center space-x-1 max-w-full ${onClick ? 'cursor-pointer hover:text-primary transition-colors' : ''}`}
            onClick={onClick}
          >
            <span className="truncate">{truncateText(text)}</span>
            {text.length > 40 && <FiInfo className="h-3 w-3 text-gray-400" />}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">{label}</p>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Sort header component for sortable columns
const SortHeader = ({
  column,
  currentSortField,
  currentSortDirection,
  onSort,
  children
}: {
  column: SortableColumn;
  currentSortField: string;
  currentSortDirection: string;
  onSort: (column: SortableColumn) => void;
  children: React.ReactNode;
}) => {
  const isSorted = currentSortField === column;

  return (
    <div
      className="flex items-center space-x-1 cursor-pointer"
      onClick={() => onSort(column)}
    >
      <span>{children}</span>
      <div className="flex flex-col">
        {isSorted && currentSortDirection === "asc" ? (
          <FiChevronUp className="h-3 w-3" />
        ) : isSorted && currentSortDirection === "desc" ? (
          <FiChevronDown className="h-3 w-3" />
        ) : (
          <span className="h-3 w-3"></span>
        )}
      </div>
    </div>
  );
};

export function QuestionnairesTable({ questionnaires, filters }: QuestionnairesTableProps) {
  const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState<Questionnaire | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>(filters.search || '');

  // Handle search
  const handleSearch = () => {
    router.get(
      window.location.pathname,
      {
        ...filters,
        search: searchTerm,
        page: 1, // Reset to first page on new search
      },
      {
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['questionnaires', 'filters'],
      }
    );
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle Enter key in search input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle clearing search
  const handleClearSearch = () => {
    setSearchTerm('');
    if (filters.search) {
      router.get(
        window.location.pathname,
        {
          ...filters,
          search: '',
          page: 1,
        },
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          only: ['questionnaires', 'filters'],
        }
      );
    }
  };

  // Handle sorting
  const handleSort = (column: SortableColumn) => {
    let newDirection = "asc";

    // If already sorting by this column, toggle direction
    if (filters.sort_field === column) {
      newDirection = filters.sort_direction === "asc" ? "desc" : "asc";
    }

    // Update the URL with new sort parameters
    router.get(
      window.location.pathname,
      {
        sort_field: column,
        sort_direction: newDirection,
        page: 1, // Reset to first page when sorting changes
        per_page: filters.per_page,
      },
      {
        preserveState: true,
        replace: true,
        only: ['questionnaires', 'filters'],
      }
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      {
        ...filters,
        page,
      },
      {
        preserveState: true,
        preserveScroll: true, // Preserve scroll position when changing pages
        replace: true,
        only: ['questionnaires'],
      }
    );
  };

  // Handle per page change
  const handlePerPageChange = (value: string) => {
    router.get(
      window.location.pathname,
      {
        ...filters,
        per_page: value,
        page: 1, // Reset to first page when changing items per page
      },
      {
        preserveState: true,
        preserveScroll: true, // Preserve scroll position when changing per-page setting
        replace: true,
        only: ['questionnaires', 'filters'],
      }
    );
  };

  // Handle opening the detail dialog
  const handleOpenDetails = (questionnaire: Questionnaire) => {
    setSelectedQuestionnaire(questionnaire);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full">
      {/* Search bar */}
      <div className="flex items-center space-x-2 pb-4">
        <div className="relative flex-1 max-w-sm">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID or Applicant..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                className="pl-8"
              />
            </div>
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="ml-2 h-8 w-8"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">
                <SortHeader
                  column="id"
                  currentSortField={filters.sort_field}
                  currentSortDirection={filters.sort_direction}
                  onSort={handleSort}
                >
                  ID
                </SortHeader>
              </TableHead>
              <TableHead className="w-[80px]">
                <SortHeader
                  column="applicant_id"
                  currentSortField={filters.sort_field}
                  currentSortDirection={filters.sort_direction}
                  onSort={handleSort}
                >
                  Applicant
                </SortHeader>
              </TableHead>
              <TableHead className="w-[250px]">
                <div className="flex items-center">
                  Job
                </div>
              </TableHead>
              <TableHead className="w-[80px]">
                <div className="flex items-center">
                  Workload
                </div>
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center">
                  Region
                </div>
              </TableHead>
              <TableHead className="w-[100px]">
                <SortHeader
                  column="created_at"
                  currentSortField={filters.sort_field}
                  currentSortDirection={filters.sort_direction}
                  onSort={handleSort}
                >
                  Created
                </SortHeader>
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center">
                  Updated
                </div>
              </TableHead>
              <TableHead className="w-[60px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionnaires.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No questionnaires found.
                </TableCell>
              </TableRow>
            ) : (
              questionnaires.data.map((questionnaire) => (
                <TableRow key={questionnaire.id}>
                  <TableCell className="font-medium">{questionnaire.id}</TableCell>
                  <TableCell>{questionnaire.applicant_id}</TableCell>
                  <TableCell>
                    <TextWithTooltip
                      text={questionnaire.job_title}
                      label="Job Title"
                      onClick={() => handleOpenDetails(questionnaire)}
                    />
                  </TableCell>
                  <TableCell>{questionnaire.workload || '-'}</TableCell>
                  <TableCell>{questionnaire.region || '-'}</TableCell>
                  <TableCell>
                    {questionnaire.created_at
                      ? format(new Date(questionnaire.created_at), "PP")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {questionnaire.updated_at
                      ? format(new Date(questionnaire.updated_at), "PP")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleOpenDetails(questionnaire)}
                      >
                        <FiEye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        {/* Display pagination info */}
        {questionnaires.meta && (
          <div className="text-sm text-muted-foreground">
            Showing {questionnaires.meta.from || 0} to{" "}
            {questionnaires.meta.to || 0} of{" "}
            {questionnaires.meta.total || 0} entries
          </div>
        )}

        {/* Pagination component - now in the middle */}
        <div className="flex-1 flex justify-center">
          {questionnaires.meta && questionnaires.meta.last_page > 1 && (
            <Pagination className="my-2">
              <PaginationContent>
                {questionnaires.meta.current_page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(questionnaires.meta.current_page - 1);
                      }}
                    />
                  </PaginationItem>
                )}

                {questionnaires.meta.links && questionnaires.meta.links.slice(1, -1).map((link, i) => {
                  // Skip ellipsis placeholder links
                  if (link.label === "...") {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={link.label}>
                      <PaginationLink
                        href="#"
                        isActive={link.active}
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(parseInt(link.label));
                        }}
                      >
                        {link.label}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {questionnaires.meta.current_page < questionnaires.meta.last_page && (
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(questionnaires.meta.current_page + 1);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Per page selector - now on the right */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(filters.per_page)}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(filters.per_page)} />
            </SelectTrigger>
            <SelectContent>
              {filters.per_page_options.map((option) => (
                <SelectItem key={String(option)} value={String(option)}>
                  {option === 'all' ? 'All' : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Questionnaire Details</DialogTitle>
            <DialogDescription>
              Full information about this questionnaire submission.
            </DialogDescription>
          </DialogHeader>
          {selectedQuestionnaire && (
            <QuestionnaireDetailView questionnaire={selectedQuestionnaire} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
