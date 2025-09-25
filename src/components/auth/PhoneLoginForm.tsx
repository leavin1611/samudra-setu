'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Please enter a valid phone number with country code'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

export function PhoneLoginForm() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const generateRecaptcha = () => {
    if (auth && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOtp: SubmitHandler<PhoneFormValues> = async (data) => {
    setIsLoading(true);
    generateRecaptcha();
    
    const appVerifier = window.recaptchaVerifier!;
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, data.phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOtpSent(true);
      toast({
        title: 'OTP Sent!',
        description: `An OTP has been sent to ${data.phoneNumber}.`,
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Failed to send OTP. Please check the number and try again.',
      });
       if (window.recaptchaVerifier) {
          window.recaptchaVerifier.render().then(function(widgetId) {
            // @ts-ignore
            grecaptcha.reset(widgetId);
          });
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp: SubmitHandler<OtpFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const result = await window.confirmationResult?.confirm(data.otp);
      if (result?.user) {
        toast({
          title: 'Login Successful!',
          description: 'You are now logged in.',
        });
        // You can add redirection logic here, e.g., router.push('/dashboard')
      } else {
        throw new Error('User not found after confirmation');
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The OTP you entered is incorrect. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 md:py-24">
      <Card className="w-full max-w-md shadow-2xl">
        {!isOtpSent ? (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Sign In with Phone</CardTitle>
              <CardDescription>Enter your mobile number to receive a verification code.</CardDescription>
            </CardHeader>
            <form onSubmit={phoneForm.handleSubmit(handleSendOtp)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+91 98765 43210"
                    {...phoneForm.register('phoneNumber')}
                  />
                  {phoneForm.formState.errors.phoneNumber && (
                    <p className="text-sm text-destructive">{phoneForm.formState.errors.phoneNumber.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send OTP
                </Button>
                 <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                    </Link>
                </div>
              </CardFooter>
            </form>
          </>
        ) : (
          <>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Verify OTP</CardTitle>
              <CardDescription>Enter the 6-digit code sent to your mobile.</CardDescription>
            </CardHeader>
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input id="otp" placeholder="123456" {...otpForm.register('otp')} />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-destructive">{otpForm.formState.errors.otp.message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Verify OTP
                </Button>
                <Button variant="link" size="sm" onClick={() => setIsOtpSent(false)} disabled={isLoading}>
                  Change phone number
                </Button>
              </CardFooter>
            </form>
          </>
        )}
        <div id="recaptcha-container" className="flex justify-center p-4"></div>
      </Card>
    </div>
  );
}
