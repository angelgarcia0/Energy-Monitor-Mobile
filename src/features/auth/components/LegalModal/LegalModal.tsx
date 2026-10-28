import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, useWindowDimensions, View } from "react-native";

import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { styles } from "./LegalModal.styles";

export type LegalTab = "terms" | "privacy";

const TABS: LegalTab[] = ["terms", "privacy"];

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalDocument {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  footer?: string;
}

export interface LegalModalProps {
  visible: boolean;
  activeTab: LegalTab;
  onTabChange: (tab: LegalTab) => void;
  onClose: () => void;
}

/**
 * Términos de uso y política de privacidad, los mismos textos de la Web (`legalModal`). El
 * registro los enlaza desde la casilla de aceptación.
 */
export function LegalModal({ visible, activeTab, onTabChange, onClose }: LegalModalProps) {
  const { t } = useTranslation("legalModal");
  const { height } = useWindowDimensions();
  const doc = t(activeTab, { returnObjects: true }) as LegalDocument;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      title={t("tablistLabel")}
      footer={<Button onPress={onClose}>{t("common.close")}</Button>}
    >
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((tab) => {
          const selected = tab === activeTab;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabChange(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              style={[styles.tab, selected && styles.tabActive]}
            >
              <Text style={[styles.tabText, selected && styles.tabTextActive]}>
                {t(`${tab}.tabLabel`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* `key` vuelve al inicio del texto al cambiar de documento. */}
      <ScrollView key={activeTab} style={{ maxHeight: height * 0.5 }}>
        <Text style={styles.title} accessibilityRole="header">
          {doc.title}
        </Text>
        <Text style={styles.updated}>{doc.lastUpdated}</Text>
        <Text style={styles.paragraph}>{doc.intro}</Text>

        {doc.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.sectionHeading} accessibilityRole="header">
              {section.heading}
            </Text>
            {section.body.split("\n\n").map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        ))}

        {doc.footer ? <Text style={styles.footer}>{doc.footer}</Text> : null}
      </ScrollView>
    </Modal>
  );
}
