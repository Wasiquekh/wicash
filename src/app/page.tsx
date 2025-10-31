"use client";
import Image from "next/image";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/services/axiosProvider";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const LoginSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
  });

  return (
    <>
      <main className="min-h-screen grid place-items-center bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
          {/* Formik Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const res = await axiosInstance.post("/login", {
                  email: values.email,
                  password: values.password,
                });
                localStorage.setItem("token", res.data.data.token);
                toast.success("Login successful");
                router.push("/dashboard");
              } catch (error: any) {
                console.log(error);
                toast.error("Invalid credentials");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, isValid, touched }) => (
              <Form className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-gray-900"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Password (with show/hide) */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 outline-none focus:border-gray-900 pr-16"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute inset-y-0 right-3 text-sm text-gray-500"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (Object.keys(touched).length > 0 && !isValid)
                  }
                  className="w-full rounded-xl px-4 py-2.5 font-semibold bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>

                {/* Footer text */}
                <p className="text-center text-xs text-gray-500">
                  © {new Date().getFullYear()} Wi Cash CRM
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
}
