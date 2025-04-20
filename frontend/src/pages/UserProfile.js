import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";
import EmployerSidebar from "../components/EmployerSidebar";

const UserProfile = () => {
  const { setSelectedUser, getMessages } = useChatStore();
  const { getUserProfile } = useAuthStore();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (id) {
          await getMessages(id);
        } else {
          console.error("User ID is not defined");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    fetchMessages(); 
  }, [id, getMessages]);  


  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await getUserProfile(id);
        if (!userData) {
          throw new Error("User not found");
        }
        setUser(userData); 
        setSelectedUser(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [id, getUserProfile, setSelectedUser]);
  

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <Navbar />
        <div className="container mx-auto px-4 pt-12 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 py-8">
        <Navbar />
        <div className="container mx-auto px-4 pt-12 text-center">
          <p>User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <Navbar />
      <div className="container mx-auto px-4 pt-12">
        <div
          className={`flex flex-col lg:flex-row gap-6 transition-all duration-500 justify-center `}
        >
          {/* Profile Card */}
          <div
            className={`card bg-base-100 shadow-xl transition-all duration-500 w-full max-w-2xl p-6`}
          >
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="avatar">
                  <div className="w-32 rounded-full ring bg-cyan-600 ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        user.image ||
                        "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                      }
                      alt="Profile"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">
                    {user.fullName || "Name Not Provided"}
                  </h1>
                  <div className="mt-4 flex gap-2 pt-6">
                    <Link to={`/messages`} >
                    <div
                      className="btn bg-cyan-600 hover:bg-cyan-700 rounded-md shadow-lg border border-base-300"
                    >
                      Send Message
                    </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-2">About</h2>
                <p className="text-base-content/80">
                  {user.bio || "No bio provided"}
                </p>
              </div>

              {/* Skills */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.length ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge badge-lg bg-cyan-600 p-4"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-base-content/60">No skills added yet</p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-2">Contact</h2>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{user.email || "Email Not Provided"}</span>
                </div>
              </div>
            </div>
          </div>

                    {/* Right Sidebar */}
                    <div >
            <EmployerSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
