import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { saveUserProfile, setOnboardingDone } from "@/lib/store";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");

const LANGUAGES = ["Inglês", "Espanhol", "Francês", "Alemão", "Italiano", "Japonês", "Mandarim"];
const LEVELS = [
  { id: "beginner", label: "Iniciante", desc: "Estou começando do zero", emoji: "🌱" },
  { id: "intermediate", label: "Intermediário", desc: "Já conheço o básico", emoji: "🌿" },
  { id: "advanced", label: "Avançado", desc: "Quero aperfeiçoar", emoji: "🌳" },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const handleFinish = async () => {
    await saveUserProfile({
      name: name || "Estudante",
      nativeLanguage: "Português",
      learningLanguages: [selectedLanguage || "Inglês"],
      level: selectedLevel,
      avatar: "👤",
    });
    await setOnboardingDone();
    router.replace("/(tabs)");
  };

  const steps = [
    // Step 0: Welcome
    <View key="welcome" style={styles.stepContainer}>
      <Text style={styles.bigEmoji}>🌍</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Bem-vindo ao{"\n"}LinguaConnect</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>
        Aprenda idiomas de forma inteligente e conecte-se com estudantes do mundo todo.
      </Text>
      <View style={styles.featureList}>
        {[
          { emoji: "📚", text: "Trilhas adaptativas de aprendizado" },
          { emoji: "🎥", text: "Conversação ao vivo com Jitsi Meet" },
          { emoji: "🌆", text: "Simulações da vida real" },
          { emoji: "🎤", text: "Treino de pronúncia com IA" },
        ].map((f) => (
          <View key={f.text} style={[styles.featureItem, { backgroundColor: colors.surface }]}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={[styles.featureText, { color: colors.foreground }]}>{f.text}</Text>
          </View>
        ))}
      </View>
    </View>,

    // Step 1: Choose language
    <View key="language" style={styles.stepContainer}>
      <Text style={styles.bigEmoji}>🗣️</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Qual idioma você quer aprender?</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Você pode adicionar mais idiomas depois.</Text>
      <View style={styles.optionsGrid}>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang}
            style={[
              styles.langOption,
              { backgroundColor: selectedLanguage === lang ? "#4169E1" : colors.surface, borderColor: selectedLanguage === lang ? "#4169E1" : colors.border },
            ]}
            onPress={() => setSelectedLanguage(lang)}
          >
            <Text style={[styles.langText, { color: selectedLanguage === lang ? "#fff" : colors.foreground }]}>
              {lang}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>,

    // Step 2: Choose level
    <View key="level" style={styles.stepContainer}>
      <Text style={styles.bigEmoji}>📊</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Qual é o seu nível?</Text>
      <Text style={[styles.subtitle, { color: colors.muted }]}>Isso nos ajuda a personalizar sua trilha de aprendizado.</Text>
      <View style={styles.levelList}>
        {LEVELS.map((lvl) => (
          <Pressable
            key={lvl.id}
            style={[
              styles.levelOption,
              {
                backgroundColor: selectedLevel === lvl.id ? "#4169E1" : colors.surface,
                borderColor: selectedLevel === lvl.id ? "#4169E1" : colors.border,
              },
            ]}
            onPress={() => setSelectedLevel(lvl.id as "beginner" | "intermediate" | "advanced")}
          >
            <Text style={styles.levelEmoji}>{lvl.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.levelLabel, { color: selectedLevel === lvl.id ? "#fff" : colors.foreground }]}>
                {lvl.label}
              </Text>
              <Text style={[styles.levelDesc, { color: selectedLevel === lvl.id ? "rgba(255,255,255,0.8)" : colors.muted }]}>
                {lvl.desc}
              </Text>
            </View>
            {selectedLevel === lvl.id && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
        ))}
      </View>
    </View>,
  ];

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Progress dots */}
          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === step ? "#4169E1" : colors.border, width: i === step ? 24 : 8 },
                ]}
              />
            ))}
          </View>

          {steps[step]}

          {/* Navigation buttons */}
          <View style={styles.buttons}>
            {step > 0 && (
              <Pressable
                style={[styles.backBtn, { borderColor: colors.border }]}
                onPress={() => setStep(step - 1)}
              >
                <Text style={[styles.backBtnText, { color: colors.muted }]}>Voltar</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.nextBtn, { flex: step > 0 ? 1 : undefined, minWidth: step === 0 ? 200 : undefined }]}
              onPress={() => {
                if (step < steps.length - 1) {
                  setStep(step + 1);
                } else {
                  handleFinish();
                }
              }}
            >
              <Text style={styles.nextBtnText}>
                {step === steps.length - 1 ? "Começar a Aprender! 🚀" : "Continuar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  stepContainer: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 16,
  },
  bigEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
  },
  featureList: {
    width: "100%",
    gap: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    width: "100%",
  },
  langOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  langText: {
    fontSize: 15,
    fontWeight: "600",
  },
  levelList: {
    width: "100%",
    gap: 12,
  },
  levelOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  levelEmoji: {
    fontSize: 28,
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  levelDesc: {
    fontSize: 13,
  },
  checkmark: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },
  nextBtn: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
