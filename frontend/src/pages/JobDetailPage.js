import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useJobStore } from "../store/useJobStore";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import { format } from "date-fns";

const JobDetail = () => {
  const { id } = useParams();
  const { isApplyingJob } = useJobStore();
  const fetchJobWithApplicants = useJobStore(
    (state) => state.fetchJobWithApplicants
  );
  const applyJob = useJobStore((state) => state.applyJob);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuthStore();
  const userId = authUser ? authUser._id : null;
  console.log(userId);

  const formattedDate = job?.createdAt
    ? format(new Date(job.createdAt), "dd MMMM yyyy")
    : "";

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

  if (loading)
    return <div className="text-center p-6 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;
  if (!job)
    return <div className="text-center p-6 text-gray-500">Job not found.</div>;

  return (
    <div className="min-h-screen bg-base-200 text-base-content pt-20">
      {/* Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-base-100 shadow-xl rounded-xl mt-14 p-8 transition-all hover:shadow-2xl">
          {/* Job Title and Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-cyan-600 pb-4 mb-6">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <span
              className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${
                job.status === "open"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {job.status.toUpperCase()}
            </span>
          </div>

          {/* Employer and Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p>
                <span className="font-semibold">Employer:</span>{" "}
                <span>{job.employer.fullName}</span>
              </p>
            </div>
            <div className="flex flex-col sm:items-end">
              <p>
                <span className="font-semibold">📅 Posted Date:</span>{" "}
                <span>{formattedDate}</span>
              </p>
              <p className="mt-1">
                <span className="font-semibold">💰 Budget:</span>{" "}
                <span className="font-bold">${job.budget}</span>
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Job Description</h2>
            <p className="leading-relaxed">{job.description}</p>
          </div>

          {/* Required Skills */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Applicants */}
          {job.employer._id.toString() === userId && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Applicants</h2>
              {job.applicants.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {job.applicants.map((applicant) => (
                    <li key={applicant._id}>
                      <span className="font-medium">
                        {applicant.fullName || "Name Not Specified"}
                      </span>
                      <span className="text-base-content/60">
                        {" "}
                        ({applicant.email || "Email Not Specified"})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="italic text-base-content/60">
                  No applicants yet.
                </p>
              )}
            </div>
          )}

          {/* Apply Button */}
          <div className="text-center">
            {job.status === "open" ? (
              job.employer._id.toString() === userId ? (
                <button
                  className="px-6 py-3 bg-base-300 text-base-content/50 rounded-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  You are the Employer
                </button>
              ) : job.applicants.some(
                  (applicant) => applicant._id.toString() === userId
                ) ? (
                <button
                  className="px-6 py-3 bg-base-300 text-base-content/50 rounded-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  Already Applied
                </button>
              ) : (
                <button
                  className="px-6 py-3 bg-cyan-600 text-base-100 rounded-lg font-semibold hover:brightness-110 transition-colors duration-200"
                  onClick={() => applyJob(job._id)}
                >
                  {isApplyingJob ? "Applying..." : "Apply Now"}
                </button>
              )
            ) : (
              <button
                className="px-6 py-3 bg-base-300 text-base-content/50 rounded-lg font-semibold cursor-not-allowed"
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
