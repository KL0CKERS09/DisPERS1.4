"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  age: number;
  phone: string;
  email: string;
  username: string;
  createdAt: string;
  profilePicture?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [originalUser, setOriginalUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const [tab, setTab] = useState<"info" | "password">("info");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

  // Separate state for each password visibility toggle
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("/api/profile");
      setUser(res.data);
      setOriginalUser(res.data);
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (user && validateForm()) {
      await axios.put("/api/profile", user);
  
      if (imagePreview && imagePreview !== originalUser?.profilePicture) {
        await axios.post("/api/profile/picture", {
          profilePicture: imagePreview,
        });
      }
  
      setOriginalUser(user);
      setEditing(false);
    }
  };
  

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() || "";
      setImagePreview(result);
      setUser({ ...user, profilePicture: result });
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordChangeError("Passwords do not match.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordChangeError(
        "New password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
      );
      return;
    }

    // Check if the current password is correct
    try {
      const passwordCheck = await axios.post("/api/profile/password", { currentPassword });
      if (!passwordCheck.data.isValid) {
        setPasswordChangeError("Current password is incorrect.");
        return;
      }
    } catch (error) {
      setPasswordChangeError("Error verifying current password. Please try again.");
      return;
    }

    // Proceed with password change
    try {
      await axios.put("/api/profile/password", { currentPassword, newPassword });
      setPasswordChangeError("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setPasswordChangeError("Error changing password. Please try again.");
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!user?.firstName) errors.firstName = "First name is required.";
    if (!user?.lastName) errors.lastName = "Last name is required.";
    if (!user?.email || !/\S+@\S+\.\S+/.test(user.email)) errors.email = "Invalid email.";
    if (!user?.phone || !/^\d{11}$/.test(user.phone)) errors.phone = "Phone number must be 11 digits.";
    if (!user?.age || user.age < 18) errors.age = "Age must be at least 18.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fieldLabels: { [key: string]: string } = {
    firstName: "First Name",
    lastName: "Last Name",
    age: "Age",
    phone: "Phone Number",
    email: "Email",
    username: "Username",
  };

  const hasUserChanges = JSON.stringify(user) !== JSON.stringify(originalUser);
  const canSave = editing && hasUserChanges;
  const canChangePassword =
    currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto min-h-[100vh] p-6 rounded-xl flex flex-col items-start justify-center">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="w-full min-h-[70vh] flex flex-col md:flex-row gap-10">
        {/* Left: Profile Picture */}
        <div className="md:w-1/3 bg-white rounded-2xl flex flex-col justify-between items-center py-10 shadow-2xl">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="relative">
              <label htmlFor="profilePicture">
                <img
                  src={imagePreview || user.profilePicture || "/defaultProfile.png"}
                  alt=""
                  className={`w-40 h-40 rounded-full object-cover mb-4 transition-opacity ${editing ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                />
              </label>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
                disabled={!editing}
              />
            </div>

            <h1 className="font-bold text-2xl">{user.firstName} {user.lastName}</h1>
            <p>{user.role}</p>
          </div>

          <div className="w-[80%]">
            <div className="flex gap-2 items-center">
              <img src="https://img.icons8.com/ios/50/licence.png" width="20" height="20" alt="" />
              <h1>Joined</h1>
              <p>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Right: Tab Content */}
        <div className="md:w-2/3 pt-10 px-10 bg-white rounded-2xl shadow-2xl">
          <div className="mb-4 flex space-x-4">
            <button
              className={`px-4 py-2 rounded ${tab === "info" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setTab("info")}
            >
              Personal Information
            </button>
            <button
              className={`px-4 py-2 rounded ${tab === "password" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setTab("password")}
            >
              Change Password
            </button>
          </div>

          {tab === "info" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["firstName", "lastName", "age", "phone", "email", "username"].map((field) => (
                  <div key={field} className="relative">
                    <label className="block mb-1 font-medium text-gray-700">
                      {fieldLabels[field]}
                    </label>
                    <input
                      name={field}
                      value={(user as any)[field]}
                      onChange={handleChange}
                      className={`w-full border p-2 rounded ${editing ? "bg-white" : "bg-gray-100"}`}
                      readOnly={!editing}
                      placeholder={editing ? fieldLabels[field] : ""}
                    />
                    {formErrors[field] && (
                      <span className="text-red-500 text-sm absolute top-1 right-2">
                        {formErrors[field]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {editing ? (
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={!canSave}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setUser(originalUser);
                      setImagePreview(null);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Edit Profile
                </button>
              )}
            </>
          )}

          {tab === "password" && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <label className="block mb-1 font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswordCurrent ? "text" : "password"}
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswordCurrent(!showPasswordCurrent)}
                  >
                    {showPasswordCurrent ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block mb-1 font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswordNew ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswordNew(!showPasswordNew)}
                  >
                    {showPasswordNew ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {passwordChangeError && (
                <p className="text-red-500 text-sm">{passwordChangeError}</p>
              )}

              <button
                onClick={handlePasswordChange}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
                disabled={!canChangePassword}
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
