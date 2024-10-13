import { Link, Navigate } from "react-router-dom";
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
import { useUserContext } from "@/context/UserContext";
import { apiClient } from "@/services/api-client";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const { user, setAccessTokenAndUser } = useUserContext();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await apiClient.post("users/register", data);
      setAccessTokenAndUser(response.data.data.accessToken);
      console.log(response.data);
    } catch (err) {
      console.log("Error in onSubmit", err);
    }
  };

  if (user) return <Navigate to={"/"} />;

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Full Name</Label>
                <Input
                  id="first-name"
                  placeholder="John Doe"
                  {...register("name", { required: true })}
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
              />
            </div>
            <Button type="submit" className="w-full">
              Create an account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
