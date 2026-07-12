"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Eye, EyeOff, Truck, Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role"),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        role: data.role,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
        toast.error("Login failed");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#0A0A12] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">TransitOps</h1>
          </div>
          <p className="text-gray-400 text-sm ml-13">Smart Transport Operations Platform</p>
        </div>

        <div className="space-y-6">
          <p className="text-gray-400 text-sm">Only login four roles:</p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              Fleet Manager
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              Dispatcher
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              Safety Officer
            </li>
            <li className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              Financial Analyst
            </li>
          </ul>
        </div>

        <p className="text-gray-500 text-xs">
          TransitOps &copy; 2026 &mdash; Smart Dashboard
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0F0F17]">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">TransitOps</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
            <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 text-sm font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@domain.com"
                className="bg-[#1E1E30] border-[#2A2A3E] text-white placeholder:text-gray-500"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-[#1E1E30] border-[#2A2A3E] text-white placeholder:text-gray-500 pr-10"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-400 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Role</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value ?? "")}
              >
                <SelectTrigger className="bg-[#1E1E30] border-[#2A2A3E] text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E30] border-[#2A2A3E]">
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="FLEET_MANAGER">Fleet Manager</SelectItem>
                  <SelectItem value="DISPATCHER">Dispatcher</SelectItem>
                  <SelectItem value="SAFETY_OFFICER">Safety Officer</SelectItem>
                  <SelectItem value="FINANCIAL_ANALYST">Financial Analyst</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-red-400 text-sm">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-[#1E1E30] text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-orange-500 hover:text-orange-400"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>Access is mapped to user roles:</p>
            <p>Fleet Manager &rarr; Fleet, Maintenance</p>
            <p>Dispatcher &rarr; Trips, Dispatch</p>
            <p>Safety Officer &rarr; Drivers, Compliance</p>
            <p>Financial Analyst &rarr; Fuel &amp; Expenses, Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
