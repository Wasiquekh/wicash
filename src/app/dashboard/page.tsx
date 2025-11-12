"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { axiosInstance } from "@/services/axiosProvider";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const page = () => {
  const [data, setData] = useState<any[]>([]);
  const [hitApi, setHitApi] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
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
                      // --- Fallback image paths ---
                      const NO_IMAGE = "/images/no-image.jpg";
                      const NO_IDCARD = "/images/no-idcard.png";

                      // --- Liveness (selfie) fields with common aliases ---
                      const livenessPhoto =
                        item?.livenessPhoto ||
                        item?.liveness_photo ||
                        item?.selfieUrl ||
                        item?.selfie_url ||
                        item?.face_photo ||
                        item?.facePhoto ||
                        null;

                      const livenessScoreRaw =
                        item?.livenessScore ??
                        item?.liveness_score ??
                        item?.liveness ??
                        null;

                      const livenessScore =
                        typeof livenessScoreRaw === "number"
                          ? livenessScoreRaw
                          : Number(livenessScoreRaw || 0);

                      // --- ID card fields (prefer front if you have both) ---
                      const idCardPhoto =
                        item?.idCardPhoto ||
                        item?.id_card_photo ||
                        item?.idFrontUrl ||
                        item?.id_front_url ||
                        item?.id_photo ||
                        null;

                      // --- Face–ID Match (combined) ---
                      const faceIdMatchPhotoFace = livenessPhoto || null; // use selfie
                      const faceIdMatchPhotoId = idCardPhoto || null; // use id card
                      const faceIdMatchScoreRaw =
                        item?.faceIdMatchScore ??
                        item?.face_id_match_score ??
                        item?.faceMatchScore ??
                        item?.face_match_score ??
                        null;

                      const faceIdMatchScore =
                        typeof faceIdMatchScoreRaw === "number"
                          ? faceIdMatchScoreRaw
                          : Number(faceIdMatchScoreRaw || 0);

                      return (
                        <tr key={index} className="border-b border-gray-200">
                          {/* Name */}
                          <td className="py-3 px-4">{item?.name || "-"}</td>

                          {/* Phone Number */}
                          <td className="py-3 px-4">
                            {item?.phone_number || item?.phone || "-"}
                          </td>

                          {/* Liveness Photo & Score */}
                          <td
                            onClick={() => setOpen(true)}
                            className="py-3 px-4"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={livenessPhoto || NO_IMAGE}
                                alt="Liveness"
                                className="h-12 w-12 rounded object-cover border border-gray-200"
                              />
                              <span className="text-sm font-medium">
                                {isNaN(livenessScore) ? 0 : livenessScore}%
                              </span>
                            </div>
                          </td>

                          {/* ID Card */}
                          <td
                            onClick={() => setOpen(true)}
                            className="py-3 px-4"
                          >
                            <img
                              src={idCardPhoto || NO_IDCARD}
                              alt="ID Card"
                              className="h-12 w-20 rounded object-cover border border-gray-200"
                            />
                          </td>

                          {/* Face–ID Match (Liveness %) */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={faceIdMatchPhotoFace || NO_IMAGE}
                                alt="Face"
                                className="h-10 w-10 rounded object-cover border border-gray-200"
                              />
                              <img
                                src={faceIdMatchPhotoId || NO_IDCARD}
                                alt="ID"
                                className="h-10 w-16 rounded object-cover border border-gray-200"
                              />
                              <span className="text-sm font-semibold">
                                {isNaN(faceIdMatchScore) ? 0 : faceIdMatchScore}
                                %
                              </span>
                            </div>
                          </td>

                          {/* Status */}
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

                          {/* Action */}
                          <td className="py-3 px-4">
                            <button
                              disabled={item?.status === "active"}
                              onClick={() => showPopup(item?.id)}
                              className="px-3 py-1 rounded-md bg-black text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg relative w-96 text-center">
              <h2 className="text-lg font-semibold mb-3">Preview</h2>

              {/* ✅ Show no-image fallback */}
              <img
                src="/images/no-image.jpg"
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
      </div>
    );
};

export default page;
