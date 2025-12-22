import emailjs from "@emailjs/browser";

const TEMPLATE_BY_ACTION = {
  ASSIGNED: import.meta.env.VITE_EMAILJS_TEMPLATE_ASSIGN,
  REASSIGNED: import.meta.env.VITE_EMAILJS_TEMPLATE_REASSIGN,
  APPROVED: import.meta.env.VITE_EMAILJS_TEMPLATE_APPROVE,
  REJECTED: import.meta.env.VITE_EMAILJS_TEMPLATE_REJECT,
};

export const sendTicketEmail = async (emailData) => {
  if (!emailData) return;

  const { action, payload } = emailData;
  const templateId = TEMPLATE_BY_ACTION[action];

  if (!templateId) return;

  return emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId,
    {
      ...payload,
      cc_email: payload.cc_email || "",
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
};
