import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  getUserProfile,
  getUserProgress,
  getAppSettings,
  saveAppSettings,
  UserProfile,
  UserProgress,
  AppSettings,
  setOnboardingDone,
  saveUserProfile,
  saveUserProgress,
} from "@/lib/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACHIEVEMENTS = [
  { id: "first-lesson", emoji: "🌟", title: "Primeira Lição", desc: "Concluiu a primeira lição", condition: (p: UserProgress) => p.completedLessons.length >= 1 },
  { id: "streak-3", emoji: "🔥", title: "3 Dias Seguidos", desc: "Estudou 3 dias consecutivos", condition: (p: UserProgress) => p.streak >= 3 },
  { id: "streak-7", emoji: "🏅", title: "Uma Semana", desc: "Estudou 7 dias consecutivos", condition: (p: UserProgress) => p.streak >= 7 },
  { id: "first-convo", emoji: "💬", title: "Primeira Conversa", desc: "Completou uma sessão de conversação", condition: (p: UserProgress) => p.conversationSessions >= 1 },
  { id: "xp-100", emoji: "⚡", title: "100 XP", desc: "Acumulou 100 pontos de experiência", condition: (p: UserProgress) => p.xp >= 100 },
  { id: "xp-500", emoji: "💎", title: "500 XP", desc: "Acumulou 500 pontos de experiência", condition: (p: UserProgress) => p.xp >= 500 },
  { id: "lessons-5", emoji: "🏆", title: "5 Lições", desc: "Concluiu 5 lições", condition: (p: UserProgress) => p.completedLessons.length >= 5 },
  { id: "lessons-10", emoji: "👑", title: "10 Lições", desc: "Concluiu 10 lições", condition: (p: UserProgress) => p.completedLessons.length >= 10 },
  { id: "pronunciation", emoji: "🎤", title: "Voz de Ouro", desc: "Praticou pronúncia", condition: (p: UserProgress) => p.pronunciationScore > 0 },
  { id: "convo-5", emoji: "🌍", title: "Poliglota", desc: "Completou 5 sessões de conversação", condition: (p: UserProgress) => p.conversationSessions >= 5 },
];

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export default function ProfileScreen() {
  const colors = useColors();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getUserProfile(), getUserProgress(), getAppSettings()]).then(([p, prog, s]) => {
        setProfile(p);
        setProgress(prog);
        setSettings(s);
      });
    }, [])
  );

  const handleResetProgress = async () => {
    await AsyncStorage.clear();
    router.replace("/onboarding");
  };

  const unlockedCount = progress
    ? ACHIEVEMENTS.filter((a) => a.condition(progress)).length
    : 0;

  const getLevelColor = (xp: number) => {
    if (xp >= 500) return "#F59E0B";
    if (xp >= 200) return "#7C3AED";
    if (xp >= 100) return "#4169E1";
    return "#10B981";
  };

  const getLevelTitle = (xp: number) => {
    if (xp >= 500) return "Mestre";
    if (xp >= 200) return "Avançado";
    if (xp >= 100) return "Intermediário";
    return "Iniciante";
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: "#4169E1" }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(progress?.xp || 0) }]}>
              <Text style={styles.levelBadgeText}>{getLevelTitle(progress?.xp || 0)}</Text>
            </View>
          </View>
          <Text style={styles.profileName}>{profile?.name || "Estudante"}</Text>
          <Text style={styles.profileSub}>
            Aprende: {profile?.learningLanguages.join(", ") || "Inglês"}
          </Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {[
            { label: "XP Total", value: `⚡ ${progress?.xp || 0}`, color: "#4169E1" },
            { label: "Streak", value: `🔥 ${progress?.streak || 0} dias`, color: "#F59E0B" },
            { label: "Lições", value: `📚 ${progress?.completedLessons.length || 0}`, color: "#10B981" },
            { label: "Conversas", value: `💬 ${progress?.conversationSessions || 0}`, color: "#7C3AED" },
          ].map((stat, i) => (
            <View key={stat.label} style={[styles.statItem, i < 3 && { borderRightColor: colors.border, borderRightWidth: 1 }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Conquistas</Text>
            <Text style={[styles.sectionBadge, { color: "#4169E1" }]}>
              {unlockedCount}/{ACHIEVEMENTS.length}
            </Text>
          </View>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement) => {
              const unlocked = progress ? achievement.condition(progress) : false;
              return (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    {
                      backgroundColor: unlocked ? "#4169E115" : colors.surface,
                      borderColor: unlocked ? "#4169E1" : colors.border,
                      opacity: unlocked ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                  <Text style={[styles.achievementTitle, { color: unlocked ? "#4169E1" : colors.foreground }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDesc, { color: colors.muted }]} numberOfLines={2}>
                    {achievement.desc}
                  </Text>
                  {unlocked && <Text style={styles.unlockedBadge}>✓</Text>}
                </View>
              );
            })}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Configurações</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>Notificações</Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>Lembretes diários de estudo</Text>
              </View>
              <Switch
                value={settings?.notifications ?? true}
                onValueChange={async (val) => {
                  if (!settings) return;
                  const updated = { ...settings, notifications: val };
                  setSettings(updated);
                  await saveAppSettings(updated);
                }}
                trackColor={{ false: colors.border, true: "#4169E1" }}
                thumbColor="#fff"
              />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>Efeitos Sonoros</Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>Sons de feedback nos exercícios</Text>
              </View>
              <Switch
                value={settings?.soundEffects ?? true}
                onValueChange={async (val) => {
                  if (!settings) return;
                  const updated = { ...settings, soundEffects: val };
                  setSettings(updated);
                  await saveAppSettings(updated);
                }}
                trackColor={{ false: colors.border, true: "#4169E1" }}
                thumbColor="#fff"
              />
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.settingRow}>
              <View>
                <Text style={[styles.settingLabel, { color: colors.foreground }]}>Meta Diária</Text>
                <Text style={[styles.settingDesc, { color: colors.muted }]}>{settings?.dailyGoalMinutes || 15} minutos por dia</Text>
              </View>
              <View style={styles.goalButtons}>
                {[10, 15, 20, 30].map((min) => (
                  <Pressable
                    key={min}
                    style={[
                      styles.goalBtn,
                      {
                        backgroundColor: settings?.dailyGoalMinutes === min ? "#4169E1" : colors.background,
                        borderColor: settings?.dailyGoalMinutes === min ? "#4169E1" : colors.border,
                      },
                    ]}
                    onPress={async () => {
                      if (!settings) return;
                      const updated = { ...settings, dailyGoalMinutes: min };
                      setSettings(updated);
                      await saveAppSettings(updated);
                    }}
                  >
                    <Text style={[styles.goalBtnText, { color: settings?.dailyGoalMinutes === min ? "#fff" : colors.muted }]}>
                      {min}m
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Profile info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Meu Perfil</Text>
          <View style={[styles.settingsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Nome</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{profile?.name || "—"}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Idioma Nativo</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{profile?.nativeLanguage || "—"}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Aprendendo</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {profile?.learningLanguages.join(", ") || "—"}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.muted }]}>Nível</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>
                {LEVEL_LABELS[profile?.level || "beginner"]}
              </Text>
            </View>
          </View>
        </View>

        {/* Reset */}
        <View style={[styles.section, { paddingBottom: 8 }]}>
          <Pressable
            style={[styles.resetBtn, { borderColor: "#EF4444" }]}
            onPress={handleResetProgress}
          >
            <Text style={[styles.resetBtnText, { color: "#EF4444" }]}>🔄 Reiniciar App (apagar dados)</Text>
          </Pressable>
        </View>

        <Text style={[styles.version, { color: colors.muted }]}>LinguaConnect v1.0.0</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 24,
    paddingBottom: 28,
    gap: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 40,
  },
  levelBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  levelBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  profileSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  statsCard: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 14,
    gap: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  sectionBadge: {
    fontSize: 14,
    fontWeight: "700",
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  achievementCard: {
    width: "30%",
    flexGrow: 1,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 4,
    position: "relative",
  },
  achievementEmoji: {
    fontSize: 28,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  achievementDesc: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 14,
  },
  unlockedBadge: {
    position: "absolute",
    top: 6,
    right: 8,
    fontSize: 12,
    color: "#4169E1",
    fontWeight: "700",
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  goalButtons: {
    flexDirection: "row",
    gap: 6,
  },
  goalBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  goalBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  resetBtn: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    paddingBottom: 16,
  },
});
