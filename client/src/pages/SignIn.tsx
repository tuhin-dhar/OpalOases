import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { useNavigate, Link, useLocation } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

export default function Signin() {
  const {
    register,

    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "User succesfully logged in", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-9">
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label htmlFor="email" className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label
        htmlFor="password"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("password", { required: "This is field is required" })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Do not have an account?
          <Link className="underline hover:text-bg-500" to={"/register"}>
            Click here
          </Link>
        </span>
        <button
          type="submit"
          className="bg-custom border rounded text-white p-2 font-bold hover:bg-custom-light text-xl "
        >
          Sign In
        </button>
      </span>
    </form>
  );
}
