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
import { Eye, EyeOff, Zap, Loader2, ArrowRight, Shield, Truck, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Please select a role"),
});

type LoginInput = z.infer<typeof loginSchema>;

const roles = [
  { value: "ADMIN", label: "Admin", icon: Shield, desc: "Full access" },
  { value: "FLEET_MANAGER", label: "Fleet Manager", icon: Truck, desc: "Fleet & Maintenance" },
  { value: "DISPATCHER", label: "Dispatcher", icon: Users, desc: "Trips & Dispatch" },
  { value: "SAFETY_OFFICER", label: "Safety Officer", icon: Shield, desc: "Drivers & Compliance" },
  { value: "FINANCIAL_ANALYST", label: "Financial Analyst", icon: BarChart3, desc: "Fuel & Analytics" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const floatingOrb = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

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
      email: "" as string,
      password: "" as string,
      role: "" as string,
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
    <div className="flex min-h-screen bg-mesh">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-mesh opacity-50" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          suppressHydrationWarning
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          suppressHydrationWarning
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          suppressHydrationWarning
        />

        {/* Content */}
        <div className="relative z-10 p-12 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            suppressHydrationWarning
          >
            <div className="flex items-center gap-4 mb-8">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Zap className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">TransitOps</h1>
                <p className="text-emerald-400/80 text-sm tracking-wide mt-1">Smart Transport Operations Platform</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="text-slate-400 text-lg leading-relaxed mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            suppressHydrationWarning
          >
            Manage your fleet, dispatch trips, track maintenance, and analyze expenses — all in one place.
          </motion.p>

          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            suppressHydrationWarning
          >
            {roles.map((role, i) => (
              <motion.div
                key={role.value}
                variants={itemVariants}
                whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                suppressHydrationWarning
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <role.icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </motion.div>
                <div>
                  <p className="text-white font-medium">{role.label}</p>
                  <p className="text-slate-500 text-sm">{role.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          suppressHydrationWarning
        >
          {/* Mobile Logo */}
          <motion.div
            className="lg:hidden flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            suppressHydrationWarning
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">TransitOps</h1>
          </motion.div>

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            suppressHydrationWarning
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Sign in to your account to continue</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4"
              suppressHydrationWarning
            >
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            suppressHydrationWarning
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Email
              </Label>
              <motion.div whileFocus={{ scale: 1.01 }} suppressHydrationWarning>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@transitops.com"
                  className="bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-12 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 transition-all"
                  {...form.register("email")}
                />
              </motion.div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl h-12 pr-12 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 transition-all"
                  {...form.register("password")}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 dark:text-slate-400 text-sm font-medium">Role</Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value ?? "")}
              >
                <SelectTrigger className="bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 text-slate-700 dark:text-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-emerald-500/30 transition-all">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400">
                      {role.label}
                    </SelectItem>
                  ))}
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
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500/30"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">Remember me</span>
              </label>
              <motion.button
                type="button"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                whileHover={{ x: 2 }}
              >
                Forgot password?
              </motion.button>
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl h-13 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 group cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div
            className="p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-slate-500 dark:text-slate-500 text-center">
              Demo: <span className="font-medium text-slate-600 dark:text-slate-400">admin@transitops.com</span> / <span className="font-medium text-slate-600 dark:text-slate-400">admin123</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
