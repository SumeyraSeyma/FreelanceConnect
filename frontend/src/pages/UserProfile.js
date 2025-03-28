import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import { MessageSquare, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "../components/MessageInput";

const UserProfile = () => {
  const { messages } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { id } = useParams();
  const { getUserProfile } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await getUserProfile(id);
        if (!userData) {
          throw new Error("User data not found");
        }
        setUser(userData);
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, getUserProfile]);

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
          className={`flex flex-col lg:flex-row gap-6 transition-all duration-500 ${
            showChat ? "justify-between" : "justify-center"
          }`}
        >
          {/* Profile Card */}
          <div
            className={`card bg-base-100 shadow-xl transition-all duration-500 ${
              showChat ? "lg:w-1/2 transform scale-95" : "w-full max-w-2xl p-6"
            }`}
          >
            <div className="card-body">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="avatar">
                  <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
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
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowChat(true)}
                    >
                      Send Message
                    </button>
                    <button className="btn btn-outline">Save Profile</button>
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
                        className="badge badge-lg badge-secondary"
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

          {/* Chat Box */}
          {showChat && (
            <div className="lg:w-1/2 bg-base-100 shadow-xl rounded-xl p-6 animate-fade-slide-in">
              <div className="p-2.5 border-b border-base-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="size-10 rounded-full relative">
                        <img
                          src={user.image || "/avatar.png"}
                          alt={user.fullName}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.fullName}</h3>
                      <p className="text-sm text-base-content/70">
                        {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowChat(false)}>
                    <X />
                  </button>
                </div>
              </div>
              {messages.length ? (
                <div className="overflow-y-auto h-96">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex gap-2 mt-4 ${
                        message.senderId === user._id ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          message.senderId === user._id
                            ? "bg-base-200 text-base-content"
                            : "bg-primary text-primary-content"
                        }`}
                      >
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="chat-container h-64 overflow-y-auto mb-4 border p-3 rounded items-center justify-center flex flex-col">
                    <MessageSquare  className="size-10"/>
                <p className="text-base-content/60">No messages yet</p>
              </div>
              )  
              }
              <MessageInput />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
