import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useJobStore } from "../store/useJobStore";
import Navbar from "../components/Navbar";

const JobDetail = () => {
  const { id } = useParams();
  const fetchJobWithApplicants = useJobStore((state) => state.fetchJobWithApplicants);
  const applyJob = useJobStore((state) => state.applyJob);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJob = async () => {
      setLoading(true);
      try {
        const jobData = await fetchJobWithApplicants(id);
        if (!jobData) throw new Error("Job not found.");
        setJob(jobData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id, fetchJobWithApplicants]);

  if (loading) return <div className="text-center p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!job) return <div className="text-center p-6 text-gray-500">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-bl from-slate-800 to-cyan-900 shadow-lg shadow-cyan-90">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6 mt-20">
        <div className="bg-white shadow-xl rounded-xl p-8 transition-all hover:shadow-2xl">
          {/* Job Title and Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <span
              className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${
                job.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {job.status.toUpperCase()}
            </span>
          </div>

          {/* Employer and Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Employer:</span>{" "}
                <span className="text-gray-800">{job.employer}</span>
              </p>
            </div>
            <div className="flex flex-col sm:items-end">
              <p className="text-gray-600">
                <span className="font-semibold">📅 Posted Date:</span>{" "}
                <span className="text-gray-800">{job.createdAt}</span>
              </p>
              <p className="text-gray-600 mt-1">
                <span className="font-semibold">💰 Budget:</span>{" "}
                <span className="text-gray-800 font-bold">${job.budget}</span>
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Applicants */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Applicants</h2>
            {job.applicants.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {job.applicants.map((applicant) => (
                  <li key={applicant._id} className="text-gray-700">
                    <span className="font-medium">{applicant.name || "Name Not Specified"}</span>
                    <span className="text-gray-500"> ({applicant.email || "Email Not Specified"})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No applicants yet.</p>
            )}
          </div>

          {/* Apply Button */}
          <div className="text-center">
            {job.status === "open" ? (
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                onClick={() => applyJob(job._id)}
              >
                Apply
              </button>
            ) : (
              <button
                className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                disabled
              >
                Application Closed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;