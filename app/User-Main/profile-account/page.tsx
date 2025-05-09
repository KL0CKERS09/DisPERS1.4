"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "@/app/loading";

type UserProfile = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
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
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<"info" | "password">("info");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordChangeError, setPasswordChangeError] = useState("");

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
    const { name, value } = e.target;

    if ((name === "phone" || name === "age") && !/^\d*$/.test(value)) return;
    setUser({ ...user, [name]: name === "age" ? Number(value) : value });
  };

  const handleSave = async () => {
    if (user && validateForm()) {
      setSubmitting(true);
      try {
        await axios.put("/api/profile", user);

        if (imagePreview && imagePreview !== originalUser?.profilePicture) {
          await axios.post("/api/profile/picture", {
            profilePicture: imagePreview,
          });
        }

        setOriginalUser(user);
        setEditing(false);
      } catch (error) {
        console.error("Save failed:", error);
      } finally {
        setSubmitting(false);
      }
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
    middleName: "Middle Name",
    lastName: "Last Name",
    suffix: "Suffix",
    age: "Age",
    phone: "Phone Number",
    email: "Email",
    username: "Username",
  };

  const hasUserChanges = JSON.stringify(user) !== JSON.stringify(originalUser);
  const canSave = editing && hasUserChanges;
  const canChangePassword = currentPassword && newPassword && confirmPassword && newPassword === confirmPassword;
  
    if (!user) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto min-h-[100vh] p-6 rounded-xl flex flex-col items-start justify-center">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="w-full min-h-[70vh] flex flex-col md:flex-row gap-10">
        <div className="md:w-1/3 bg-white rounded-2xl flex flex-col justify-between items-center py-10 shadow-2xl">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="relative">
              <label htmlFor="profilePicture">
                <img
                  src={imagePreview || user.profilePicture || "/defaultProfile.png"}
                  alt=""
                  className={`w-40 h-40 rounded-full object-cover mb-4 transition-opacity opacity-[0.8] ${editing ? "cursor-pointer opacity-[1] hover:opacity-80" : "cursor-default"}`}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {["firstName", "middleName", "lastName", "suffix", "age", "phone", "email", "username"].map((field) => (
                  <div key={field} className="relative">
                    <label className="block mb-1 font-medium text-gray-700">
                      {fieldLabels[field]}
                    </label>
                    <input
                      name={field}
                      value={(user as any)[field] || ""}
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
                    disabled={!canSave || submitting}
                  >
                    {submitting ? "Submitting..." : "Save Changes"}
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
              {[{
                label: "Current Password",
                value: currentPassword,
                setValue: setCurrentPassword,
                show: showPasswordCurrent,
                toggleShow: () => setShowPasswordCurrent(!showPasswordCurrent),
              }, {
                label: "New Password",
                value: newPassword,
                setValue: setNewPassword,
                show: showPasswordNew,
                toggleShow: () => setShowPasswordNew(!showPasswordNew),
              }, {
                label: "Confirm Password",
                value: confirmPassword,
                setValue: setConfirmPassword,
                show: showPasswordConfirm,
                toggleShow: () => setShowPasswordConfirm(!showPasswordConfirm),
              }].map(({ label, value, setValue, show, toggleShow }, i) => (
                <div key={i} className="relative">
                  <label className="block mb-1 font-medium text-gray-700">{label}</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full border p-2 rounded"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={toggleShow}
                    >
                      {show ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              ))}

              {passwordChangeError && (
                <p className="text-red-500 text-sm">{passwordChangeError}</p>
              )}

              <button
                onClick={async () => {
                  if (newPassword !== confirmPassword) {
                    setPasswordChangeError("Passwords do not match.");
                    return;
                  }

                  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
                  if (!passwordRegex.test(newPassword)) {
                    setPasswordChangeError("New password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
                    return;
                  }

                  try {
                    const passwordCheck = await axios.post("/api/profile/password", { currentPassword });
                    if (!passwordCheck.data.isValid) {
                      setPasswordChangeError("Current password is incorrect.");
                      return;
                    }
                  } catch {
                    setPasswordChangeError("Error verifying current password. Please try again.");
                    return;
                  }

                  try {
                    await axios.put("/api/profile/password", { currentPassword, newPassword });
                    setPasswordChangeError("Password changed successfully!");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  } catch {
                    setPasswordChangeError("Error changing password. Please try again.");
                  }
                }}
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
