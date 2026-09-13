import { api } from '../lib/api';
let checkoutScript;
function loadCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (!checkoutScript) checkoutScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => { script.remove(); checkoutScript = undefined; reject(new Error('Unable to load Razorpay. Check your network and retry.')); };
    document.head.appendChild(script);
  });
  return checkoutScript;
}
export async function payForOrder(orderId, user) {
  const result = await api.post('/orders/' + orderId + '/payment');
  await loadCheckout();
  const payment = result.data;
  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: payment.keyId, amount: payment.amountMinor, currency: payment.currency,
      order_id: payment.providerOrderId, name: 'FastLance', description: 'Contract payment',
      prefill: { name: user.name, email: user.email },
      handler: async data => {
        try { resolve(await api.post('/orders/' + orderId + '/payment/verify', data)); }
        catch (error) { reject(error); }
      },
      modal: { ondismiss: () => reject(new Error('Checkout closed. Your contract will update if Razorpay confirms a payment.')) },
      theme: { color: '#4f46e5' },
    });
    checkout.on('payment.failed', () => reject(new Error('Razorpay reported a payment failure. You can retry checkout.')));
    checkout.open();
  });
}
