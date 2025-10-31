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
      <main className="min-h-screen bg-white">
        {/* Header */}
        <Header />
        {/* Table container */}
        <div className="max-w-5xl mx-auto mt-10 bg-white">
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
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {data && data.length > 0 ? (
                  data.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4">{item.name || "-"}</td>
                      <td className="py-3 px-4">{item.phone_number || "-"}</td>
                      <td
                        className={`py-3 px-4 font-medium ${
                          item.status === "active"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {item.status || "-"}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          disabled={item.status === "active"}
                          onClick={() => showPopup(item.id)}
                          className="px-3 py-1 rounded-md bg-black text-white text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Change
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="py-4 px-4 text-center text-gray-500"
                      colSpan={4}
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
    </div>
  );
};

export default page;
