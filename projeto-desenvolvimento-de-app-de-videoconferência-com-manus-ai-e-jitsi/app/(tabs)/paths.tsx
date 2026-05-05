import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { LEARNING_PATHS, LearningPath } from "@/lib/content";
import { getUserProgress, UserProgress } from "@/lib/store";

const LANGUAGE_FILTERS = ["Todos", "Inglês", "Espanhol", "Francês"];
const LEVEL_FILTERS = ["Todos", "Iniciante", "Intermediário", "Avançado"];
const LEVEL_MAP: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermediário",
  advanced: "Avançado",
};

export default function PathsScreen() {
  const colors = useColors();
  const [langFilter, setLangFilter] = useState("Todos");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then(setProgress);
    }, [])
  );

  const filtered = LEARNING_PATHS.filter((p) => {
    const langOk = langFilter === "Todos" || p.language === langFilter;
    const levelOk = levelFilter === "Todos" || LEVEL_MAP[p.level] === levelFilter;
    return langOk && levelOk;
  });

  const getPathProgress = (path: LearningPath) => {
    if (!progress) return 0;
    const totalLessons = path.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = path.modules.reduce(
      (acc, m) => acc + m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length,
      0
    );
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  };

  const renderPath = ({ item }: { item: LearningPath }) => {
    const pct = getPathProgress(item);
    const isStarted = pct > 0;
    const isCompleted = pct === 100;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.pathCard,
          { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
        onPress={() => router.push({ pathname: "/lesson/[id]" as any, params: { id: item.id } })}
      >
        <View style={[styles.pathHeader, { backgroundColor: item.color + "18" }]}>
          <Text style={styles.pathEmoji}>{item.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pathTitle, { color: colors.foreground }]}>{item.title}</Text>
            <Text style={[styles.pathMeta, { color: colors.muted }]}>
              {item.totalModules} módulos · {item.estimatedHours}h
            </Text>
          </View>
          {isCompleted ? (
            <View style={[styles.badge, { backgroundColor: "#10B981" }]}>
              <Text style={styles.badgeText}>✓ Concluído</Text>
            </View>
          ) : isStarted ? (
            <View style={[styles.badge, { backgroundColor: "#4169E1" }]}>
              <Text style={styles.badgeText}>Em andamento</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.pathBody}>
          <Text style={[styles.pathDesc, { color: colors.muted }]} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.levelRow}>
            <View style={[styles.levelBadge, { backgroundColor: item.color + "20" }]}>
              <Text style={[styles.levelText, { color: item.color }]}>{LEVEL_MAP[item.level]}</Text>
            </View>
            <Text style={[styles.langTag, { color: colors.muted }]}>{item.language}</Text>
          </View>

          {/* Progress bar */}
          <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: item.color, width: `${pct}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.muted }]}>{pct}% concluído</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "#4169E1" }]}>
        <Text style={styles.headerTitle}>Trilhas de Aprendizado</Text>
        <Text style={styles.headerSub}>Escolha seu caminho de estudo</Text>
      </View>

      {/* Filters */}
      <View style={[styles.filtersSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {LANGUAGE_FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[
                styles.filterChip,
                { backgroundColor: langFilter === f ? "#4169E1" : colors.background, borderColor: langFilter === f ? "#4169E1" : colors.border },
              ]}
              onPress={() => setLangFilter(f)}
            >
              <Text style={[styles.filterText, { color: langFilter === f ? "#fff" : colors.muted }]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {LEVEL_FILTERS.map((f) => (
            <Pressable
              key={f}
              style={[
                styles.filterChip,
                { backgroundColor: levelFilter === f ? "#6C41E1" : colors.background, borderColor: levelFilter === f ? "#6C41E1" : colors.border },
              ]}
              onPress={() => setLevelFilter(f)}
            >
              <Text style={[styles.filterText, { color: levelFilter === f ? "#fff" : colors.muted }]}>{f}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderPath}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>Nenhuma trilha encontrada</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  filtersSection: {
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  pathCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  pathHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  pathEmoji: {
    fontSize: 36,
  },
  pathTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  pathMeta: {
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  pathBody: {
    padding: 16,
    paddingTop: 0,
    gap: 8,
  },
  pathDesc: {
    fontSize: 13,
    lineHeight: 20,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "700",
  },
  langTag: {
    fontSize: 12,
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
});
