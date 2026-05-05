import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { WebView } from "react-native-webview";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getUserProgress, saveUserProgress } from "@/lib/store";
import * as Haptics from "expo-haptics";
import { useKeepAwake } from "expo-keep-awake";

export default function JitsiScreen() {
  const { roomId, partnerName } = useLocalSearchParams<{ roomId: string; partnerName?: string }>();
  const colors = useColors();
  const [sessionTime, setSessionTime] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const webviewRef = useRef<WebView | null>(null);

  useKeepAwake();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSessionTime((t) => t + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setShowRating(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSubmitRating = async () => {
    const progress = await getUserProgress();
    progress.conversationSessions += 1;
    progress.totalMinutes += Math.floor(sessionTime / 60);
    await saveUserProgress(progress);
    router.back();
  };

  const toggleMic = () => {
    setMicEnabled((v) => !v);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Send message to Jitsi WebView
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        try {
          window.JitsiMeetExternalAPI && window.JitsiMeetExternalAPI.executeCommand('toggleAudio');
        } catch(e) {}
        true;
      `);
    }
  };

  const toggleCam = () => {
    setCamEnabled((v) => !v);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        try {
          window.JitsiMeetExternalAPI && window.JitsiMeetExternalAPI.executeCommand('toggleVideo');
        } catch(e) {}
        true;
      `);
    }
  };

  // Jitsi Meet HTML with embedded API
  const jitsiHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0D1117; overflow: hidden; }
    #jitsi-container { width: 100vw; height: 100vh; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <div id="jitsi-container"></div>
  <script src="https://meet.jit.si/external_api.js"></script>
  <script>
    const domain = 'meet.jit.si';
    const options = {
      roomName: '${roomId}',
      width: '100%',
      height: '100%',
      parentNode: document.querySelector('#jitsi-container'),
      lang: 'pt',
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        toolbarButtons: [],
        hideConferenceTimer: false,
        disableInviteFunctions: true,
        enableWelcomePage: false,
        enableClosePage: false,
        disableThirdPartyRequests: false,
        analytics: { disabled: true },
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: '',
        SHOW_POWERED_BY: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        DISPLAY_WELCOME_FOOTER: false,
        MOBILE_APP_PROMO: false,
        HIDE_INVITE_MORE_HEADER: true,
        filmStripOnly: false,
      },
      userInfo: {
        displayName: 'LinguaConnect User',
      },
    };
    try {
      const api = new JitsiMeetExternalAPI(domain, options);
      window.JitsiMeetExternalAPI = api;
      api.addEventListeners({
        videoConferenceJoined: () => {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'joined' }));
        },
        videoConferenceLeft: () => {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'left' }));
        },
        participantJoined: (e) => {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'participantJoined', data: e }));
        },
      });
    } catch(e) {
      document.body.innerHTML = '<div style="color:white;padding:20px;text-align:center;margin-top:40vh"><h2>Conectando ao Jitsi Meet...</h2><p style="margin-top:12px;opacity:0.7">Aguarde um momento</p></div>';
    }
  </script>
