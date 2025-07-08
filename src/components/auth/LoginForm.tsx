
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const phoneSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits."),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    // This effect sets up the reCAPTCHA verifier, which is required for phone auth.
    // It's invisible and attaches to the div with id 'recaptcha-container' in the root layout.
    // We only create it once and attach it to the window object to avoid re-creations on re-renders.
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        "size": "invisible",
        "callback": () => { /* reCAPTCHA solved */ }
      });
    }
  }, []);

  async function onSendOtp(values: z.infer<typeof phoneSchema>) {
    setIsSubmitting(true);
    try {
      const verifier = window.recaptchaVerifier;
      const phoneNumber = `+91${values.phone}`;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      toast({ title: "OTP Sent", description: `An OTP has been sent to ${phoneNumber}.` });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      let description = "Please check the phone number or try again. Ensure it's added as a test number in your Firebase project.";
      if (error.code === 'auth/captcha-check-failed') {
        description = "reCAPTCHA check failed. Please authorize your domain in Firebase: Authentication -> Settings -> Authorized domains. Add 'localhost' for development.";
      }
      toast({ 
        variant: "destructive", 
        title: "Failed to send OTP", 
        description: description
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onVerifyOtp(values: z.infer<typeof otpSchema>) {
    if (!confirmationResult) return;
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(values.otp);
      toast({ title: "Login Successful!", description: "Redirecting to admin dashboard..." });
      router.push("/admin");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({ variant: "destructive", title: "Invalid OTP", description: "The OTP you entered is incorrect. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmationResult) {
    return (
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-6">
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...phoneForm}>
      <form onSubmit={phoneForm.handleSubmit(onSendOtp)} className="space-y-6">
        <FormField
          control={phoneForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-muted-foreground sm:text-sm">+91</span>
                  </div>
                  <Input 
                    type="tel"
                    placeholder="9876543210" 
                    className="pl-12"
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send OTP
        </Button>
      </form>
    </Form>
  );
}

// Extend window type for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
