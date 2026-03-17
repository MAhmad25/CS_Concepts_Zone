import { useState, useContext } from "react";
import { OTPInput, OTPInputContext } from "input-otp";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import appAuth from "../app/AuthService";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { sileo } from "sileo";

function InputOTPSlot({ index, hasError }) {
      const { slots } = useContext(OTPInputContext);
      const { char, hasFakeCaret, isActive } = slots[index];
      const total = slots.length;

      const position = total === 1 ? "rounded-lg border-l" : index === 0 ? "rounded-l-lg border-l" : index === total - 1 ? "rounded-r-lg" : "";

      const stateClass = hasError ? "border-red-500 bg-red-50 border-primary ring-2 ring-ring ring-offset-2" : isActive ? "border-primary ring-2 ring-ring ring-offset-2" : char ? "bg-accent border-border border-primary ring-2 ring-ring ring-offset-2" : "border-border bg-input";

      return (
            <motion.div initial={{ scale: 0.8, opacity: 1 }} animate={hasError ? { x: [-4, 4, -4, 4, 0] } : { scale: 1, opacity: 1 }} transition={hasError ? { duration: 0.4 } : { duration: 0.2, delay: index * 0.05 }}>
                  <div className={`relative flex items-center justify-center border-y border-r h-12 w-12 text-sm transition-all ${stateClass} ${position}`}>
                        {char}
                        {hasFakeCaret && (
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <motion.div className="h-4 w-px bg-foreground" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }} />
                              </div>
                        )}
                  </div>
            </motion.div>
      );
}

export default function VerifyEmail() {
      const [otp, setOtp] = useState("");
      const { email } = useOutletContext();
      const [hasError, setHasError] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();

      async function handleComplete(value) {
            setIsLoading(true);
            setHasError(false);
            const success = await appAuth.verifyEmail(email, value);

            if (!success) {
                  setHasError(true);
                  setOtp("");
                  setIsLoading(false);
                  return;
            }
            sileo.action({
                  title: "Email is Verfied",
                  description: "Now you can freely write posts or blogs",
                  button: {
                        title: "Login",
                        onClick: () => navigate("/login"),
                  },
            });
            navigate("/");
            setIsLoading(false);
      }

      return (
            <div className="flex flex-col gap-8 max-w-md mx-auto">
                  <div className="flex flex-col gap-3 text-center">
                        <OTPInput
                              maxLength={8}
                              value={otp}
                              onChange={(val) => {
                                    setOtp(val);
                                    if (hasError) setHasError(false);
                              }}
                              onComplete={handleComplete}
                              disabled={isLoading}
                              containerClassName="flex items-center gap-2 has-[:disabled]:opacity-50"
                              className="disabled:cursor-not-allowed"
                        >
                              <div className="flex">
                                    <InputOTPSlot index={0} hasError={hasError} />
                                    <InputOTPSlot index={1} hasError={hasError} />
                                    <InputOTPSlot index={2} hasError={hasError} />
                                    <InputOTPSlot index={3} hasError={hasError} />
                              </div>
                              <span className="text-muted-foreground text-sm px-1">-</span>
                              <div className="flex">
                                    <InputOTPSlot index={4} hasError={hasError} />
                                    <InputOTPSlot index={5} hasError={hasError} />
                                    <InputOTPSlot index={6} hasError={hasError} />
                                    <InputOTPSlot index={7} hasError={hasError} />
                              </div>
                        </OTPInput>

                        {isLoading && (
                              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                                    Verifying...
                              </motion.p>
                        )}
                        {hasError && (
                              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-500">
                                    Invalid code. Please try again.
                              </motion.p>
                        )}
                        {!isLoading && !hasError && (
                              <p className="text-sm text-muted-foreground">
                                    Enter the 8-digit code sent to <span className="font-medium text-foreground">{email}</span>
                              </p>
                        )}
                  </div>
            </div>
      );
}
