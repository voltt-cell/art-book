"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  shopName: z.string().optional(),
  role: z.enum(["buyer", "seller"], {
    required_error: "Please select a role.",
  }),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions.",
  }),
}).refine((data) => {
  if (data.role === 'seller' && (!data.shopName || data.shopName.length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Shop Name is required for sellers (min 2 chars).",
  path: ["shopName"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      shopName: "",
      role: "buyer",
      terms: false,
    },
  });

  async function onSubmit(values: SignupFormValues) {
    try {
      const role = values.role === "seller" ? "artist" : "buyer";
      await signup({
        email: values.email,
        password: values.password,
        name: values.name,
        shopName: role === "artist" ? values.shopName : undefined,
        role,
      });

      toast.success("Account created successfully!", {
        description: `Welcome to ArtBook! You've joined as a ${values.role}.`,
      });

      if (role === "artist") {
        router.push("/artist/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error("Signup failed", {
        description: (error as Error).message,
      });
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(26,31,44,0.8)] to-[rgba(26,31,44,0.4)]" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <h1 className="text-4xl font-serif font-bold text-white mb-6">
            Join our community of artists and collectors
          </h1>
          <p className="text-lg text-gray-200 mb-8">
            Discover extraordinary art, connect with creators, and build your
            collection.
          </p>
          <div className="flex space-x-2">
            <div className="w-12 h-1 bg-purple-500 rounded-full"></div>
            <div className="w-2 h-1 bg-white/50 rounded-full"></div>
            <div className="w-2 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Create your account
            </h2>
            <p className="text-gray-600 mt-2">
              Start your artistic journey with us
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("role") === "seller" && (
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shop Name <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your unique shop name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I want to join as</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="buyer" id="buyer" />
                          <label
                            htmlFor="buyer"
                            className="w-full cursor-pointer font-medium"
                          >
                            Art Buyer/Collector
                            <p className="text-sm font-normal text-gray-600">
                              I want to explore and collect artwork
                            </p>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-slate-50 transition-colors">
                          <RadioGroupItem value="seller" id="seller" />
                          <label
                            htmlFor="seller"
                            className="w-full cursor-pointer font-medium"
                          >
                            Artist/Seller
                            <p className="text-sm font-normal text-gray-600">
                              I want to showcase and sell my artwork
                            </p>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="font-medium text-purple-600 underline"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="font-medium text-purple-600 underline"
                        >
                          privacy policy
                        </Link>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
              >
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
