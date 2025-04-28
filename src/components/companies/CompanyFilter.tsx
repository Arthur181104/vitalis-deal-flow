
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
import { Search, X, SlidersHorizontal } from "lucide-react";
import { 
  STATUS_OPTIONS, 
  SECTOR_OPTIONS, 
  RATING_OPTIONS, 
  APPROVAL_STATUS_OPTIONS 
} from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const CompanyFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const currentStatus = searchParams.get("status") || "";
  const currentSector = searchParams.get("sector") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentRating = searchParams.get("rating") || "";
  const currentApprovalStatus = searchParams.get("approval") || "";
  
  const [search, setSearch] = useState(currentSearch);

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", value);
    }
    setSearchParams(searchParams);
  };

  const handleSectorChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("sector");
    } else {
      searchParams.set("sector", value);
    }
    setSearchParams(searchParams);
  };

  const handleRatingChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("rating");
    } else {
      searchParams.set("rating", value);
    }
    setSearchParams(searchParams);
  };

  const handleApprovalStatusChange = (value: string) => {
    if (value === "all") {
      searchParams.delete("approval");
    } else {
      searchParams.set("approval", value);
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentStatus) count++;
    if (currentSector) count++;
    if (currentRating) count++;
    if (currentApprovalStatus) count++;
    if (currentSearch) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 md:col-span-3">
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

        <div className="md:col-span-1 md:justify-self-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground" variant="secondary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Companies</SheetTitle>
                <SheetDescription>
                  Apply filters to find specific companies.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Status</h3>
                  <Select value={currentStatus || "all"} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Sector</h3>
                  <Select value={currentSector || "all"} onValueChange={handleSectorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      {SECTOR_OPTIONS.map((sector) => (
                        <SelectItem key={sector.value} value={sector.value}>
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Rating</h3>
                  <Select value={currentRating || "all"} onValueChange={handleRatingChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      {RATING_OPTIONS.map((rating) => (
                        <SelectItem key={rating.value} value={rating.value}>
                          {rating.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Approval Status</h3>
                  <Select value={currentApprovalStatus || "all"} onValueChange={handleApprovalStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Approval Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Approval Statuses</SelectItem>
                      {APPROVAL_STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full mb-2"
                    disabled={activeFiltersCount === 0}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear filters
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {currentStatus && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Status: {STATUS_OPTIONS.find(s => s.value === currentStatus)?.label}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleStatusChange("all")}
              />
            </Badge>
          )}
          {currentSector && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Sector: {currentSector}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleSectorChange("all")}
              />
            </Badge>
          )}
          {currentRating && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Rating: {currentRating}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleRatingChange("all")}
              />
            </Badge>
          )}
          {currentApprovalStatus && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Approval: {currentApprovalStatus}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleApprovalStatusChange("all")}
              />
            </Badge>
          )}
          {currentSearch && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Search: "{currentSearch}"
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => {
                  setSearch("");
                  searchParams.delete("search");
                  setSearchParams(searchParams);
                }}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompanyFilter;
