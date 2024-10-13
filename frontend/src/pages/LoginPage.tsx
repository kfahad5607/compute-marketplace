import { Link, Navigate, useLocation } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/services/api-client";
import { useUserContext } from "@/context/UserContext";

type Inputs = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { state } = useLocation();
  const { register, handleSubmit } = useForm<Inputs>();
  const { user, setAccessTokenAndUser } = useUserContext();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log("data ", data);
      const response = await apiClient.post("users/login", data);

      setAccessTokenAndUser(response.data.data.accessToken);
    } catch (err) {
      console.log("Error in onSubmit", err);
    }
  };

  if (user) return <Navigate to={state?.prevUrl || "/"} />;

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                {...register("email", { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
