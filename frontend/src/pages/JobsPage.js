import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useJobStore } from "../store/useJobStore";
import toast from "react-hot-toast";

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
    isUpdatingJob,
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

  const handleAddJob = async () => {
    if (
      !newJob.title ||
      !newJob.description ||
      !newJob.location ||
      !newJob.budget ||
      !newJob.time 
    ) {
      toast.error("Please fill all the required fields!");
      return;
    }

    const skillsArray = newJob.skills.length > 0 ? newJob.skills : [];

    const newJobData = { ...newJob, skills: skillsArray };

    console.log("New Job Data:", newJobData);

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

    console.log("Updated Job Data:", updatedJobData);

    await updateJob(editingJob._id, updatedJobData);

    setEditingJob(null);
    document.getElementById("modal_edit").close();
  };

  const filteredJobs = userJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.join(", ").toLowerCase().includes(search.toLowerCase()) ||
      job.time.toLowerCase().includes(search.toLowerCase()) ||
      job.remote.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 bg-base-200 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-base-content">
          Job Manager
        </h1>

        {/* Add Job Button */}
        <div className="flex justify-end">
          <button
            className="btn btn-success"
            onClick={() => document.getElementById("modal_add").showModal()}
          >
            {isCreatingJob ? "Adding..." : "Add Job"}
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for a job..."
          className="input input-bordered w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Job List Table */}
        <div className="bg-base-100 p-6 rounded-xl shadow-xl overflow-x-auto">
          {isFetchingUserJobs ? (
            <p className="text-center text-gray-400">Loading jobs...</p>
          ) : (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>{job.title}</td>
                    <td>{job.description}</td>
                    <td>{job.location}</td>
                    <td>{job.budget}</td>
                    <td>{job.skills.join(", ")}</td>
                    <td>{job.time}</td>
                    <td>{job.remote ? "Yes" : "No"}</td>
                    <td>{job.applicants.length}</td>
                    <td className="flex gap-2 justify-end">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setEditingJob(job);
                          document.getElementById("modal_edit").showModal();
                        }}
                      >
                        {isUpdatingJob ? "Updating..." : "Edit"}
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => deleteJob(job._id)}
                      >
                        {isDeletingJob ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Add Job Modal */}
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
              <input
                type="text"
                placeholder="Description"
                className="input input-bordered w-full"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
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
              />

              {/* Time Options */}
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

              {/* Remote Option */}
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

              {/* Action Buttons */}
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

        {/* Edit Job Modal */}
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
              />
              <input
                type="text"
                className="input input-bordered w-full"
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

              {/* Time Options */}
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

              {/* Remote Option */}
              <label className="label cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={editingJob?.remote}
                  onChange={() =>
                    setEditingJob({ ...editingJob, remote: !editingJob.remote })
                  }
                />
                <span>Remote</span>
              </label>

              {/* Action Buttons */}
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
