
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Schema for the phone number input
const phoneSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
});

// Schema for the single OTP input field
const otpSchema = z.object({
  otp_code: z.string().min(6, "OTP must be 6 digits.").max(6, "OTP must be 6 digits."),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for the phone number
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  // Form for the OTP
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp_code: "" },
  });

  // Initialize reCAPTCHA verifier
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        "size": "invisible",
        "callback": () => { /* reCAPTCHA solved */ }
      });
    }
  }, []);
  
  // This useEffect will run when the OTP form is about to be displayed.
  // It resets the form to clear any previous values or browser autofills.
  useEffect(() => {
    if (confirmationResult) {
      otpForm.reset({ otp_code: "" });
    }
  }, [confirmationResult, otpForm]);

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
      let title = "Failed to Send OTP";
      let description = "An unknown error occurred. Please try again.";

      if (error.code === 'auth/captcha-check-failed') {
        title = "Configuration Error: Domain Not Authorized";
        description = `This is a Firebase security setting. Your app's domain must be authorized. Go to your Firebase Console -> Authentication -> Settings -> Authorized domains, and add this domain: ${window.location.hostname}`;
      } else if (error.code === 'auth/too-many-requests') {
        title = "Too Many Attempts";
        description = "You have requested an OTP too many times. Please wait a few minutes before trying again.";
      } else {
         description = `Please check the phone number or try again. For testing, ensure it's added as a test number in your Firebase project. Error: ${error.code || 'UNKNOWN'}`;
      }

      toast({ 
        variant: "destructive", 
        title: title, 
        description: description,
        duration: 15000, // Keep toast visible for longer
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onVerifyOtp(values: z.infer<typeof otpSchema>) {
    if (!confirmationResult) return;
    setIsSubmitting(true);
    try {
      await confirmationResult.confirm(values.otp_code);
      toast({ title: "Login Successful!", description: "Redirecting to admin dashboard..." });
      router.push("/admin");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({ 
        variant: "destructive", 
        title: "Invalid OTP", 
        description: "The OTP you entered is incorrect. Please try again.",
        duration: 8000
      });
      otpForm.reset({ otp_code: "" });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Render OTP verification form if confirmationResult is set
  if (confirmationResult) {
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
          className="space-y-6"
        >
          <FormField
            control={otpForm.control}
            name="otp_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter 6-Digit Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="_ _ _ _ _ _"
                    className="text-center text-2xl font-mono tracking-[0.5em]"
                  />
                </FormControl>
                <FormDescription>
                   Please enter the 6-digit code sent to your phone.
                   For test numbers, use the code from your Firebase console (e.g., 123456).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Login
          </Button>
        </form>
      </Form>
    );
  }

  // Render phone number input form by default
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
                    autoComplete="tel"
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
