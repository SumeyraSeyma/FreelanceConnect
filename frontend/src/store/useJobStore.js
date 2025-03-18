import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useJobStore = create((set) => ({
  jobs: [],
  userJobs: [],
  userApplications : [],
  filters: {
    remote: false,
    budget: false,
    partTime: false,
    fullTime: false,
    city: "",
    skill: "",
    status: "",
  },

  isFetchingJobs: false,
  isFetchingUserJobs: false,
  isCreatingJob: false,
  isDeletingJob: false,
  isUpdatingJob: false,
  isApplyingJob: false,

  setFilter: (filterKey, value) => {
    set((state) => ({
      filters: { ...state.filters, [filterKey]: value },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        remote: false,
        budget: false,
        partTime: false,
        fullTime: false,
        city: "",
        skill: "",
        status: "",
      },
    });
  },

  fetchAllJobs: async () => {
    set({ isFetchingJobs: true });
    try {
      const response = await axiosInstance.get("/jobs");
      set({ jobs: response.data });
    } catch (error) {
      console.error(
        "Error fetching jobs:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isFetchingJobs: false });
    }
  },

  fetchUserJobs: async () => {
    set({ isFetchingUserJobs: true });
    try {
      const response = await axiosInstance.get("/jobs/user");
      set({ userJobs: response.data });
    } catch (error) {
      console.error(
        "Error fetching user jobs:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isFetchingUserJobs: false });
    }
  },

  createJob: async (jobData) => {
    set({ isCreatingJob: true });
    try {
      const response = await axiosInstance.post("/jobs", jobData);
      set((state) => ({
        jobs: [...state.jobs, response.data],
        userJobs: [...state.userJobs, response.data],
      }));
    } catch (error) {
      console.error(
        "Error creating job:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isCreatingJob: false });
    }
  },

  deleteJob: async (jobId) => {
    set({ isDeletingJob: true });
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== jobId),
        userJobs: state.userJobs.filter((job) => job._id !== jobId),
      }));
    } catch (error) {
      console.error(
        "Error deleting job:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isDeletingJob: false });
    }
  },

  updateJob: async (jobId, jobData) => {
    set({ isUpdatingJob: true });
    try {
      const response = await axiosInstance.put(`/jobs/${jobId}`, jobData);
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job._id === jobId ? response.data : job
        ),
        userJobs: state.userJobs.map((job) =>
          job._id === jobId ? response.data : job
        ),
      }));
    } catch (error) {
      console.error(
        "Error updating job:",
        error.response?.data?.message || error.message
      );
    } finally {
      set({ isUpdatingJob: false });
    }
  },

  applyJob: async (id) => {
    set({ isApplyingJob: true });
    try {
      const response = await axiosInstance.post(`/jobs/${id}/apply`);
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job._id === id ? { ...job, applicants: [...job.applicants, response.data.applicant] } : job
        ),
        userApplications: [...state.userApplications, response.data.job], // Kullanıcının başvurduğu işlere ekle
      }));
    } catch (error) {
      console.error("Error applying for job:", error.response?.data?.message || error.message);
    } finally {
      set({ isApplyingJob: false });
    }
  },

  fetchJobWithApplicants: async (id) => {
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching job details:", error.response?.data?.message || error.message);
    }
  },
}));
