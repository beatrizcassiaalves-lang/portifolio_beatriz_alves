import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserProfile {
  name: string;
  nativeLanguage: string;
  learningLanguages: string[];
  level: "beginner" | "intermediate" | "advanced";
  avatar: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastStudyDate: string;
  completedLessons: string[];
  completedModules: string[];
  completedPaths: string[];
  weeklyXP: number[];
  totalMinutes: number;
  conversationSessions: number;
  pronunciationScore: number;
}

export interface AppSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  soundEffects: boolean;
  dailyGoalMinutes: number;
}

const KEYS = {
  USER_PROFILE: "@lingua_user_profile",
  USER_PROGRESS: "@lingua_user_progress",
  APP_SETTINGS: "@lingua_app_settings",
  ONBOARDING_DONE: "@lingua_onboarding_done",
};

const DEFAULT_PROFILE: UserProfile = {
  name: "Estudante",
  nativeLanguage: "Português",
  learningLanguages: ["Inglês"],
  level: "beginner",
  avatar: "👤",
};

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  lastStudyDate: "",
  completedLessons: [],
  completedModules: [],
  completedPaths: [],
  weeklyXP: [0, 0, 0, 0, 0, 0, 0],
  totalMinutes: 0,
  conversationSessions: 0,
  pronunciationScore: 0,
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  notifications: true,
  soundEffects: true,
  dailyGoalMinutes: 15,
};

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
}

export async function getUserProgress(): Promise<UserProgress> {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
    if (!data) return DEFAULT_PROGRESS;
    const progress = JSON.parse(data) as UserProgress;
    // Update streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (progress.lastStudyDate !== today && progress.lastStudyDate !== yesterday) {
      progress.streak = 0;
    }
    return progress;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveUserProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
}

export async function addXP(amount: number): Promise<UserProgress> {
  const progress = await getUserProgress();
  const today = new Date().toDateString();
  const dayOfWeek = new Date().getDay();
  progress.xp += amount;
  progress.weeklyXP[dayOfWeek] = (progress.weeklyXP[dayOfWeek] || 0) + amount;
  if (progress.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (progress.lastStudyDate === yesterday) {
      progress.streak += 1;
    } else {
      progress.streak = 1;
    }
    progress.lastStudyDate = today;
  }
  await saveUserProgress(progress);
  return progress;
}

export async function completeLesson(lessonId: string, xpAmount: number = 20): Promise<UserProgress> {
  const progress = await getUserProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  return addXP(xpAmount);
}

export async function getAppSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(KEYS.APP_SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.APP_SETTINGS, JSON.stringify(settings));
}

export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.ONBOARDING_DONE);
  return val === "true";
}

export async function setOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDING_DONE, "true");
}
