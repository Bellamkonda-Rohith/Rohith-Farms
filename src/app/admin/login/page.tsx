
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Helper to set up Recaptcha
const setupRecaptcha = () => {
  if (typeof window !== 'undefined' && 'recaptchaVerifier' in window) {
    (window as any).recaptchaVerifier.clear();
  }
  
  return new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible',
    'callback': (response: any) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log("Recaptcha solved");
    }
  });
};


export default function AdminLoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    // If user is already logged in and is an admin, redirect to dashboard
    if (user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, router]);

  useEffect(() => {
    // Set up recaptcha on mount
    (window as any).recaptchaVerifier = setupRecaptcha();
  }, []);

  const handleSendOtp = async () => {
    if (!phoneNumber || !/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code (e.g., +919876543210).",
      });
      return;
    }

    setLoading(true);
    try {
      const verifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      toast({
        title: "OTP Sent",
        description: "An OTP has been sent to your phone number.",
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: "Please check the phone number or try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP.",
      });
      return;
    }

    setLoading(true);
    try {
      await confirmationResult?.confirm(otp);
      toast({
        title: "Login Successful",
        description: "Redirecting to admin dashboard...",
      });
      router.push('/admin');
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "The OTP is incorrect. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            {confirmationResult ? 'Enter the OTP sent to your phone' : 'Enter your phone number to receive an OTP'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!confirmationResult ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="button" className="w-full" onClick={handleSendOtp} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Phone className="mr-2 h-4 w-4" />}
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2 text-center">
                <Label htmlFor="otp">Enter OTP</Label>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="button" className="w-full" onClick={handleVerifyOtp} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP and Login
              </Button>
               <Button variant="link" size="sm" onClick={() => setConfirmationResult(null)} disabled={loading}>
                 Try another number
               </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div id="recaptcha-container"></div>
    </div>
  );
}
