
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
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        "size": "invisible",
        "callback": () => { /* reCAPTCHA solved */ }
      });
    }
  }, []);

  // Reset OTP form when it's about to be shown to fight browser autofill
  useEffect(() => {
    if (confirmationResult) {
      setTimeout(() => {
        otpForm.reset({ otp: "" });
      }, 50);
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
        description = `This is a Firebase security setting. Your app's domain must be authorized. Go to your Firebase Console -> Authentication -> Settings -> Authorized domains, and add the domain from your browser's address bar: ${window.location.hostname}`;
      } else if (error.code === 'auth/too-many-requests') {
        title = "Too Many Attempts";
        description = "You have requested an OTP too many times. Please wait a few minutes before trying again.";
      } else {
         description = `Please check the phone number or try again. Ensure it's added as a test number in your Firebase project. Error code: ${error.code || 'UNKNOWN'}`;
      }

      toast({ 
        variant: "destructive", 
        title: title, 
        description: description,
        duration: 15000,
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
      otpForm.reset({ otp: "" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmationResult) {
    return (
      <Form {...otpForm}>
        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-6" autoComplete="off">
          <FormField
            control={otpForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center text-center">
                <FormLabel className="text-lg font-semibold">Enter Your Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    autoComplete="one-time-code"
                    pattern="\\d{6}"
                    inputMode="numeric"
                  >
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
                <FormDescription>
                  Please enter the 6-digit code sent to your phone.
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
