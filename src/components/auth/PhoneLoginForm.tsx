
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
import { Loader2, AlertCircle, Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone number must be in E.164 format (e.g., +919876543210)'),
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [billingError, setBillingError] = useState(false);

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
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleSendOtp: SubmitHandler<PhoneFormValues> = async (data) => {
    setIsLoading(true);
    setBillingError(false);
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
      
      if (error.code === 'auth/billing-not-enabled') {
        setBillingError(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message || 'Failed to send OTP. Please check the number and try again.',
        });
      }

       if (window.recaptchaVerifier) {
          try {
            // @ts-ignore
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = undefined;
          } catch (e) {
            console.error("Error clearing reCAPTCHA", e);
          }
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
          description: 'Redirecting to the home page...',
        });
        router.push('/');
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
                {billingError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Billing Required for Real SMS</AlertTitle>
                    <AlertDescription className="space-y-4">
                      <p>Firebase Phone Authentication requires the <strong>Blaze Plan</strong> for real SMS delivery to your phone.</p>
                      <div className="bg-destructive/10 p-3 rounded-md text-sm border border-destructive/20">
                        <p className="font-bold mb-1">Free Way to Test:</p>
                        <p>You can add <strong>"test phone numbers"</strong> in the Firebase Console (Auth -> Settings -> Phone numbers for testing). These work for free even on the Spark plan.</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2 text-blue-700 text-sm">
                   <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                   <p>Ensure your number includes the country code (e.g., +91 for India).</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+919876543210"
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