</body>
</html>
  `;

  if (showRating) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <View style={styles.ratingContainer}>
          <Text style={{ fontSize: 60 }}>👏</Text>
          <Text style={[styles.ratingTitle, { color: colors.foreground }]}>Sessão Concluída!</Text>
          <Text style={[styles.ratingTime, { color: "#4169E1" }]}>⏱ {formatTime(sessionTime)}</Text>
          <Text style={[styles.ratingQuestion, { color: colors.muted }]}>
            Como foi sua conversa{partnerName ? ` com ${partnerName}` : ""}?
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)}>
                <Text style={[styles.star, { opacity: star <= rating ? 1 : 0.3 }]}>⭐</Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.sessionStats, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.sessionStat}>
              <Text style={[styles.sessionStatValue, { color: "#4169E1" }]}>{formatTime(sessionTime)}</Text>
              <Text style={[styles.sessionStatLabel, { color: colors.muted }]}>Duração</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.sessionStat}>
              <Text style={[styles.sessionStatValue, { color: "#10B981" }]}>+{Math.max(10, Math.floor(sessionTime / 6))} XP</Text>
              <Text style={[styles.sessionStatLabel, { color: colors.muted }]}>Ganhos</Text>
            </View>
          </View>
          <Pressable
            style={[styles.doneBtn, { opacity: rating === 0 ? 0.5 : 1 }]}
            onPress={handleSubmitRating}
            disabled={rating === 0}
          >
            <Text style={styles.doneBtnText}>Concluir Sessão</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.container}>
      {/* Jitsi WebView */}
      {Platform.OS !== "web" ? (
        <WebView
          ref={webviewRef}
          source={{ html: jitsiHtml }}
          style={styles.webview}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          onLoadEnd={() => setLoading(false)}
          onMessage={(event: any) => {
            try {
              const msg = JSON.parse(event.nativeEvent.data);
              if (msg.type === "joined") setLoading(false);
            } catch {}
          }}
          originWhitelist={["*"]}
        />
      ) : (
        // Web fallback: iframe
        <View style={styles.webview}>
          <iframe
            src={`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&config.toolbarButtons=[]&interfaceConfig.SHOW_JITSI_WATERMARK=false`}
            style={{ width: "100%", height: "100%", border: "none" }}
            allow="camera; microphone; fullscreen; display-capture"
            title="Jitsi Meet"
          />
        </View>
      )}

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <Text style={{ fontSize: 40 }}>🎥</Text>
          <Text style={styles.loadingText}>Conectando ao Jitsi Meet...</Text>
          <Text style={styles.loadingRoom}>Sala: {roomId?.substring(0, 20)}</Text>
        </View>
      )}

      {/* Controls overlay */}
      <View style={styles.controls}>
        {/* Timer */}
        <View style={styles.timerBadge}>
          <Text style={styles.timerText}>⏱ {formatTime(sessionTime)}</Text>
        </View>

        {/* Partner info */}
        {partnerName && (
          <View style={styles.partnerBadge}>
            <Text style={styles.partnerBadgeText}>👤 {partnerName}</Text>
          </View>
        )}

        {/* Control buttons */}
        <View style={styles.controlButtons}>
          <Pressable
            style={[styles.controlBtn, { backgroundColor: micEnabled ? "rgba(255,255,255,0.2)" : "#EF4444" }]}
            onPress={toggleMic}
          >
            <Text style={styles.controlBtnIcon}>{micEnabled ? "🎤" : "🔇"}</Text>
          </Pressable>
          <Pressable
            style={[styles.endBtn]}
            onPress={handleEndCall}
          >
            <Text style={styles.endBtnIcon}>📵</Text>
          </Pressable>
          <Pressable
            style={[styles.controlBtn, { backgroundColor: camEnabled ? "rgba(255,255,255,0.2)" : "#EF4444" }]}
            onPress={toggleCam}
          >
            <Text style={styles.controlBtnIcon}>{camEnabled ? "📹" : "📷"}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  webview: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#0D1117",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingRoom: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    gap: 12,
  },
  timerBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  partnerBadge: {
    backgroundColor: "rgba(65,105,225,0.8)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
  },
  partnerBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  controlButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  controlBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  controlBtnIcon: {
    fontSize: 22,
  },
  endBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  endBtnIcon: {
    fontSize: 26,
  },
  // Rating screen
  ratingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  ratingTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  ratingTime: {
    fontSize: 22,
    fontWeight: "700",
  },
  ratingQuestion: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  stars: {
    flexDirection: "row",
    gap: 8,
  },
  star: {
    fontSize: 36,
  },
  sessionStats: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  sessionStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  sessionStatValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  sessionStatLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  doneBtn: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
