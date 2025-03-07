import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useJobStore } from "../store/useJobStore";

const FilterSidebar = () => {
  const { filters, setFilter, clearFilters, jobs } = useJobStore();

  return (
    <aside className="h-full w-20 lg:w-72 flex flex-col transition-all duration-200">
      <div className="w-full p-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-7" />
          <span className="font-medium hidden lg:block">Filters</span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3 flex-col flex">
        {/* Remote */}
        <label className="cursor-pointer flex items-center gap-2 mb-5">
          <input
            type="checkbox"
            checked={filters.remote}
            onChange={(e) => setFilter("remote", e.target.checked)}
            className="checkbox checkbox-md"
          />
          <span>Remote</span>
        </label>
        {/* Part-time */}
        <label className="cursor-pointer flex items-center gap-2 mb-5">
          <input
            type="checkbox"
            checked={filters.partTime}
            onChange={(e) => setFilter("partTime", e.target.checked)}
            className="checkbox checkbox-md"
          />
          <span>Part-time</span>
        </label>
        {/* Full-time */}
        <label className="cursor-pointer flex items-center gap-2 mb-5">
          <input
            type="checkbox"
            checked={filters.fullTime}
            onChange={(e) => setFilter("fullTime", e.target.checked)}
            className="checkbox checkbox-md"
          />
          <span>Full-time</span>
        </label>
        {/* Budget */}
        <label className="flex flex-col mb-5">
          <span className="font-medium">Minimum Budget</span>
          <input
            type="number"
            value={filters.budget}
            onChange={(e) =>
              setFilter(
                "budget",
                e.target.value ? parseInt(e.target.value, 10) : ""
              )
            }
            className="border rounded-md p-2 bg-slate-800"
            placeholder="Enter minimum budget"
          />
        </label>

        {/* City Filter */}
        <label className="flex flex-col mb-5">
          <span className="font-medium">City</span>
          <select
            value={filters.city}
            onChange={(e) => setFilter("city", e.target.value)}
            className="border rounded-md p-2 bg-slate-800"
          >
            <option value="">Select city</option>
            {Array.from(new Set(jobs.flatMap((job) => job.location))).map(
              (city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              )
            )}
          </select>
        </label>
        {/* Skill Filter */}
        <label className="flex flex-col mb-5">
          <span className="font-medium">Skill</span>
          <select
            value={filters.skill}
            onChange={(e) => setFilter("skill", e.target.value)}
            className="border rounded-md p-2 bg-slate-800"
          >
            <option value="">Select skill</option>
            {Array.from(new Set(jobs.flatMap((job) => job.skills))).map(
              (skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              )
            )}
          </select>
        </label>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="bg-rose-950 text-white px-4 py-2 rounded-md mt-4"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
