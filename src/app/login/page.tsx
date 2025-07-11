
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, LogIn } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";


export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAdmin, authLoading } = useAuth();
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, isAdmin, authLoading, router]);

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
        const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current!, {
            'size': 'invisible',
        });
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
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
        description: "Please check the number or try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({ variant: "destructive", title: "Invalid OTP", description: "Please enter the 6-digit OTP." });
      return;
    }

    if (!confirmationResult) {
      toast({ variant: "destructive", title: "Verification Failed", description: "Please try sending the OTP again." });
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Login Successful", description: "Redirecting..." });
      // The useEffect will handle the final redirection.
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({ variant: "destructive", title: "Login Failed", description: "The OTP is incorrect. Please try again." });
      setLoading(false);
    } 
  };

  if (authLoading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
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
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Verify OTP and Login
              </Button>
               <Button variant="link" size="sm" onClick={() => setConfirmationResult(null)} disabled={loading}>
                 Try another number
               </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div ref={recaptchaContainerRef}></div>
    </div>
  );
}
