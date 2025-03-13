import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getAllJobs route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }); // employer alanı ile filtreleme
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in getJob route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createJob = async (req, res) => {
  const { title, description, budget, status, location, skills, time, remote  } = req.body;
  const employer = req.user._id;
  try {
    const job = await Job.create({
      title,
      description,
      budget,
      employer,
      status,
      location,
      skills,
      time,
      remote,
      applicants: [],
    });
    res.status(201).json(job);
  } catch (error) {
    console.error("Error in createJob route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Kullanıcının kendi ilanı olup olmadığını kontrol et
    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJob route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Kullanıcının kendi ilanı olup olmadığını kontrol et
    if (job.employer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    console.error("Error in updateJob route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const applyJob = async (req, res) => {
  const { jobId } = req.params;
  const applicantId = req.user._id; 

  try {
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.applicants.includes(applicantId)) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    job.applicants.push(applicantId);
    await job.save();

    res.status(200).json({ message: "Successfully applied to the job", job });
  } catch (error) {
    console.error("Error in applyJob route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getJobWithApplicants = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).populate("applicants", "name email"); // Başvuran kişilerin adını ve e-postasını getir

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("Error in getJobWithApplicants route:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


