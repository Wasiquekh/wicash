"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { axiosInstance } from "@/services/axiosProvider";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const page = () => {
  const [data, setData] = useState<any[]>([]);
  const [hitApi, setHitApi] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openFacIdMatchPopup, setFaceIdMatchPopup] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [livenessUrl, setLivenessUrl] = useState<string | null>(null);
  const [livenessScore, setLivenessScore] = useState<string | null>(null);
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [faceMatchScore, setFaceMatchScore] = useState<string | null>(null);
  const [one, setOne] = useState<boolean>(false);
  const [two, setTwo] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // console.log(
  //   "ggggggggggg",
  //   livenessUrl,
  //   livenessScore,
  //   cardUrl,
  //   faceMatchScore
  // );

  // console.log("use state user data", data);

  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`/users?page=${page}`);
        //  console.log("✅ API Response:", res.data.data.totalPages);
        setData(res.data.data.data);
        setPage(res.data.data.page);
        setTotalPages(res.data.data.totalPages);
      } catch (error) {
        console.log("❌ Fetch users error:", error);
      }
    };

    fetchUsers();
  }, [hitApi, page]);

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
  const liveNessPhotoAndScore = async (phone: any) => {
    setOne(true);
    setTwo(false);
    try {
      const res = await axiosInstance.get(`/get-photo?phone=${phone}`);
      //  console.log("✅ API Response:", res.data.data.user.facematch_score);
      setLivenessUrl(res.data.data.photos.liveness_url);
      setCardUrl("");
      //setFaceMatchScore(res.data.data.user.facematch_score);
      setLivenessScore(res.data.data.user.liveness_score);
      //  setData(res.data.data.data);
    } catch (error) {
      console.log("❌ Fetch users error:", error);
    }

    setSelectedImage("");
    setOpen(true);
  };
  const idCard = async (phone: any) => {
    setOne(false);
    setTwo(true);
    try {
      const res = await axiosInstance.get(`/get-photo?phone=${phone}`);
      // console.log("✅ API Response:", res.data.data.user.facematch_score);
      setLivenessUrl("");
      setCardUrl(res.data.data.photos.card_url);
      // setFaceMatchScore(res.data.data.user.facematch_score);
      setLivenessScore("");
      //  setData(res.data.data.data);
    } catch (error) {
      console.log("❌ Fetch users error:", error);
    }
    setSelectedImage("");
    setOpen(true);
  };
  const faceIdMatch = async (phone: any) => {
    try {
      const res = await axiosInstance.get(`/get-photo?phone=${phone}`);
      // console.log("✅ API Response:", res.data.data.user.facematch_score);
      setLivenessUrl(res.data.data.photos.liveness_url);
      setCardUrl(res.data.data.photos.card_url);
      setFaceMatchScore(res.data.data.user.facematch_score);
      // setLivenessScore("");
      //  setData(res.data.data.data);
    } catch (error) {
      console.log("❌ Fetch users error:", error);
    }
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
                          {item?.phone_number || "-"}
                        </td>

                        {/* ✅ Liveness Photo & Score */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                liveNessPhotoAndScore(item.phone_number)
                              }
                              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300"
                            >
                              View Image
                            </button>
                          </div>
                        </td>

                        {/* ✅ ID Card */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => idCard(item.phone_number)}
                            className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300"
                          >
                            View ID Card
                          </button>
                        </td>

                        {/* ✅ Face–ID Match (Liveness %) */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => faceIdMatch(item.phone_number)}
                              className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs border border-gray-300"
                            >
                              View Face ID Match Score
                            </button>
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
          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {/* Previous */}
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className={`w-10 h-10 flex items-center justify-center rounded bg-black cursor-pointer disabled:bg-gray-400  disabled:cursor-not-allowed`}
            >
              <FiChevronLeft className="text-white" size={20} />
            </button>

            <span className="font-medium text-sm">
              Page {page} of {totalPages}
            </span>

            {/* Next */}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className={`w-10 h-10 flex items-center justify-center rounded bg-black cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              <FiChevronRight className="text-white" size={20} />
            </button>
          </div>
          {/* END PAGINATION */}
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
            {one && (
              <Image
                src={livenessUrl || "/images/no-image.png"}
                alt="Liveness"
                width={300}
                height={300}
                className="object-cover rounded border mx-auto h-[30]"
                unoptimized
              />
            )}
            {two && (
              <Image
                src={cardUrl || "/images/no-image.png"}
                alt="Card"
                width={300}
                height={300}
                className="object-cover rounded border mx-auto h-[400px]"
                unoptimized
              />
            )}

            {livenessScore && (
              <p className="text-center mt-3 font-semibold">
                Liveness Score: {Number(livenessScore).toFixed(2)}%
              </p>
            )}
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

            <div className="flex flex-col items-center gap-4">
              {/* Images row */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                {/* Selfie (Liveness) */}
                <div className="flex flex-col items-center">
                  <img
                    src={livenessUrl ?? "/images/no-image.png"}
                    alt="Selfie (Liveness)"
                    className="w-64 h-64 object-cover rounded border"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Selfie
                  </p>
                </div>

                {/* ID Card */}
                <div className="flex flex-col items-center">
                  <img
                    src={cardUrl ?? "/images/no-idcard.png"}
                    alt="ID Card"
                    className="w-64 h-64 object-cover rounded border"
                  />
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    ID Card
                  </p>
                </div>
              </div>

              {/* Only Face Match Score */}
              <p className="text-sm font-semibold text-green-700">
                {faceMatchScore
                  ? `Face Match: ${faceMatchScore}%`
                  : "Face Match: 0"}
              </p>
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
