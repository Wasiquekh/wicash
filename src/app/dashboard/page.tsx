"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { axiosInstance } from "@/services/axiosProvider";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FiEye } from "react-icons/fi";

const page = () => {
  const [data, setData] = useState<any[]>([]);
  const [hitApi, setHitApi] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openFacIdMatchPopup, setFaceIdMatchPopup] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // console.log("use state user data", data);

  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        // console.log("✅ API Response:", res.data.data.data);
        setData(res.data.data.data);
      } catch (error) {
        console.log("❌ Fetch users error:", error);
      }
    };

    fetchUsers();
  }, [hitApi]);

  const showPopup = (id: string) => {
    // console.log("status id", id);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want active status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // ✅ Call API here

        try {
          const res = await axiosInstance.post("/update-status", {
            id: id,
            status: "active",
          });
          setHitApi(!hitApi);
          //   Swal.fire({
          //     icon: "success",
          //     title: "Updated!",
          //     text: "Status updated successfully.",
          //   });
          toast.success("Status updated successfully.");
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Something went wrong while updating.",
          });
        }
      } else {
        // ❌ NO pressed → do nothing, close popup
        Swal.close();
      }
    });
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.clear();
      toast.success("Logout successful!");
      router.push("/");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };
  const liveNessPhotoAndScore = (livenessImage: any) => {
    setSelectedImage(livenessImage);
    setOpen(true);
  };
  const idCard = (idCard: any) => {
    setSelectedImage(idCard);
    setOpen(true);
  };
  const faceIdMatch = (p0: any[]) => {
    console.log("HHHHHHHHHH", p0);
    setFaceIdMatchPopup(true);
  };

  return (
    <div>
      <main className="min-h-screen w-full  bg-white">
        {/* Header */}
        <Header />
        {/* Table container */}
        <div className="w-full mx-auto  bg-white py-4 px-8">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-semibold">Users List</h2>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr className="text-left border-b border-gray-300">
                  <th className="py-3 px-4 font-medium">Name</th>
                  <th className="py-3 px-4 font-medium">Phone Number</th>
                  <th className="py-3 px-4 font-medium">
                    Liveness Photo & Score
                  </th>
                  <th className="py-3 px-4 font-medium">ID Card</th>
                  <th className="py-3 px-4 font-medium">
                    Face–ID Match (Liveness %)
                  </th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, index) => {
                    return (
                      <tr key={index} className="border-b border-gray-200">
                        {/* Name */}
                        <td className="py-3 px-4">{item?.name || "-"}</td>

                        {/* Phone Number */}
                        <td className="py-3 px-4">
                          {item?.phone_number || item?.phone || "-"}
                        </td>

                        {/* ✅ Liveness Photo & Score */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                liveNessPhotoAndScore(item?.livenessPhoto)
                              }
                              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300"
                            >
                              View Image
                            </button>

                            <span className="text-sm font-medium text-gray-800">
                              {item?.livenessScore
                                ? `${item?.livenessScore}%`
                                : "0%"}
                            </span>
                          </div>
                        </td>

                        {/* ✅ ID Card */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => idCard(item?.idCardPhoto)}
                            className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300"
                          >
                            View ID Card
                          </button>
                        </td>

                        {/* ✅ Face–ID Match (Liveness %) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                faceIdMatch([
                                  item?.livenessPhoto || "/images/no-image.png",
                                  item?.idCardPhoto || "/images/no-idcard.png",
                                ])
                              }
                              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300"
                            >
                              View Face ID Match Score
                            </button>

                            <span className="text-sm font-medium text-gray-800">
                              {item?.faceIdMatchScore
                                ? `${item?.faceIdMatchScore}%`
                                : "0%"}
                            </span>
                          </div>
                        </td>

                        {/* ✅ Status */}
                        <td
                          className={`py-3 px-4 font-medium ${
                            item?.status === "active"
                              ? "text-green-600"
                              : item?.status === "pending"
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        >
                          {item?.status || "-"}
                        </td>

                        {/* ✅ Action */}
                        <td className="py-3 px-4">
                          <button
                            disabled={item?.status === "active"}
                            onClick={() => showPopup(item?.id)}
                            className="px-3 py-1.5 rounded-md bg-black text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Change
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      className="py-4 px-4 text-center text-gray-500"
                      colSpan={7}
                    >
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ------------------------------ */}
      {/* ✅ Popup / Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 "
          onClick={() => setOpen(false)}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg relative w-96 text-center">
            <h2 className="text-lg font-semibold mb-3">Preview</h2>

            {/* ✅ Show no-image fallback */}
            <img
              src={selectedImage || "no-image.png"}
              alt="No data"
              className="w-80 h-80 object-cover rounded border mx-auto"
            />

            {/* ✅ Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------- */}

      {/* ------------------------------ */}
      {/* FACE ID MATCHING POPUP */}
      {openFacIdMatchPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setFaceIdMatchPopup(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative w-[80%] max-w-4xl"
            onClick={(e) => e.stopPropagation()} // prevent closing on inside click
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Face & ID Match Preview
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* ✅ Face Image */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/no-image.png"
                  alt="Face"
                  className="w-64 h-64 object-cover rounded border"
                />
                <p className="mt-2 text-sm font-medium text-gray-700">Selfie</p>
              </div>

              {/* ✅ ID Card Image */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/no-idcard.png"
                  alt="ID Card"
                  className="w-64 h-64 object-cover rounded border"
                />
                <p className="mt-2 text-sm font-medium text-gray-700">
                  ID Card
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setFaceIdMatchPopup(false)}
                className="mt-6 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------- */}
    </div>
  );
};

export default page;
