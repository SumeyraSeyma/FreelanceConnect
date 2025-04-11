import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import EmployerSidebar from "../components/EmployerSidebar";
import SwiperCarousel from "../components/SwiperCarousel";
import FilteredJobList from "../components/FilteredJobList";
import { useJobStore } from "../store/useJobStore";

const HomePage = () => {
  const { fetchAllJobs } = useJobStore();

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  return (
    <div className="flex flex-col bg-base-200">
      <Navbar />
        <SwiperCarousel />
        <div className="flex h-screen px-16">
          {/* Left Sidebar */}
          <div className="w-3/12 rounded-sm shadow-md p-4 bg-base-100 shadow-slate-300">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <FilteredJobList />

          {/* Right Sidebar */}
          <div className="hidden lg:block w-3/12 rounded-sm shadow-md p-4 bg-base-100 shadow-slate-300">
            <EmployerSidebar />
          </div>
        </div>
      </div>
  );
};

export default HomePage;
