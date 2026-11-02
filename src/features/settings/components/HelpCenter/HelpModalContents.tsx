import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { SelectField } from "@/components/SelectField/SelectField";
import {
  openSupportTicket,
  useSupportContacts,
} from "../../hooks/useSupportContacts";
import { styles } from "./HelpModalContents.styles";

/**
 * Contenidos de los tres modales de ayuda de Ajustes (documentación, soporte y
 * novedades). El marco —título, botón de cierre y caja con scroll— es el
 * `Modal` común de la app que monta `HelpCenter`: un solo componente de modal,
 * sin repetir código (equivalente al `HelpModal` de la web).
 */

/** Fracción de la pantalla que puede ocupar el cuerpo desplazable. */
const BODY_MAX_HEIGHT = 0.55;

interface DocSection {
  title: string;
  body: string;
}

/**
 * Documentación dentro del modal de ayuda.
 *
 * La web elige el contenido según el rol (administración / usuario); la móvil
 * no tiene rol de administración —esa cuenta es exclusiva de la web—, así que
 * siempre muestra la guía de usuario.
 */
export function DocsContent() {
  const { t } = useTranslation("docs");
  const { height } = useWindowDimensions();
  const sections = t("user", { returnObjects: true });
  const list = (Array.isArray(sections) ? sections : []) as unknown as DocSection[];

  return (
    <ScrollView style={{ maxHeight: height * BODY_MAX_HEIGHT }}>
      <Text style={styles.subtitle}>{t("subtitle.user")}</Text>

      {list.map((section, index) => (
        <View key={section.title} style={styles.section}>
          <View style={styles.headingRow}>
            <View style={styles.numberCircle}>
              <Text style={styles.number}>{index + 1}</Text>
            </View>
            <Text style={styles.sectionHeading} accessibilityRole="header">
              {section.title}
            </Text>
          </View>
          <Text style={styles.bodyText}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

/**
 * Soporte técnico: los administradores son el contacto (se cargan con
 * `GET /support/contacts`) y el botón abre el correo con el ticket ya escrito.
 * La web oculta este modal a los administradores porque son quienes lo atienden;
 * aquí no procede (la móvil no tiene ese rol).
 */
export function SupportContent() {
  const { t } = useTranslation("support");
  const { t: ts } = useTranslation("settings");
  const { height } = useWindowDimensions();
  const { contacts, selectedEmail, setSelectedEmail } = useSupportContacts();

  const onlyContact = contacts.list.length === 1 ? contacts.list[0] : null;
  const noContact =
    contacts.status === "error" ||
    (contacts.status === "ready" && contacts.list.length === 0);
  const steps = ts("help.supportModal.steps", { returnObjects: true });
  const list = (Array.isArray(steps) ? steps : []) as string[];

  return (
    <ScrollView style={{ maxHeight: height * BODY_MAX_HEIGHT }}>
      <Text style={styles.intro}>{ts("help.supportModal.intro")}</Text>

      <View style={styles.steps}>
        {list.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.numberCircle}>
              <Text style={styles.number}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      {contacts.status === "loading" ? (
        <Text style={styles.notice} accessibilityLiveRegion="polite">
          {t("contact.email.loading")}
        </Text>
      ) : null}
      {noContact ? (
        <Text style={styles.notice} accessibilityLiveRegion="polite">
          {t("contact.email.unavailable")}
        </Text>
      ) : null}

      {contacts.list.length > 1 ? (
        <View style={styles.field}>
          <SelectField
            label={t("contact.email.chooseLabel")}
            value={selectedEmail}
            options={contacts.list.map((contact) => ({
              value: contact.email,
              label:
                contact.name === contact.email
                  ? contact.email
                  : `${contact.name} (${contact.email})`,
            }))}
            onChange={setSelectedEmail}
          />
        </View>
      ) : null}

      {contacts.list.length > 0 ? (
        <Button
          style={styles.button}
          onPress={() =>
            openSupportTicket(
              selectedEmail,
              t("contact.email.subject"),
              t("contact.email.body"),
            )
          }
        >
          {onlyContact
            ? t("contact.email.buttonTo", { name: onlyContact.name })
            : ts("help.support.action")}
        </Button>
      ) : null}
    </ScrollView>
  );
}

/**
 * Novedades: la versión que lleva el build instalado (sale de `app.json` vía
 * `expo-constants`). La web inyecta el changelog del repositorio en cada
 * despliegue; en Expo no hay equivalente, así que se muestra el estado vacío
 * con la nota de que la lista se actualiza por versión.
 */
export function NewsContent() {
  const { t } = useTranslation("news");
  const { height } = useWindowDimensions();
  const version = Constants.expoConfig?.version ?? "—";

  return (
    <ScrollView style={{ maxHeight: height * BODY_MAX_HEIGHT }}>
      <Text style={styles.subtitle}>{t("subtitle")}</Text>
      <Text style={styles.current}>{t("current", { version })}</Text>
      <Text style={styles.notice} accessibilityLiveRegion="polite">
        {t("empty")}
      </Text>
      <Text style={styles.note}>{t("note")}</Text>
    </ScrollView>
  );
}
