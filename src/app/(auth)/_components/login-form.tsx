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
    <div className="flex min-h-screen bg-[#F0F5FA]">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#1E3A5F] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F] via-[#2A4F7A] to-[#1E3A5F] opacity-80" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-6 h-6 text-[#1E3A5F]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">TransitOps</h1>
              <p className="text-blue-200/80 text-xs tracking-wide mt-0.5">Smart Transport Operations Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-blue-200/60 text-sm uppercase tracking-widest font-medium">One login, four roles:</p>
          <ul className="space-y-5">
            <li className="text-white/90">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="font-semibold text-base">Fleet Manager</span>
              </div>
              <p className="text-blue-200/50 text-sm ml-5.5">Fleet, Maintenance</p>
            </li>
            <li className="text-white/90">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="font-semibold text-base">Dispatcher</span>
              </div>
              <p className="text-blue-200/50 text-sm ml-5.5">Trips, Dispatch</p>
            </li>
            <li className="text-white/90">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="font-semibold text-base">Safety Officer</span>
              </div>
              <p className="text-blue-200/50 text-sm ml-5.5">Drivers, Compliance</p>
            </li>
            <li className="text-white/90">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="font-semibold text-base">Financial Analyst</span>
              </div>
              <p className="text-blue-200/50 text-sm ml-5.5">Fuel &amp; Expenses, Analytics</p>
            </li>
          </ul>
        </div>

        <p className="relative z-10 text-blue-200/40 text-xs">
          TransitOps &copy; 2026 &mdash; Smart Dashboard
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#1E3A5F] rounded-xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">TransitOps</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800">Sign in to your account</h2>
            <p className="text-slate-500 mt-2 text-sm">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-medium">Error</p>
              <p className="text-red-500 text-sm mt-0.5">{error}</p>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@domain.com"
                className="bg-white border-[#E2E8F0] text-slate-700 placeholder:text-slate-400 rounded-xl h-11 focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-white border-[#E2E8F0] text-slate-700 placeholder:text-slate-400 rounded-xl h-11 pr-10 focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 text-sm font-medium">Role</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value ?? "")}
              >
                <SelectTrigger className="bg-white border-[#E2E8F0] text-slate-700 rounded-xl h-11 focus:ring-2 focus:ring-[#F59E0B]/40">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#E2E8F0] shadow-xl rounded-xl">
                  <SelectItem value="ADMIN" className="text-slate-600 rounded-lg">Admin</SelectItem>
                  <SelectItem value="FLEET_MANAGER" className="text-slate-600 rounded-lg">Fleet Manager</SelectItem>
                  <SelectItem value="DISPATCHER" className="text-slate-600 rounded-lg">Dispatcher</SelectItem>
                  <SelectItem value="SAFETY_OFFICER" className="text-slate-600 rounded-lg">Safety Officer</SelectItem>
                  <SelectItem value="FINANCIAL_ANALYST" className="text-slate-600 rounded-lg">Financial Analyst</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E2E8F0] text-[#F59E0B] focus:ring-[#F59E0B]"
                />
                <span className="text-sm text-slate-500">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#F59E0B] hover:text-[#D97706] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold py-2.5 rounded-xl h-12 shadow-md shadow-[#F59E0B]/20 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
