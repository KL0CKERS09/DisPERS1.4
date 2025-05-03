"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function AnonymousReport() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [status] = useState("Active");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageBase64(result);
        setPreview(result);
      };
      reader.readAsDataURL(file); // converts to base64 string
    }
  };

  const handlePreviewClick = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        type,
        location,
        email,
        status,
        image: imageBase64 ?? "",
      };

      const response = await fetch("/api/anonymous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Report submitted successfully!");
        setTitle("");
        setDescription("");
        setType("");
        setLocation("");
        setEmail("");
        setImageBase64(null);
        setPreview(null);
        router.push("/");
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow my-10">
      <h1 className="text-2xl font-bold text-orange-500 mb-2">ANONYMOUS REPORT</h1>
      <p className="text-sm text-gray-600 mb-6">
        Please note: Reports submitted anonymously will not receive a Trust Badge. To ensure the credibility and effectiveness of your report, we highly encourage you to include at least an email address and related images as supporting evidence.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Report Title *</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Report Type *</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          >
            <option value="" disabled>— Select Type —</option>
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
        </div>

        <div>
          <label className="block font-medium">Description *</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
            required
          />
        </div>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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

        <div>
          <label className="block font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Upload Image</label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <div
              className="w-full h-48 bg-cover bg-center rounded-lg cursor-pointer"
              style={{ backgroundImage: `url(${preview})` }}
              onClick={handlePreviewClick}
            />
          ) : (
            <button
              type="button"
              onClick={handlePreviewClick}
              className="w-full border rounded p-2 text-gray-600"
            >
              Click to select an image
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
