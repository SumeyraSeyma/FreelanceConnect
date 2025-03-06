import React from "react";
import { useJobStore } from "../store/useJobStore";

const FilteredJobList = () => {
  const { jobs, filters } = useJobStore();

  const filteredJobs = jobs.filter((job) => {
    if (filters.remote && !job.remote) return false;
    if (filters.partTime && job.time !== "part-time") return false;
    if (filters.fullTime && job.time !== "full-time") return false;

     // Eğer bir bütçe girilmişse, sadece bu bütçeden büyük veya eşit işler göster
  if (filters.budget && job.budget < filters.budget) {
    return false;
  }
  
    // Eğer bir şehir (location) seçilmişse, sadece o şehirdeki işleri göster
    if (filters.city && filters.city !== "" && job.location !== filters.city) {
      return false;
    }
  
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
  

  return (
    <div className="flex-1 mx-4 p-4 border-l border-r border-zinc-400 shadow-md">
      <h1 className="text-2xl font-semibold text-center mb-4">Latest Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="rounded-md shadow-md p-4">
              <h2 className="text-xl font-semibold">{job.title}</h2>
              {job.skills.length > 0 ? (
                <div className="flex gap-2 mt-2">
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
              <div className="flex justify-between items-center mt-4">
                <span>{job.status}</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Apply
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default FilteredJobList;
