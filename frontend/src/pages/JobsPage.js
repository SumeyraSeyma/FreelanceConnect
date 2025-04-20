import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useJobStore } from "../store/useJobStore";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Pencil, Trash, X } from "lucide-react";

const JobManager = () => {
  const {
    fetchUserJobs,
    createJob,
    deleteJob,
    updateJob,
    userJobs,
    isFetchingUserJobs,
    isCreatingJob,
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
    skills: [],
    remote: false,
    time: "full-time",
    applicants: [],
  });
  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [selectedJob, setSelectedJob] = useState(null);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleAddJob = async () => {
    if (
      !newJob.title ||
      !newJob.description ||
      !newJob.location ||
      !newJob.budget
    ) {
      toast.error("Please fill all the required fields!");
      return;
    }

    const skillsArray = newJob.skills.length > 0 ? newJob.skills : [];
    const newJobData = { ...newJob, skills: skillsArray };

    await createJob(newJobData);
    setNewJob({
      title: "",
      description: "",
      location: "",
      budget: "",
      status: "open",
      skills: [],
      remote: false,
      time: "full-time",
      applicants: [],
    });
    document.getElementById("modal_add").close();
  };

  const handleUpdateJob = async () => {
    if (
      !editingJob.title ||
      !editingJob.description ||
      !editingJob.location ||
      !editingJob.budget
    ) {
      toast.error("Please fill all the required fields!");
      return;
    }

    const updatedJobData = {
      ...editingJob,
      skills: editingJob.skills.length > 0 ? editingJob.skills : [],
    };

    await updateJob(editingJob._id, updatedJobData);
    setEditingJob(null);
    setSelectedJob(null);
    document.getElementById("modal_edit").close();
    document.getElementById("modal_detail").close();
  };

  const filteredJobs = userJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.join(", ").toLowerCase().includes(search.toLowerCase()) ||
      job.time.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 bg-base-200 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-base-content">
          Job Manager
        </h1>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              className={`btn ${
                viewMode === "table" ? "bg-cyan-600" : "btn-outline"
              }`}
              onClick={() => setViewMode("table")}
            >
              Table View
            </button>
            <button
              className={`btn ${
                viewMode === "card" ? "bg-cyan-600" : "btn-outline"
              }`}
              onClick={() => setViewMode("card")}
            >
              Card View
            </button>
          </div>
          <button
            className="btn btn-success text-white"
            onClick={() => document.getElementById("modal_add").showModal()}
          >
            {isCreatingJob ? "Adding..." : "Add Job"}
          </button>
        </div>

        <input
          type="text"
          placeholder="Search for a job..."
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-base-100 p-6 rounded-xl shadow-xl overflow-x-auto">
          {isFetchingUserJobs ? (
            <p className="text-center text-gray-400">Loading jobs...</p>
          ) : viewMode === "table" ? (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Skills</th>
                  <th>Time</th>
                  <th>Remote</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="cursor-pointer hover:bg-base-200 italic"
                    onClick={() => {
                      setSelectedJob(job);
                      document.getElementById("modal_detail").showModal();
                    }}
                  >
                    <td>{truncateText(job.title, 20)}</td>
                    <td>{truncateText(job.description, 30)}</td>
                    <td>{job.location}</td>
                    <td>{job.budget}</td>
                    <td>{job.skills.join(", ") || "no skills"}</td>
                    <td>{job.time}</td>
                    <td>{job.remote ? "Yes" : "No"}</td>
                    <td>{job.applicants.length}</td>
                    <td>
                      <span
                        className={`badge text-white ${
                          job.status === "open"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="card bg-base-100 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 w-full h-64 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link to={`/jobs/${job._id}`}>
                      <h2 className="font-semibold text-lg text-base-content mr-3 italic">
                        {job.title}
                      </h2>
                    </Link>
                    <span
                      className={`badge text-xs font-medium px-2 py-1 rounded italic ${
                        job.status === "open"
                          ? "badge-success text-white"
                          : "badge-error text-white"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm text-base-content/80 mb-3 italic line-clamp-3">
                      {job.description}
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-base-content">
                      <div>
                        <p>
                          <strong className="text-base-content/70 italic">
                            Location:
                          </strong>{" "}
                          {truncateText(job.location, 15)}
                        </p>
                        <p>
                          <strong className="text-base-content/70 italic">
                            Budget:
                          </strong>{" "}
                          {job.budget}
                        </p>
                        <p>
                          <strong className="text-base-content/70 italic">
                            Skills:
                          </strong>{" "}
                          {truncateText(job.skills.join(", "), 20) ||
                            "no skills"}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong className="text-base-content/70 italic">
                            Time:
                          </strong>{" "}
                          {job.time}
                        </p>
                        <p>
                          <strong className="text-base-content/70 italic">
                            Remote:
                          </strong>{" "}
                          {job.remote ? "Yes" : "No"}
                        </p>
                        <p>
                          <strong className="text-base-content/70 italic">
                            Applicants:
                          </strong>{" "}
                          {job.applicants.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 gap-1">
                    <button
                      className="btn btn-xs bg-cyan-600 px-3"
                      onClick={() => {
                        setEditingJob(job);
                        document.getElementById("modal_edit").showModal();
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-xs btn-error px-3"
                      onClick={() => deleteJob(job._id)}
                    >
                      <Trash className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <dialog id="modal_add" className="modal">
          <div className="modal-box bg-base-100 text-base-content rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Create New Job</h3>
            <form method="dialog" className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                className="input input-bordered w-full"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
              />
              <textarea
                rows={3}
                placeholder="Description"
                className="w-full resize-none rounded-lg p-3 text-sm bg-base-100 border border-base-300 text-base-content focus:outline-none focus:ring-2 focus:ring-cyan-600 overflow-y-auto"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                maxLength={200}
                required
              />
              <input
                type="text"
                placeholder="Location (Required)"
                className="input input-bordered w-full"
                value={newJob.location}
                onChange={(e) =>
                  setNewJob({ ...newJob, location: e.target.value })
                }
                required
                maxLength={50}
              />
              <input
                type="text"
                placeholder="Budget"
                className="input input-bordered w-full"
                value={newJob.budget}
                onChange={(e) =>
                  setNewJob({ ...newJob, budget: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Skills (comma separated)"
                className="input input-bordered w-full"
                value={newJob.skills.join(", ")}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                maxLength={50}
              />
              <div className="flex items-center gap-6">
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="time"
                    className="radio"
                    value="full-time"
                    checked={newJob.time === "full-time"}
                    onChange={(e) =>
                      setNewJob({ ...newJob, time: e.target.value })
                    }
                  />
                  <span>Full-time</span>
                </label>
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="time"
                    className="radio"
                    value="part-time"
                    checked={newJob.time === "part-time"}
                    onChange={(e) =>
                      setNewJob({ ...newJob, time: e.target.value })
                    }
                  />
                  <span>Part-time</span>
                </label>
              </div>
              <div className="flex items-center gap-6">
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={newJob.remote}
                    onChange={() =>
                      setNewJob({ ...newJob, remote: !newJob.remote })
                    }
                  />
                  <span>Remote</span>
                </label>
              </div>
              <div className="modal-action flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleAddJob}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("modal_add").close()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>

        <dialog id="modal_detail" className="modal">
          <div className="modal-box bg-base-100 text-base-content rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Job Details</h3>
            {selectedJob && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <Link to={`/jobs/${selectedJob._id}`}>
                    <h2 className="font-bold text-xl italic">
                      {selectedJob.title}
                    </h2>
                  </Link>
                  <span
                    className={`badge ${
                      selectedJob.status === "open"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {selectedJob.status}
                  </span>
                </div>
                <p className="text-sm text-base-content mb-3 italic line-clamp-3">
                  {selectedJob.description}
                </p>
                <div className="text-sm space-y-1 italic">
                  <p>
                    <strong>Location:</strong> {selectedJob.location}
                  </p>
                  <p>
                    <strong>Budget:</strong> {selectedJob.budget}
                  </p>
                  <p>
                    <strong>Skills:</strong>{" "}
                    {selectedJob.skills.join(", ") || "no skills"}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedJob.time}
                  </p>
                  <p>
                    <strong>Remote:</strong> {selectedJob.remote ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Applicants:</strong> {selectedJob.applicants.length}
                  </p>
                </div>
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    className="btn btn-sm bg-cyan-600"
                    onClick={() => {
                      setEditingJob(selectedJob);
                      document.getElementById("modal_detail").close();
                      document.getElementById("modal_edit").showModal();
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => {
                      deleteJob(selectedJob._id);
                      document.getElementById("modal_detail").close();
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() =>
                      document.getElementById("modal_detail").close()
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </dialog>

        <dialog id="modal_edit" className="modal">
          <div className="modal-box bg-base-100 text-base-content rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Edit Job</h3>
            <form method="dialog" className="space-y-4">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Job Title"
                value={editingJob?.title || ""}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, title: e.target.value })
                }
                maxLength={50}
                required
              />
              <textarea
                rows={3}
                className="w-full resize-none rounded-lg p-3 text-sm bg-base-100 border border-base-300 text-base-content focus:outline-none focus:ring-2 focus:ring-cyan-600 overflow-y-auto"
                placeholder="Description"
                value={editingJob?.description || ""}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, description: e.target.value })
                }
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Location"
                value={editingJob?.location || ""}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, location: e.target.value })
                }
                maxLength={50}
                required
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Budget"
                value={editingJob?.budget || ""}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, budget: e.target.value })
                }
              />
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Skills (comma separated)"
                value={editingJob?.skills.join(", ") || ""}
                onChange={(e) =>
                  setEditingJob({
                    ...editingJob,
                    skills: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
              <div className="flex items-center gap-6">
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="edit_time"
                    className="radio"
                    value="full-time"
                    checked={editingJob?.time === "full-time"}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, time: e.target.value })
                    }
                  />
                  <span>Full-time</span>
                </label>
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="edit_time"
                    className="radio"
                    value="part-time"
                    checked={editingJob?.time === "part-time"}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, time: e.target.value })
                    }
                  />
                  <span>Part-time</span>
                </label>
              </div>
              <div className="flex items-center gap-6">
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    className="radio"
                    value="open"
                    checked={editingJob?.status === "open"}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, status: e.target.value })
                    }
                  />
                  <span>Open</span>
                </label>
                <label className="label cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="status"
                    className="radio"
                    value="closed"
                    checked={editingJob?.status === "closed"}
                    onChange={(e) =>
                      setEditingJob({ ...editingJob, status: e.target.value })
                    }
                  />
                  <span>Closed</span>
                </label>
              </div>
              <div className="flex items-center gap-6">
                <label className="label flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox cursor-pointer"
                    checked={editingJob?.remote}
                    onChange={() =>
                      setEditingJob({
                        ...editingJob,
                        remote: !editingJob.remote,
                      })
                    }
                  />
                  <span>Remote</span>
                </label>
              </div>
              <div className="modal-action flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateJob}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("modal_edit").close()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default JobManager;
