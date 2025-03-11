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
  });
  const [search, setSearch] = useState("");
  const [editingJob, setEditingJob] = useState(null);

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

    console.log("New Job Data:", newJobData);

    await createJob(newJobData);
    setNewJob({
      title: "",
      description: "",
      location: "",
      budget: "",
      status: "open",
      skills: [],
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
      job.skills.join(", ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-bl from-slate-800 to-cyan-900 text-white">
      <Navbar />
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-6">Job Manager</h1>

        {/* Yeni İş Ekleme Butonu */}
        <button
          className="bg-green-800 p-3 rounded-lg mt-6 mb-6 ml-auto block"
          onClick={() => document.getElementById("modal_add").showModal()}
        >
          {isCreatingJob ? "Adding..." : "Add Job"}
        </button>

        {/* Arama Çubuğu */}
        <input
          type="text"
          placeholder="Search for a job..."
          className="w-full p-3 rounded-lg bg-slate-800 text-white mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* İş Listesi */}
        <div className="bg-slate-800 p-6 rounded-lg shadow-md">
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
                  <th className="p-3 text-right">Skills</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="border-b border-gray-700">
                    <td className="p-3">{job.title}</td>
                    <td className="p-3">{job.description}</td>
                    <td className="p-3">{job.location}</td>
                    <td className="p-3">{job.budget}</td>
                    <td className="p-3 text-right">{job.skills.join(", ")}</td>
                    <td className="p-3 text-right">
                      <button
                        className="bg-blue-800 px-3 py-1 rounded mr-2"
                        onClick={() => {
                          setEditingJob(job); // Seçili işi state'e ata
                          document.getElementById("modal_edit").showModal(); 
                        }}
                      >
                        {isUpdatingJob ? "Updating..." : "Edit"}
                      </button>

                      <button
                        className="bg-red-900 px-3 py-1 rounded"
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
            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="w-full p-2 rounded bg-gray-700 text-white my-2"
              value={newJob.skills.join(", ")}
              onChange={(e) =>
                setNewJob({
                  ...newJob,
                  skills: e.target.value
                    .split(",")
                    .map((skill) => skill.trim()),
                })
              }
            />

            <div className="flex gap-2 mt-4">
              <button
                className="bg-green-600 p-2 rounded"
                onClick={handleAddJob}
              >
                Add
              </button>
              <button
                className="bg-gray-600 p-2 rounded"
                onClick={() => document.getElementById("modal_add").close()}
              >
                Cancel
              </button>
            </div>
            {/* İş Güncelleme Modalı */}
            <dialog id="modal_edit" className="modal bg-gray-900 text-white">
              <div className="modal-box bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Edit Job</h3>
                <input
                  type="text"
                  placeholder="Job Title"
                  className="w-full p-2 rounded bg-gray-700 text-white my-2"
                  value={editingJob?.title || ""}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-full p-2 rounded bg-gray-700 text-white my-2"
                  value={editingJob?.description || ""}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-2 rounded bg-gray-700 text-white my-2"
                  value={editingJob?.location || ""}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, location: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Budget"
                  className="w-full p-2 rounded bg-gray-700 text-white my-2"
                  value={editingJob?.budget || ""}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, budget: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  className="w-full p-2 rounded bg-gray-700 text-white my-2"
                  value={editingJob?.skills.join(", ") || ""}
                  onChange={(e) =>
                    setEditingJob({
                      ...editingJob,
                      skills: e.target.value
                        .split(",")
                        .map((skill) => skill.trim()),
                    })
                  }
                />

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-600 p-2 rounded"
                    onClick={handleUpdateJob}
                  >
                    Update
                  </button>
                  <button
                    className="bg-gray-600 p-2 rounded"
                    onClick={() =>
                      document.getElementById("modal_edit").close()
                    }
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default JobManager;
