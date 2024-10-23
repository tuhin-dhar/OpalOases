import { useVerifyAccount } from "@/api-client";
import CountdownTimer from "@/Components/CountdownTimer";
import { Button } from "@/Components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/Components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export type OtpFormType = z.infer<typeof FormSchema>;

export function VerifyAccountPage() {
  const form = useForm<OtpFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { enterOtp, isLoading } = useVerifyAccount();

  function onSubmit(otp: OtpFormType) {
    enterOtp(otp);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="flex justify-center">
          <div>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-3xl font-bold">
                    Please enter the One-Time Password
                  </FormLabel>
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
                  <FormDescription>
                    A one-time password sent to your email. Didnot recieve OTP?
                    <div>
                      {" "}
                      Resend OTP in <CountdownTimer />
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading ? (
              <Button>Verifying..</Button>
            ) : (
              <Button
                className="bg-custom hover:bg-customTo mt-3"
                type="submit"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}

export default VerifyAccountPage;
