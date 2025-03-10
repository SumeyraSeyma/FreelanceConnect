import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useJobStore } from "../store/useJobStore";

const JobManager = () => {
  const {
    fetchUserJobs,
    createJob,
    deleteJob,
    updateJob,
    userJobs,
    isFetchingUserJobs,
    isCreatingJob,
    isDeletingJob,
  } = useJobStore();

  useEffect(() => {
    const fetchJobs = async () => {
      await fetchUserJobs();
    };
    fetchJobs();
  }, [fetchUserJobs]);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    budget: "",
    status: "open",
  });
  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState(null);

  const handleAddJob = async () => {
    if (
      !newJob.title ||
      !newJob.description ||
      !newJob.location ||
      !newJob.budget ||
      !newJob.status
    ) {
      alert(
        "Please fill in all required fields (Title, Description, Location)."
      );
      return;
    }

    await createJob(newJob);
    setNewJob({ title: "", description: "", location: "", budget: "", status: "open" });
    document.getElementById("modal_add").close();
  };
  return (
    <div className="min-h-screen pt-20 bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-6">Job Manager</h1>

        {/* İş Listesi */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          {isFetchingUserJobs ? (
            <p className="text-center text-gray-400">Loading jobs...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">description</th>
                  <th className="p-3 text-left">Location</th>
                  <th className="p-3 text-left">Budget</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {userJobs.map((job) => (
                  <tr key={job._id} className="border-b border-gray-700">
                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.description}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">{job.budget}</td>
                    <td className="p-3 text-right">
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Yeni İş Ekleme Butonu */}
        <button
          className="w-full bg-green-600 p-3 rounded-lg mt-6"
          onClick={() => document.getElementById("modal_add").showModal()}
        >
          {isCreatingJob ? "Adding..." : "Add New Job"}
        </button>

        {/* Yeni İş Ekleme Modalı */}
        <dialog id="modal_add" className="modal bg-gray-900 text-white">
          <div className="modal-box bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Create New Job</h3>
            <input
              type="text"
              placeholder="Job Title"
              className="w-full p-2 rounded bg-gray-700 text-white my-2"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 rounded bg-gray-700 text-white my-2"
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Location (Required)"
              className="w-full p-2 rounded bg-gray-700 text-white my-2"
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
              required
            />

            <input
              type="text"
              placeholder="Budget"
              className="w-full p-2 rounded bg-gray-700 text-white my-2"
              value={newJob.budget}
              onChange={(e) => setNewJob({ ...newJob, budget: e.target.value })}
            />
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default JobManager;
