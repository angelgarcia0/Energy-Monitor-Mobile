import { useEffect, useState } from "react";
import { Linking } from "react-native";

import { supportApi, type SupportContact } from "@/services/support";

export type SupportContactsStatus = "loading" | "ready" | "error";

export interface SupportContactsState {
  status: SupportContactsStatus;
  list: SupportContact[];
}

/**
 * Administradores de soporte: se cargan una sola vez y, con varios, deja elegir
 * a quién escribir. Espejo del hook homónimo de la web
 * (`landingPage/components/Support/useSupportContacts`), que comparten la
 * portada y el modal de Ajustes; aquí lo usa solo el modal.
 *
 * @returns contacts, selectedEmail y setSelectedEmail
 */
export function useSupportContacts(): {
  contacts: SupportContactsState;
  selectedEmail: string;
  setSelectedEmail: (email: string) => void;
} {
  const [contacts, setContacts] = useState<SupportContactsState>({
    status: "loading",
    list: [],
  });
  const [selectedEmail, setSelectedEmail] = useState("");

  useEffect(() => {
    let active = true;
    supportApi
      .getSupportContacts()
      .then((list) => {
        if (!active) return;
        setContacts({ status: "ready", list });
        setSelectedEmail(list[0]?.email ?? "");
      })
      .catch(() => active && setContacts({ status: "error", list: [] }));
    return () => {
      active = false;
    };
  }, []);

  return { contacts, selectedEmail, setSelectedEmail };
}

/**
 * Abre la app de correo del teléfono con el ticket ya escrito (asunto y cuerpo
 * prefilled). La web abre Gmail en una pestaña nueva; en móvil el equivalente
 * es el `mailto:` contra el cliente de correo configurado.
 */
export function openSupportTicket(
  email: string,
  subject: string,
  body: string,
): void {
  if (!email) return;
  const url =
    `mailto:${encodeURIComponent(email)}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;
  // Sin cliente de correo no hay a qué abrir el ticket: el botón se queda sin
  // efecto en lugar de romper el modal.
  void Linking.openURL(url).catch(() => {});
}
