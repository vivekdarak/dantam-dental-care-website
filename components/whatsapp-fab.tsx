import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import "./whatsapp-fab.css";

export function WhatsappFab() {
  return (
    <a className="whatsapp-fab" href={site.whatsapp.href} target="_blank" rel="noreferrer" aria-label="WhatsApp Dantam Dental Care">
      <MessageCircle size={24} />
    </a>
  );
}
