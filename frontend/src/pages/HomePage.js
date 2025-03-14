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
    <div className="bg-gradient-to-bl from-slate-800 to-cyan-900">
      <Navbar />
      <SwiperCarousel />
      <div className="flex h-screen px-16 pt-20">
        {/* Sol Sidebar */}
        <div className="w-3/12 rounded-sm shadow-2xl p-4">
          <FilterSidebar />
        </div>

        {/* Ana İçerik Artık Burada! */}
        <FilteredJobList />

        {/* Sağ Sidebar */}
        <div className="hidden lg:block w-3/12 rounded-sm shadow-2xl p-4">
          <EmployerSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
