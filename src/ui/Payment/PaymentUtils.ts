const razorPayKeys: string = import.meta.env.VITE_RAZOR_PAY_KEY as string;
const apiUrl: string = import.meta.env.VITE_API_URL as string;

/* ------------------------- Interfaces ------------------------- */

export interface UserData {
  id: number | string;
  name: string;
  email?: string;
  mobile?: string;
}

export interface ProjectPayment {
  id: number | string;
  wkly_cost_amt: number;
  amt_act?: number | null;
  proj_id?: number | null;
}

export interface Invoice {
  Inv_Id: string;
  Inv_Total: number;
  tenant_id: number;
  tenant_name: string;
  tenant_email: string;
  tenant_mobile: string;
  property_id: number;
}

/* ---------------------- Project Payment ----------------------- */

export const handleProjectPayment = async (
  invId: string | number,
  payment: ProjectPayment,
  userData: UserData,
  setIsPaymentLoading: (loading: boolean) => void,
  setPaymentShowModal: (show: boolean) => void,
  setIsPaymentSuccess: (success: boolean) => void
): Promise<void> => {
  if (
    !payment ||
    !payment.id ||
    payment.wkly_cost_amt <= (payment.amt_act ?? 0)
  ) {
    console.error("Invalid payment data:", payment);
    alert("Invalid payment data or no payment required.");
    return;
  }

  setIsPaymentLoading(true);

  try {
    const amount = payment.wkly_cost_amt - (payment.amt_act ?? 0);

    const orderResponse = await fetch(`${apiUrl}/pay/project/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        T_amount: parseInt(amount.toString()),
        currency: "INR",
        Inv_Id: payment.id,
      }),
    });

    if (!orderResponse.ok) {
      const text = await orderResponse.text();
      console.error("API Error:", text);
      throw new Error(`Failed to create order`);
    }

    const orderData = await orderResponse.json();
    if (!orderData.success) throw new Error("Order creation failed");

    const options = {
      key: razorPayKeys,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: userData.name || "Unknown Tenant",
      description: `Payment for Invoice ${payment.id}`,
      order_id: orderData.order.id,

      /* Razorpay Handler */
      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch(
            `${apiUrl}/project/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: orderData.order.id,
                Inv_Id: payment.id,
                user_id: userData.id ?? null,
                project_id: payment.proj_id ?? null,
              }),
            }
          );

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            setIsPaymentSuccess(true);
            setPaymentShowModal(true);
          } else {
            throw new Error(verifyData.message || "Verification failed");
          }
        } catch (error: any) {
          console.error("Payment verification error:", error);
          alert(`Payment verification failed: ${error.message}`);
          setIsPaymentSuccess(false);
          setPaymentShowModal(true);
        }
      },

      prefill: {
        name: userData.name,
        email: userData.email ?? "unknown@example.com",
        contact: userData.mobile ?? "0000000000",
      },

      theme: { color: "#001433" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error: any) {
    console.error("Payment error:", error);
    alert(`Payment failed: ${error.message}`);
    setIsPaymentSuccess(false);
    setPaymentShowModal(true);
  } finally {
    setIsPaymentLoading(false);
  }
};

/* ---------------------- Regular Payment ------------------------ */

export const handlePayment = async (
  propertyId: number,
  invoice: Invoice,
  setIsPaymentLoading: (loading: boolean) => void,
  setPaymentShowModal: (show: boolean) => void,
  setIsPaymentSuccess: (success: boolean) => void
): Promise<void> => {
  if (!invoice || invoice.property_id !== propertyId) return;

  setIsPaymentLoading(true);

  try {
    const orderResponse = await fetch(`${apiUrl}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        T_amount: parseInt(invoice.Inv_Total.toString()),
        currency: "INR",
        Inv_Id: invoice.Inv_Id,
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderData.success) throw new Error("Order creation failed");

    const options = {
      key: razorPayKeys,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: invoice.tenant_name,
      description: invoice.Inv_Id,
      order_id: orderData.order.id,

      handler: async (response: any) => {
        try {
          const verifyResponse = await fetch(`${apiUrl}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: orderData.order.id,
              Inv_Id: invoice.Inv_Id,
              user_id: invoice.tenant_id,
              prop_id: invoice.property_id,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            setIsPaymentSuccess(true);
            setPaymentShowModal(true);
          } else {
            throw new Error(
              verifyData.message || "Payment verification failed"
            );
          }
        } catch (error: any) {
          console.error("Verification error:", error);
          alert(`Payment verification failed: ${error.message}`);
          setIsPaymentSuccess(false);
          setPaymentShowModal(true);
        }
      },

      prefill: {
        name: invoice.tenant_name,
        email: invoice.tenant_email,
        contact: invoice.tenant_mobile,
      },

      theme: { color: "#001433" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error: any) {
    console.error("Payment error:", error);
    alert(`Payment failed: ${error.message}`);
    setIsPaymentSuccess(false);
    setPaymentShowModal(true);
  } finally {
    setIsPaymentLoading(false);
  }
};
