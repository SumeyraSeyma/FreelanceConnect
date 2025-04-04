import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import { Circle, MessageSquare, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import MessageInput from "../components/MessageInput";

const UserProfile = () => {
  const { messages, setUserSelected, getMessages } = useChatStore();
  const { onlineUsers, authUser, getUserProfile } = useAuthStore();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const messageEndRef = useRef(null);

  function formatTime(createdAt) {
    const date = new Date(createdAt);
  
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`;
  }

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
        setUserSelected(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [id, getUserProfile, setUserSelected]);
  

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
                          src={
                            user.image ||
                            "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                          }
                          alt={user.fullName}
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.fullName}</h3>
                      <div className="text-sm text-base-content/70">
                      
                        {onlineUsers.includes(user._id) ?
                        (
                          <div className="flex items-center gap-1">
                          <Circle className="text-green-500 size-4" />
                          <span className="">Online</span>
                          </div> )
                         : 
                         (
                          <div className="flex items-center gap-1">
                          <Circle className="text-gray-600 size-4" />
                          <span className="">Offline</span>
                          </div> )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowChat(false)}>
                    <X />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-72">
              { messages.length > 0 ? (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`chat ${
                            message.senderId === authUser._id ? "chat-end" : "chat-start"
                          }`}
                          ref={messageEndRef}
                        >
                          <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                              <img
                                src={
                                  message.senderId === authUser._id
                                    ? authUser.image || "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                                    : user.image || "https://st.depositphotos.com/1537427/3571/v/950/depositphotos_35717211-stock-illustration-vector-user-icon.jpg"
                                }
                                alt="profile pic"
                              />
                            </div>
                          </div>
                          <div className="chat-header mb-1 ">
                            <time className="text-xs opacity-50 ml-1">
                              {formatTime(message.createdAt)}
                            </time>
                          </div>
                          <div className="chat-bubble flex flex-col">
                            {message.image&&(
                              <img 
                              src={message.image}
                              alt="Attachment"
                              className="sm:max-w-[200px] rounded-md mb-2"
                              />
                            )}
                            {message.text && <p>{message.text}</p>}
                          </div>
                        </div>
                      ))
                    ) : (
                <div className="chat-container h-64 overflow-y-auto mb-4 border p-3 rounded items-center justify-center flex flex-col">
                    <MessageSquare  className="size-10"/>
                <p className="text-base-content/60">No messages yet</p>
              </div>
              )  

              }
                            </div>
              <MessageInput />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
