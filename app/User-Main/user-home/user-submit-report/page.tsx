"use client"


import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function UserSubmitReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [verified,] = useState("Verified");
  const [status, ] = useState("Active");
  const [severity, setSeverity] = useState(""); // Added severity state
  const [uploading, ] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(e.type === "dragover" || e.type === "dragenter");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageBase64 = "";
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject("Failed to read image");
          reader.readAsDataURL(image);
        });
      }

      const formData = {
        title,
        description,
        category,
        area,
        location,
        verified,
        status,
        severity, // Added severity to the form data
        image: imageBase64,
      };

      const response = await fetch("/api/submit-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Report submitted successfully!");
        setTitle("");
        setDescription("");
        setCategory("");
        setArea("");
        setLocation("");
        setSeverity(""); // Reset severity
        setImage(null);
        setPreview(null);
        router.push("/success");
      } else {
        const result = await response.json();
        alert(result?.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[90%] min-h-screen mx-auto flex shadow-2xl rounded-2xl pb-[2em]">
      <div className="container mx-auto pb-4 w-[90%]">
        <div className="title-holder border-b border-gray-300 mb-5">
          <h1 className="text-3xl py-10 font-bold text-gray-800">Submit Report</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 ">

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Report Title"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Report Description"
            required
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
          <div
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition border-gray-300 ${dragActive ? "border-blue-500 bg-gray-50" : ""
              }`}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            <div className="mb-3 text-gray-500">
              <svg
                className="mx-auto mb-2 w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0a4 4 0 014-4h4a4 4 0 014 4v12m-4 4v-4m0 0H9m6 0h-3"
                />
              </svg>
              <p className="text-sm text-gray-600">
                Drag & Drop your image here, or click to select
              </p>
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {preview && (
              <div className="mt-4 flex justify-center ">
                <img src={preview} alt="Preview" className="w-full h-32 object-cover blur-[2px] opacity-[.6]" />
              </div>
            )}
          </div>
          <div className="flex gap-5">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded cursor-pointer"
            >
              <option value="" disabled>Select Type </option>
              <option disabled>— Environmental Reports —</option>
              <option>Pollution Incident</option>
              <option>Garbage and Waste Issue</option>
              <option>Deforestation or Tree Cutting</option>
              <option>Wildlife Disturbance</option>
              <option>Flooding or Drainage Problem</option>
              <option>Public Hazard</option>
              <option disabled>— Other Reports —</option>
              <option>Emergency</option>
              <option>Suspicious Activity</option>
              <option>General Incident Report</option>
            </select>


            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded cursor-pointer"
            >
              <option value="" disabled>Select Area</option>
            <option value="Purok 1">Purok 1</option>
            <option value="Purok 2">Purok 2</option>
            <option value="Purok 3">Purok 3</option>
            <option value="Purok 4">Purok 4</option>
            <option value="Purok 5">Purok 5</option>
            <option value="Purok 6">Purok 6</option>
            <option value="Purok 7">Purok 7</option>
            <option value="Sitio Veterans (New Veterans Village)">Sitio Veterans (New Veterans Village)</option>
            <option value="Sitio Pugot">Sitio Pugot</option>
            <option value="Sitio Kumunoy - Area A">Sitio Kumunoy - Area A</option>
            <option value="Sitio Kumunoy - Area B">Sitio Kumunoy - Area B</option>
            <option value="Sitio Kumunoy - Area C">Sitio Kumunoy - Area C</option>
            <option value="Sitio Bakal">Sitio Bakal</option>
            <option value="Sitio Rolling Hills (Purok 7)">Sitio Rolling Hills (Purok 7)</option>
            <option value="Bona Subdivision">Bona Subdivision</option>
            <option value="Violago Homes">Violago Homes</option>
            <option value="Filinvest 2">Filinvest 2</option>
            <option value="Filinvest Heights">Filinvest Heights</option>
            <option value="Spring Country">Spring Country</option>
            <option value="Spring Heights I and II">Spring Heights I and II</option>
            <option value="Spring Valley">Spring Valley</option>
            <option value="Mountain View Subdivision">Mountain View Subdivision</option>
            <option value="Parkwood Hills Violago Homes Subdivision">Parkwood Hills Violago Homes Subdivision</option>
            <option value="Winn Residences">Winn Residences</option>
            <option value="Meadows Residences">Meadows Residences</option>
            <option value="Tagumpay HOA">Tagumpay HOA</option>
            <option value="Humanity Village">Humanity Village</option>
            <option value="Country Homes (Paltok)">Country Homes (Paltok)</option>
            <option value="D&A Vicente Village">D&A Vicente Village</option>
            <option value="Covenant Village">Covenant Village</option>
            <option value="Clemencia Village">Clemencia Village</option>
            <option value="Sulyap ng Pag-asa Village">Sulyap ng Pag-asa Village</option>
            <option value="Sunrise View">Sunrise View</option>
            <option value="Diamond Ville">Diamond Ville</option>
            <option value="Sipna (Sitio Palay Neighborhood Association)">Sipna (Sitio Palay Neighborhood Association)</option>
            <option value="Sumama-Ka (Gulpo)">Sumama-Ka (Gulpo)</option>
            <option value="Bakas">Bakas</option>
            <option value="Sulyap ng Pag-asa Housing">Sulyap ng Pag-asa Housing</option>
            <option value="Dino Compound">Dino Compound</option>
            <option value="Filside">Filside</option>
            <option value="San Policarpio">San Policarpio</option>
            <option value="Comia">Comia</option>
            <option value="Jubilee Phase 1 - 8">Jubilee Phase 1 - 8</option>
            <option value="Isla Pulang Bato">Isla Pulang Bato</option>
            <option value="Mt. Carmel">Mt. Carmel</option>
            <option value="Mapayapa">Mapayapa</option>
            <option value="Brookside">Brookside</option>
            <option value="Hilltop">Hilltop</option>
            <option value="Calamiong">Calamiong</option>
            <option value="Pinagbuklod">Pinagbuklod</option>
            <option value="Tumana">Tumana</option>
            <option value="New Greenland">New Greenland</option>
            </select>
          </div>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Address"
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded cursor-pointer"
          >
            <option value="" disabled>Select Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Information">Informant</option>
            <option value="Trivial">Trivial</option>
          </select>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-[#F3775C] cursor-pointer text-white px-4 py-2 rounded hover:bg-[#f36b5c] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
