import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getUserProfile, getUserProgress, UserProfile, UserProgress } from "@/lib/store";
import { isOnboardingDone } from "@/lib/store";
import { LEARNING_PATHS } from "@/lib/content";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

const QUICK_ACTIONS = [
  { id: "paths", title: "Trilhas", subtitle: "Aprendizado adaptativo", emoji: "📚", color: "#4169E1", route: "/(tabs)/paths" },
  { id: "connect", title: "Conversar", subtitle: "Jitsi Meet ao vivo", emoji: "🎥", color: "#7C3AED", route: "/(tabs)/connect" },
  { id: "reallife", title: "Vida Real", subtitle: "Simulações do dia a dia", emoji: "🌆", color: "#059669", route: "/(tabs)/connect?tab=reallife" },
  { id: "pronunciation", title: "Pronúncia", subtitle: "Treino com feedback IA", emoji: "🎤", color: "#DC2626", route: "/pronunciation" },
];

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function HomeScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const done = await isOnboardingDone();
    if (!done) {
      router.replace("/onboarding");
      return;
    }
    const [p, prog] = await Promise.all([getUserProfile(), getUserProgress()]);
    setProfile(p);
    setProgress(prog);
    setLoading(false);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <Text style={{ fontSize: 40 }}>🌍</Text>
        </View>
      </ScreenContainer>
    );
  }

  const maxWeeklyXP = Math.max(...(progress?.weeklyXP || [1]), 1);
  const todayIndex = new Date().getDay();

  const nextLesson = LEARNING_PATHS.find((p) =>
    p.language === (profile?.learningLanguages[0] || "Inglês")
  );

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: "#4169E1" }]}>
          <View>
            <Text style={styles.greeting}>Olá, {profile?.name?.split(" ")[0] || "Estudante"}! 👋</Text>
            <Text style={styles.headerSub}>Pronto para aprender hoje?</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakCount}>{progress?.streak || 0}</Text>
            <Text style={styles.streakLabel}>dias</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* XP Card */}
          <View style={[styles.xpCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.xpRow}>
              <View>
                <Text style={[styles.xpLabel, { color: colors.muted }]}>XP Total</Text>
                <Text style={[styles.xpValue, { color: "#4169E1" }]}>⚡ {progress?.xp || 0} XP</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.xpLabel, { color: colors.muted }]}>Lições</Text>
                <Text style={[styles.xpValue, { color: colors.foreground }]}>
                  {progress?.completedLessons.length || 0}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.xpLabel, { color: colors.muted }]}>Conversas</Text>
                <Text style={[styles.xpValue, { color: colors.foreground }]}>
                  {progress?.conversationSessions || 0}
                </Text>
              </View>
            </View>

            {/* Weekly XP bars */}
            <Text style={[styles.weeklyTitle, { color: colors.muted }]}>XP desta semana</Text>
            <View style={styles.weeklyBars}>
              {DAYS.map((day, i) => {
                const xp = progress?.weeklyXP[i] || 0;
                const barHeight = maxWeeklyXP > 0 ? Math.max((xp / maxWeeklyXP) * 48, 4) : 4;
                const isToday = i === todayIndex;
                return (
                  <View key={day} style={styles.barItem}>
                    <View style={[styles.barBg, { backgroundColor: colors.border }]}>
                      <View
                        style={[
                          styles.barFill,
                          { height: barHeight, backgroundColor: isToday ? "#4169E1" : "#A5B4FC" },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barLabel, { color: isToday ? "#4169E1" : colors.muted, fontWeight: isToday ? "700" : "400" }]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>O que você quer fazer?</Text>
          <View style={styles.quickGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [
                  styles.quickCard,
                  { backgroundColor: action.color, opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={() => router.push(action.route as any)}
              >
                <Text style={styles.quickEmoji}>{action.emoji}</Text>
                <Text style={styles.quickTitle}>{action.title}</Text>
                <Text style={styles.quickSub}>{action.subtitle}</Text>
              </Pressable>
            ))}
          </View>

          {/* Next Lesson */}
          {nextLesson && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Continue aprendendo</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.nextLessonCard,
                  { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                ]}
                onPress={() => router.push("/paths" as any)}
              >
                <View style={[styles.nextLessonIcon, { backgroundColor: nextLesson.color + "20" }]}>
                  <Text style={{ fontSize: 32 }}>{nextLesson.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.nextLessonTitle, { color: colors.foreground }]}>{nextLesson.title}</Text>
                  <Text style={[styles.nextLessonSub, { color: colors.muted }]}>
                    {nextLesson.totalModules} módulos · {nextLesson.estimatedHours}h estimadas
                  </Text>
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: "#4169E1",
                          width: `${Math.min(
                            ((progress?.completedLessons.filter((id) =>
                              nextLesson.modules.some((m) => m.lessons.some((l) => l.id === id))
                            ).length || 0) /
                              nextLesson.modules.reduce((acc, m) => acc + m.lessons.length, 0)) *
                              100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                <Text style={{ fontSize: 20, color: colors.muted }}>›</Text>
              </Pressable>
            </>
          )}

          {/* Achievements preview */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Conquistas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsRow}>
            {[
              { emoji: "🌟", title: "Primeira Lição", unlocked: (progress?.completedLessons.length || 0) >= 1 },
              { emoji: "🔥", title: "3 dias seguidos", unlocked: (progress?.streak || 0) >= 3 },
              { emoji: "💬", title: "1ª Conversa", unlocked: (progress?.conversationSessions || 0) >= 1 },
              { emoji: "⚡", title: "100 XP", unlocked: (progress?.xp || 0) >= 100 },
              { emoji: "🏆", title: "5 Lições", unlocked: (progress?.completedLessons.length || 0) >= 5 },
              { emoji: "🎤", title: "Pronúncia", unlocked: (progress?.pronunciationScore || 0) > 0 },
            ].map((a) => (
              <View
                key={a.title}
                style={[
                  styles.achievementBadge,
                  {
                    backgroundColor: a.unlocked ? "#4169E1" : colors.surface,
                    borderColor: a.unlocked ? "#4169E1" : colors.border,
                    opacity: a.unlocked ? 1 : 0.5,
                  },
                ]}
              >
                <Text style={{ fontSize: 24 }}>{a.emoji}</Text>
                <Text style={[styles.achievementTitle, { color: a.unlocked ? "#fff" : colors.muted }]}>
                  {a.title}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  streakBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    minWidth: 64,
  },
  streakFire: {
    fontSize: 20,
  },
  streakCount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  streakLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  content: {
    padding: 16,
    gap: 8,
  },
  xpCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  xpLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  xpValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  weeklyTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  weeklyBars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 64,
  },
  barItem: {
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  barBg: {
    width: 20,
    height: 48,
    borderRadius: 6,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  quickCard: {
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 16,
    minHeight: 120,
    justifyContent: "flex-end",
  },
  quickEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  quickSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  nextLessonCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 8,
  },
  nextLessonIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  nextLessonTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  nextLessonSub: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  achievementsRow: {
    marginBottom: 8,
  },
  achievementBadge: {
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 10,
    minWidth: 80,
    gap: 4,
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});
