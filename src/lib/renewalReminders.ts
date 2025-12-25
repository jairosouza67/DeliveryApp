import { supabase } from "@/lib/supabase-external";

/**
 * Creates a renewal reminder for a customer after order approval.
 * For BebeMais, this can be used to remind customers about new promotions
 * or to reorder their favorite products.
 */
export const createRenewalReminder = async (
    orderId: string,
    customerName: string,
    customerEmail: string | null,
    customerPhone: string
) => {
    // Calculate reminder date (e.g., 30 days from now for reorder reminder)
    const now = new Date();
    const reminderDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const renewalDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { error } = await supabase.from("renewal_reminders").insert({
        quote_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        reminder_date: reminderDate.toISOString().split("T")[0],
        renewal_date: renewalDate.toISOString().split("T")[0],
        status: "pending",
        notes: "Lembrete automático de novo pedido",
    });

    if (error) {
        console.error("Erro ao criar lembrete:", error);
        throw error;
    }

    return true;
};
