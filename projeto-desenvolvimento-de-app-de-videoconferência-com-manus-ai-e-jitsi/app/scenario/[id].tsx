import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { REAL_LIFE_SCENARIOS, DialogueTurn } from "@/lib/content";
import { addXP } from "@/lib/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ScenarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const scenario = REAL_LIFE_SCENARIOS.find((s) => s.id === id);

  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  if (!scenario) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>Cenário não encontrado</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: "#4169E1" }}>Voltar</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const dialogues = scenario.dialogues;
  const currentTurn = dialogues[currentTurnIndex];
  const totalUserTurns = dialogues.filter((d) => d.speaker === "user" && d.options).length;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (answered) return;
    setSelectedOption(optionIndex);
    setAnswered(true);
    const isCorrect = optionIndex === currentTurn.correctOption;
    if (isCorrect) {
      setScore((s) => s + 1);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      triggerShake();
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleNext = async () => {
    if (currentTurnIndex < dialogues.length - 1) {
      setCurrentTurnIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowTranslation(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } else {
      // Finish
      const xpGained = score * 15 + 10;
      await addXP(xpGained);
      setFinished(true);
    }
  };

  if (finished) {
    const pct = totalUserTurns > 0 ? Math.round((score / totalUserTurns) * 100) : 100;
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.finishedContainer}>
          <Text style={{ fontSize: 72 }}>{pct >= 70 ? "🌟" : "💪"}</Text>
          <Text style={[styles.finishedTitle, { color: colors.foreground }]}>
            {pct >= 70 ? "Excelente!" : "Bom trabalho!"}
          </Text>
          <Text style={[styles.finishedScore, { color: scenario.color }]}>{pct}%</Text>
          <Text style={[styles.finishedSub, { color: colors.muted }]}>
            {score} de {totalUserTurns} respostas corretas
          </Text>
          <View style={[styles.xpBadge, { backgroundColor: "#4169E120" }]}>
            <Text style={{ color: "#4169E1", fontSize: 18, fontWeight: "700" }}>
              ⚡ +{score * 15 + 10} XP ganhos!
            </Text>
          </View>
          <Text style={[styles.scenarioCompleted, { color: colors.muted }]}>
            Cenário: {scenario.title} · {scenario.language}
          </Text>
          <Pressable style={[styles.doneBtn, { backgroundColor: scenario.color }]} onPress={() => router.back()}>
            <Text style={styles.doneBtnText}>Voltar aos Cenários</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const isUserTurn = currentTurn.speaker === "user" && currentTurn.options;
  const isCharacterTurn = currentTurn.speaker === "character";

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: scenario.color }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{scenario.emoji} {scenario.title}</Text>
          <Text style={styles.headerSub}>{scenario.language} · {currentTurnIndex + 1}/{dialogues.length}</Text>
        </View>
        <View style={[styles.progressBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
          <Text style={styles.progressBadgeText}>
            {Math.round((currentTurnIndex / dialogues.length) * 100)}%
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: scenario.color, width: `${(currentTurnIndex / dialogues.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
      >
        {/* Show all previous turns */}
        {dialogues.slice(0, currentTurnIndex + 1).map((turn, idx) => {
          const isUser = turn.speaker === "user";
          const isCurrent = idx === currentTurnIndex;

          if (isUser && turn.options && isCurrent) {
            // Current user turn with options
            return (
              <Animated.View key={turn.id} style={{ transform: [{ translateX: shakeAnim }] }}>
                <View style={[styles.userPrompt, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text style={[styles.promptLabel, { color: colors.muted }]}>Sua vez de responder:</Text>
                  <Text style={[styles.promptText, { color: colors.foreground }]}>{turn.translation}</Text>
                </View>
                <View style={styles.optionsList}>
                  {turn.options.map((option, optIdx) => {
                    let bgColor = colors.surface;
                    let borderColor = colors.border;
                    let textColor = colors.foreground;

                    if (answered) {
                      if (optIdx === turn.correctOption) {
                        bgColor = "#10B98120";
                        borderColor = "#10B981";
                        textColor = "#10B981";
                      } else if (optIdx === selectedOption) {
                        bgColor = "#EF444420";
                        borderColor = "#EF4444";
                        textColor = "#EF4444";
                      }
                    } else if (optIdx === selectedOption) {
                      bgColor = scenario.color + "20";
                      borderColor = scenario.color;
                      textColor = scenario.color;
                    }

                    return (
                      <Pressable
                        key={optIdx}
                        style={[styles.option, { backgroundColor: bgColor, borderColor }]}
                        onPress={() => handleOptionSelect(optIdx)}
                      >
                        <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                        {answered && optIdx === turn.correctOption && (
                          <Text style={{ color: "#10B981", fontSize: 16 }}>✓</Text>
                        )}
                        {answered && optIdx === selectedOption && optIdx !== turn.correctOption && (
                          <Text style={{ color: "#EF4444", fontSize: 16 }}>✗</Text>
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            );
          }

          if (isUser && turn.options && !isCurrent && selectedOption !== null) {
            // Past user turn - show selected answer
            const selected = turn.options[selectedOption] || turn.options[turn.correctOption || 0];
            return (
              <View key={turn.id} style={styles.userBubbleRow}>
                <View style={[styles.userBubble, { backgroundColor: "#4169E1" }]}>
                  <Text style={styles.userBubbleText}>{selected}</Text>
                </View>
              </View>
            );
          }

          if (isCharacterTurn) {
            return (
              <View key={turn.id} style={styles.characterBubbleRow}>
                <View style={[styles.characterAvatar, { backgroundColor: scenario.color + "20" }]}>
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  {turn.characterName && (
                    <Text style={[styles.characterName, { color: scenario.color }]}>{turn.characterName}</Text>
                  )}
                  <View style={[styles.characterBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.characterText, { color: colors.foreground }]}>{turn.text}</Text>
                    {isCurrent && (
                      <Pressable onPress={() => setShowTranslation(!showTranslation)} style={styles.translateBtn}>
                        <Text style={[styles.translateBtnText, { color: colors.muted }]}>
                          {showTranslation ? "🙈 Ocultar tradução" : "👁 Ver tradução"}
                        </Text>
                      </Pressable>
                    )}
                    {(showTranslation || !isCurrent) && (
                      <Text style={[styles.translationText, { color: colors.muted }]}>{turn.translation}</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          }

          return null;
        })}
      </ScrollView>

      {/* Next button - show for character turns or after answering */}
      {(isCharacterTurn || (isUserTurn && answered)) && (
        <View style={[styles.nextContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {answered && selectedOption !== null && selectedOption !== currentTurn.correctOption && (
            <View style={[styles.wrongFeedback, { backgroundColor: "#EF444415", borderColor: "#EF4444" }]}>
              <Text style={{ color: "#EF4444", fontWeight: "600" }}>
                ✗ Resposta correta: "{currentTurn.options?.[currentTurn.correctOption || 0]}"
              </Text>
            </View>
          )}
          <Pressable
            style={[styles.nextBtn, { backgroundColor: scenario.color }]}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>
              {currentTurnIndex < dialogues.length - 1 ? "Continuar →" : "Finalizar Cenário 🎉"}
            </Text>
          </Pressable>
        </View>
      )}
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
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  progressBg: {
    height: 3,
  },
  progressFill: {
    height: "100%",
  },
  characterBubbleRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  characterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  characterName: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  characterBubble: {
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    gap: 8,
  },
  characterText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  translateBtn: {
    alignSelf: "flex-start",
  },
  translateBtnText: {
    fontSize: 12,
  },
  translationText: {
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 18,
  },
  userBubbleRow: {
    alignItems: "flex-end",
  },
  userBubble: {
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 14,
    maxWidth: "80%",
  },
  userBubbleText: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
  },
  userPrompt: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 4,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  promptText: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionsList: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
  },
  nextContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    gap: 10,
  },
  wrongFeedback: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  nextBtn: {
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  finishedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 14,
  },
  finishedTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  finishedScore: {
    fontSize: 60,
    fontWeight: "900",
  },
  finishedSub: {
    fontSize: 16,
    textAlign: "center",
  },
  xpBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  scenarioCompleted: {
    fontSize: 13,
  },
  doneBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
