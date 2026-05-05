import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { PRONUNCIATION_PHRASES, PronunciationPhrase } from "@/lib/content";
import { getUserProgress, saveUserProgress, addXP } from "@/lib/store";
import * as Haptics from "expo-haptics";
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync } from "expo-audio";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: "#10B981",
  medium: "#F59E0B",
  hard: "#EF4444",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

const LANGUAGES = ["Inglês", "Espanhol", "Francês"];

export default function PronunciationScreen() {
  const colors = useColors();
  const [langFilter, setLangFilter] = useState("Inglês");
  const [selectedPhrase, setSelectedPhrase] = useState<PronunciationPhrase | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [permissionGranted, setPermissionGranted] = useState(false);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const waveAnim = useRef(new Animated.Value(0)).current;
  const waveAnim0 = useRef(new Animated.Value(0.3)).current;
  const waveAnim1 = useRef(new Animated.Value(0.3)).current;
  const waveAnim2 = useRef(new Animated.Value(0.3)).current;
  const waveAnim3 = useRef(new Animated.Value(0.3)).current;
  const waveAnim4 = useRef(new Animated.Value(0.3)).current;
  const waveAnims = [waveAnim0, waveAnim1, waveAnim2, waveAnim3, waveAnim4];
  const waveLoop = useRef<Animated.CompositeAnimation | null>(null);

  const filteredPhrases = PRONUNCIATION_PHRASES.filter((p) => p.language === langFilter);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === "web") {
      setPermissionGranted(true);
      return;
    }
    try {
      const { granted } = await requestRecordingPermissionsAsync();
      setPermissionGranted(granted);
    } catch {
      setPermissionGranted(false);
    }
  };

  const startWaveAnimation = () => {
    const animations = waveAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 100),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ])
      )
    );
    waveLoop.current = Animated.parallel(animations);
    waveLoop.current.start();
  };

  const stopWaveAnimation = () => {
    waveLoop.current?.stop();
    waveAnims.forEach((anim) => anim.setValue(0.3));
  };

  const handleStartRecording = async () => {
    if (!permissionGranted) {
      await requestPermissions();
      return;
    }
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsRecording(true);
    setScore(null);
    setHasRecorded(false);
    startWaveAnimation();

    if (Platform.OS !== "web") {
      try {
        await setAudioModeAsync({ allowsRecording: true });
        await audioRecorder.record();
      } catch (err) {
        console.log("Recording error:", err);
      }
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    stopWaveAnimation();
    setHasRecorded(true);

    if (Platform.OS !== "web") {
      try {
        await audioRecorder.stop();
      } catch {}
    }

    // Simulate AI evaluation with a realistic score
    const simulatedScore = Math.floor(Math.random() * 35) + 60; // 60-95
    setTimeout(() => {
      setScore(simulatedScore);
      generateFeedback(simulatedScore);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(
          simulatedScore >= 80
            ? Haptics.NotificationFeedbackType.Success
            : Haptics.NotificationFeedbackType.Warning
        );
      }
      addXP(simulatedScore >= 80 ? 15 : 8);
    }, 1500);
  };

  const generateFeedback = (score: number) => {
    if (score >= 90) {
      setFeedback("Excelente pronúncia! Você soou como um falante nativo. Continue assim!");
    } else if (score >= 80) {
      setFeedback("Muito boa pronúncia! Pequenos ajustes nas vogais podem aperfeiçoar ainda mais.");
    } else if (score >= 70) {
      setFeedback("Boa tentativa! Preste atenção na entonação e no ritmo das palavras.");
    } else {
      setFeedback("Continue praticando! Foque nos sons que são diferentes do português.");
    }
  };

  const handleTryAgain = () => {
    setScore(null);
    setHasRecorded(false);
    setFeedback("");
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#10B981";
    if (s >= 65) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreEmoji = (s: number) => {
    if (s >= 90) return "🌟";
    if (s >= 80) return "😊";
    if (s >= 70) return "🙂";
    return "💪";
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "#DC2626" }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>🎤 Treino de Pronúncia</Text>
          <Text style={styles.headerSub}>Fale e receba feedback em tempo real</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Language filter */}
        <View style={styles.langSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                style={[
                  styles.langChip,
                  { backgroundColor: langFilter === lang ? "#DC2626" : colors.surface, borderColor: langFilter === lang ? "#DC2626" : colors.border },
                ]}
                onPress={() => { setLangFilter(lang); setSelectedPhrase(null); setScore(null); setHasRecorded(false); }}
              >
                <Text style={[styles.langChipText, { color: langFilter === lang ? "#fff" : colors.muted }]}>{lang}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Phrase selector */}
        {!selectedPhrase ? (
          <View style={styles.phraseList}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Escolha uma frase para praticar:</Text>
            {filteredPhrases.map((phrase) => (
              <Pressable
                key={phrase.id}
                style={({ pressed }) => [
                  styles.phraseCard,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={() => setSelectedPhrase(phrase)}
              >
                <View style={styles.phraseCardHeader}>
                  <Text style={[styles.phraseText, { color: colors.foreground }]}>{phrase.text}</Text>
                  <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[phrase.difficulty] + "20" }]}>
                    <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[phrase.difficulty] }]}>
                      {DIFFICULTY_LABELS[phrase.difficulty]}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.phraseTranslation, { color: colors.muted }]}>{phrase.translation}</Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.practiceSection}>
            {/* Selected phrase */}
            <View style={[styles.selectedPhraseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.phraseCardHeader}>
                <View style={[styles.diffBadge, { backgroundColor: DIFFICULTY_COLORS[selectedPhrase.difficulty] + "20" }]}>
                  <Text style={[styles.diffText, { color: DIFFICULTY_COLORS[selectedPhrase.difficulty] }]}>
                    {DIFFICULTY_LABELS[selectedPhrase.difficulty]}
                  </Text>
                </View>
                <Pressable onPress={() => { setSelectedPhrase(null); setScore(null); setHasRecorded(false); }}>
                  <Text style={[styles.changeBtn, { color: "#4169E1" }]}>Trocar frase</Text>
                </Pressable>
              </View>
              <Text style={[styles.mainPhrase, { color: colors.foreground }]}>{selectedPhrase.text}</Text>
              <Text style={[styles.phoneticText, { color: colors.muted }]}>{selectedPhrase.phonetic}</Text>
              <Text style={[styles.translationText, { color: colors.muted }]}>{selectedPhrase.translation}</Text>
              <View style={[styles.hintBox, { backgroundColor: "#4169E110" }]}>
                <Text style={[styles.hintText, { color: "#4169E1" }]}>💡 {selectedPhrase.audioHint}</Text>
              </View>
            </View>

            {/* Recording section */}
            {!hasRecorded && !score ? (
              <View style={styles.recordSection}>
                <Text style={[styles.recordInstruction, { color: colors.muted }]}>
                  {isRecording ? "Gravando... Fale a frase acima" : "Toque no botão para gravar"}
                </Text>

                {/* Wave animation */}
                {isRecording && (
                  <View style={styles.waveContainer}>
                    {waveAnims.map((anim, i) => (
                      <Animated.View
                        key={i}
                        style={[
                          styles.waveBar,
                          {
                            backgroundColor: "#DC2626",
                            transform: [{ scaleY: anim }],
                            height: 40 + i * 8,
                          },
                        ]}
                      />
                    ))}
                  </View>
                )}

                <Pressable
                  style={[
                    styles.recordBtn,
                    { backgroundColor: isRecording ? "#EF4444" : "#DC2626" },
                  ]}
                  onPress={isRecording ? handleStopRecording : handleStartRecording}
                >
                  <Text style={styles.recordBtnIcon}>{isRecording ? "⏹" : "🎤"}</Text>
                  <Text style={styles.recordBtnText}>
                    {isRecording ? "Parar Gravação" : "Iniciar Gravação"}
                  </Text>
                </Pressable>
              </View>
            ) : hasRecorded && !score ? (
              <View style={styles.analyzingSection}>
                <Text style={{ fontSize: 48 }}>🔄</Text>
                <Text style={[styles.analyzingText, { color: colors.foreground }]}>Analisando pronúncia...</Text>
                <Text style={[styles.analyzingSubText, { color: colors.muted }]}>A IA está avaliando sua fala</Text>
              </View>
            ) : score !== null ? (
              <View style={styles.scoreSection}>
                {/* Score circle */}
                <View style={[styles.scoreCircle, { borderColor: getScoreColor(score) }]}>
                  <Text style={styles.scoreEmoji}>{getScoreEmoji(score)}</Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>{score}</Text>
                  <Text style={[styles.scoreLabel, { color: colors.muted }]}>/ 100</Text>
                </View>

                {/* Feedback */}
                <View style={[styles.feedbackCard, { backgroundColor: getScoreColor(score) + "15", borderColor: getScoreColor(score) }]}>
                  <Text style={[styles.feedbackTitle, { color: getScoreColor(score) }]}>
                    {score >= 80 ? "✓ Boa pronúncia!" : score >= 70 ? "~ Quase lá!" : "✗ Precisa praticar mais"}
                  </Text>
                  <Text style={[styles.feedbackText, { color: colors.foreground }]}>{feedback}</Text>
                </View>

                {/* Score breakdown */}
                <View style={[styles.breakdownCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.breakdownTitle, { color: colors.foreground }]}>Análise Detalhada</Text>
                  {[
                    { label: "Clareza", value: Math.min(100, score + Math.floor(Math.random() * 10) - 5) },
                    { label: "Entonação", value: Math.min(100, score + Math.floor(Math.random() * 10) - 5) },
                    { label: "Ritmo", value: Math.min(100, score + Math.floor(Math.random() * 10) - 5) },
                    { label: "Sotaque", value: Math.min(100, score - Math.floor(Math.random() * 15)) },
                  ].map((item) => (
                    <View key={item.label} style={styles.breakdownItem}>
                      <Text style={[styles.breakdownLabel, { color: colors.muted }]}>{item.label}</Text>
                      <View style={[styles.breakdownBarBg, { backgroundColor: colors.border }]}>
                        <View
                          style={[
                            styles.breakdownBarFill,
                            { width: `${item.value}%`, backgroundColor: getScoreColor(item.value) },
                          ]}
                        />
                      </View>
                      <Text style={[styles.breakdownValue, { color: getScoreColor(item.value) }]}>{item.value}</Text>
                    </View>
                  ))}
                </View>

                {/* XP gained */}
                <View style={[styles.xpBadge, { backgroundColor: "#4169E120" }]}>
                  <Text style={{ color: "#4169E1", fontSize: 16, fontWeight: "700" }}>
                    ⚡ +{score >= 80 ? 15 : 8} XP ganhos!
                  </Text>
                </View>

                {/* Action buttons */}
                <View style={styles.actionBtns}>
                  <Pressable
                    style={[styles.actionBtn, { borderColor: colors.border }]}
                    onPress={handleTryAgain}
                  >
                    <Text style={[styles.actionBtnText, { color: colors.muted }]}>🔄 Tentar Novamente</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionBtn, { backgroundColor: "#DC2626", borderColor: "#DC2626" }]}
                    onPress={() => {
                      const nextPhrase = filteredPhrases.find((p) => p.id !== selectedPhrase.id);
                      if (nextPhrase) {
                        setSelectedPhrase(nextPhrase);
                        setScore(null);
                        setHasRecorded(false);
                        setFeedback("");
                      }
                    }}
                  >
                    <Text style={[styles.actionBtnText, { color: "#fff" }]}>Próxima Frase →</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  langSection: {
    padding: 16,
    paddingBottom: 8,
  },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  langChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  phraseList: {
    padding: 16,
    paddingTop: 0,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  phraseCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  phraseCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  phraseText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    lineHeight: 22,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  diffText: {
    fontSize: 11,
    fontWeight: "700",
  },
  phraseTranslation: {
    fontSize: 13,
    lineHeight: 18,
  },
  practiceSection: {
    padding: 16,
    paddingTop: 8,
    gap: 16,
  },
  selectedPhraseCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    gap: 10,
  },
  changeBtn: {
    fontSize: 13,
    fontWeight: "600",
  },
  mainPhrase: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 32,
  },
  phoneticText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  translationText: {
    fontSize: 14,
  },
  hintBox: {
    padding: 12,
    borderRadius: 10,
  },
  hintText: {
    fontSize: 13,
    lineHeight: 18,
  },
  recordSection: {
    alignItems: "center",
    gap: 20,
    paddingVertical: 16,
  },
  recordInstruction: {
    fontSize: 15,
    textAlign: "center",
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 60,
  },
  waveBar: {
    width: 8,
    borderRadius: 4,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    gap: 10,
  },
  recordBtnIcon: {
    fontSize: 22,
  },
  recordBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  analyzingSection: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  analyzingText: {
    fontSize: 18,
    fontWeight: "700",
  },
  analyzingSubText: {
    fontSize: 14,
  },
  scoreSection: {
    gap: 16,
    alignItems: "center",
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  scoreEmoji: {
    fontSize: 28,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "900",
  },
  scoreLabel: {
    fontSize: 13,
  },
  feedbackCard: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
  },
  breakdownCard: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  breakdownLabel: {
    fontSize: 13,
    width: 80,
  },
  breakdownBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  breakdownBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  breakdownValue: {
    fontSize: 13,
    fontWeight: "700",
    width: 30,
    textAlign: "right",
  },
  xpBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionBtns: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
