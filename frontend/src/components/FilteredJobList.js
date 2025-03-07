import React, { useState } from "react";
import { useJobStore } from "../store/useJobStore";

const FilteredJobList = () => {
  const { jobs, filters } = useJobStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const filteredJobs = jobs.filter((job) => {
    if (filters.remote && !job.remote) return false;
    if (filters.partTime && job.time !== "part-time") return false;
    if (filters.fullTime && job.time !== "full-time") return false;
    if (filters.budget && job.budget < filters.budget) return false;
    if (filters.city && filters.city !== "" && job.location !== filters.city)
      return false;
    if (
      filters.skill &&
      filters.skill !== "" &&
      !job.skills.some((skill) =>
        skill.toLowerCase().includes(filters.skill.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex-1 mx-4 p-4 shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Latest Jobs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <div key={job.id} className="rounded-md shadow-white shadow-sm p-4 flex flex-col h-full">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              {job.skills.length > 0 ? (
                <div className="flex gap-2 mt-2 mb-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">No skills required</span>
              )}
              <span className="italic flex-grow">
                {truncateText(job.description, 90)}
              </span>
              <div className="flex justify-between items-center">
                <span className="shadow-rose-950 shadow-md p-2">{job.status}</span>
                <button className="bg-rose-950 text-white px-4 py-2 rounded-md">
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No jobs found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-rose-950 text-white rounded-md disabled:bg-gray-400"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span className="text-lg font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            className="px-4 py-2 bg-rose-950 text-white rounded-md disabled:bg-gray-400"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FilteredJobList;
