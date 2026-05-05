import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { LEARNING_PATHS, Exercise } from "@/lib/content";
import { completeLesson } from "@/lib/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();

  // Find lesson by id
  let exercises: Exercise[] = [];
  let lessonTitle = "";
  let lessonId = id;

  for (const path of LEARNING_PATHS) {
    for (const module of path.modules) {
      for (const lesson of module.lessons) {
        if (lesson.id === id && lesson.exercises) {
          exercises = lesson.exercises;
          lessonTitle = lesson.title;
          lessonId = lesson.id;
        }
      }
    }
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shakeAnim] = useState(new Animated.Value(0));

  const current = exercises[currentIndex];
  const total = exercises.length;
  const progress = total > 0 ? (currentIndex / total) * 100 : 0;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);
    setAnswered(true);
    const isCorrect = option === current.answer;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
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
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Finish
      await completeLesson(lessonId, 30);
      setFinished(true);
    }
  };

  if (!current && !finished) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted }}>Exercício não encontrado</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: "#4169E1" }}>Voltar</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  if (finished) {
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.finishedContainer}>
          <Text style={{ fontSize: 72 }}>{score >= 70 ? "🏆" : "💪"}</Text>
          <Text style={[styles.finishedTitle, { color: colors.foreground }]}>
            {score >= 70 ? "Excelente!" : "Continue praticando!"}
          </Text>
          <Text style={[styles.finishedScore, { color: "#4169E1" }]}>{score}%</Text>
          <Text style={[styles.finishedSub, { color: colors.muted }]}>
            {correctCount} de {total} respostas corretas
          </Text>
          <View style={[styles.xpBadge, { backgroundColor: "#4169E120" }]}>
            <Text style={{ color: "#4169E1", fontSize: 18, fontWeight: "700" }}>⚡ +30 XP ganhos!</Text>
          </View>
          <Pressable
            style={styles.doneBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.doneBtnText}>Voltar à Trilha</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const isCorrect = selectedOption === current.answer;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "#4169E1" }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{lessonTitle}</Text>
          <Text style={styles.headerProgress}>{currentIndex + 1} / {total}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
        <Animated.View
          style={[styles.progressFill, { width: `${progress}%`, backgroundColor: "#4169E1" }]}
        />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[styles.questionContainer, { transform: [{ translateX: shakeAnim }] }]}
        >
          {/* Question type badge */}
          <View style={[styles.typeBadge, { backgroundColor: "#4169E120" }]}>
            <Text style={[styles.typeText, { color: "#4169E1" }]}>
              {current.type === "multiple-choice" ? "Múltipla Escolha" :
               current.type === "fill-blank" ? "Complete a Frase" : "Ordene as Palavras"}
            </Text>
          </View>

          <Text style={[styles.question, { color: colors.foreground }]}>{current.question}</Text>

          {/* Options */}
          <View style={styles.options}>
            {(current.options || []).map((option) => {
              let bgColor = colors.surface;
              let borderColor = colors.border;
              let textColor = colors.foreground;

              if (answered) {
                if (option === current.answer) {
                  bgColor = "#10B98120";
                  borderColor = "#10B981";
                  textColor = "#10B981";
                } else if (option === selectedOption) {
                  bgColor = "#EF444420";
                  borderColor = "#EF4444";
                  textColor = "#EF4444";
                }
              } else if (option === selectedOption) {
                bgColor = "#4169E120";
                borderColor = "#4169E1";
                textColor = "#4169E1";
              }

              return (
                <Pressable
                  key={option}
                  style={[styles.option, { backgroundColor: bgColor, borderColor }]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
                  {answered && option === current.answer && (
                    <Text style={{ color: "#10B981", fontSize: 18 }}>✓</Text>
                  )}
                  {answered && option === selectedOption && option !== current.answer && (
                    <Text style={{ color: "#EF4444", fontSize: 18 }}>✗</Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Feedback */}
          {answered && (
            <View style={[styles.feedback, { backgroundColor: isCorrect ? "#10B98115" : "#EF444415", borderColor: isCorrect ? "#10B981" : "#EF4444" }]}>
              <Text style={[styles.feedbackTitle, { color: isCorrect ? "#10B981" : "#EF4444" }]}>
                {isCorrect ? "✓ Correto!" : "✗ Incorreto"}
              </Text>
              <Text style={[styles.feedbackText, { color: colors.muted }]}>{current.translation}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Next button */}
      {answered && (
        <View style={[styles.nextContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex < total - 1 ? "Próxima →" : "Ver Resultado 🏆"}
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
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  headerProgress: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBg: {
    height: 4,
  },
  progressFill: {
    height: "100%",
  },
  questionContainer: {
    padding: 20,
    gap: 16,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  question: {
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 32,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  feedback: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 4,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
  },
  nextContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  nextBtn: {
    backgroundColor: "#4169E1",
    padding: 16,
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
    gap: 16,
  },
  finishedTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  finishedScore: {
    fontSize: 64,
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
  doneBtn: {
    backgroundColor: "#4169E1",
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
