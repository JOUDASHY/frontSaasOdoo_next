import { Suspense } from "react";
import PaymentSuccessClient from "./SuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}

