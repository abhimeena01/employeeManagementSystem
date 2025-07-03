import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
        alert("Failed to fetch user profile.");
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>
      <div className="flex items-center justify-around flex-wrap">
        <img
          src={
            profile.profileImage
              ? `http://localhost:5000/uploads/${profile.profileImage}`
              : "/default-profile.png"
          }
          alt="Profile"
          className="w-52 h-52 object-cover rounded-full border"
        />
        <div className="space-y-3 mt-5 md:mt-0">
          <Info label="Name" value={profile.name} />
          <Info label="Email" value={profile.email} />
          <Info label="Role" value={profile.role} />
          <Info label="Employee ID" value={profile.employeeId} />
          <Info label="Gender" value={profile.gender} />
          <Info
            label="Date of Birth"
            value={
              profile.dob
                ? new Date(profile.dob).toLocaleDateString()
                : "N/A"
            }
          />
          <Info label="Marital Status" value={profile.maritalStatus} />
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex space-x-3">
    <p className="font-bold">{label}:</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default Profile;
