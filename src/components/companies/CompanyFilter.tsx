
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { STATUS_OPTIONS, SECTOR_OPTIONS } from "@/lib/types";

const CompanyFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentStatus = searchParams.get("status") || "";
  const currentSector = searchParams.get("sector") || "";
  const currentSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(currentSearch);

  const handleStatusChange = (value: string) => {
    if (value === "") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }
    setSearchParams(searchParams);
  };

  const handleSectorChange = (value: string) => {
    if (value === "") {
      searchParams.delete("sector");
    } else {
      searchParams.set("sector", value);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search === "") {
      searchParams.delete("search");
    } else {
      searchParams.set("search", search);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    navigate("/companies");
    setSearch("");
  };

  const hasActiveFilters = currentStatus || currentSector || currentSearch;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentSector} onValueChange={handleSectorChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sectors</SelectItem>
            {SECTOR_OPTIONS.map((sector) => (
              <SelectItem key={sector.value} value={sector.value}>
                {sector.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompanyFilter;
