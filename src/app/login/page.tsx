/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import Image from "next/image";
// import assets from "@/assets";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { loginUser } from "@/services/actions/loginUser";
// import { storeUserInfo } from "@/services/auth.services";

// import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
// import Navbar from "@/components/shared/Navbar/Navbar";
import { loginSchema } from "@/utils/interface";
import RForm from "../components/Forms/RForm";
import RInput from "../components/Forms/RInput";

export type ValidationSchemaType = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const handelSubmit = async (values: any) => {
    try {
      console.log("response", values);
      // const res = await loginUser(values);

      // if (res?.data?.accessToken) {
      if (values.email == "admin@gmail.com" || values.password == "123456") {
        toast.success("successfully logged in");
        // storeUserInfo({ accessToken: res?.data?.accessToken });
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("res.message");
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* <Navbar /> */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-xl p-8 mx-auto text-center bg-white border border-gray-200 rounded-lg shadow-md">
          <div className="flex flex-col items-center justify-center">
            {/* <Image src={assets.svgs.logo} width={50} height={50} alt="logo" /> */}
            <h1 className="mt-2 text-2xl font-semibold text-gray-800">
              Login User
            </h1>
          </div>

          {error && (
            <div className="mt-4">
              <p className="px-2 py-1 text-sm text-white bg-red-600 rounded-md">
                {error}
              </p>
            </div>
          )}

          <div className="mt-6">
            <RForm
              onSubmit={handelSubmit}
              // resolver={zodResolver(loginSchema)}
            >
              <div className="grid grid-cols-1 gap-4 my-1 md:grid-cols-2 md:gap-6">
                <RInput
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth={true}
                  required={true}
                />
                <RInput
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth={true}
                  required={true}
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 mt-6 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>

              <p className="mt-4 text-sm font-light text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </RForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
