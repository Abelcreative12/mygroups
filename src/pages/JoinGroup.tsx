import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Copy, Check, ArrowRight, Users, Zap, Shield, Gift, ExternalLink } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Stat {
  value: string;
  label: string;
}

interface GroupInfo {
  name: string;
  subtitle: string;
  link: string;
  invite: string;
  features: Feature[];
  stats: Stat[];
}

// ─── Detect Facebook / Instagram in-app browser ───────────────────────────
const isInAppBrowser = (): boolean => {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger|Snapchat/i.test(ua);
};

const isAndroid = (): boolean => /android/i.test(navigator.userAgent || "");
const isIOS = (): boolean =>
  /iphone|ipad|ipod/i.test(navigator.userAgent || "");

// ─── Group data ───────────────────────────────────────────────────────────
const makeFeatures = (): Feature[] => [
  {
    title: "Real-Time Predictions",
    description: "Instant notifications before each round — be first to act.",
    icon: <Zap className="h-3.5 w-3.5" />,
  },
  {
    title: "Expert Analysis",
    description: "Detailed pattern breakdowns from seasoned analysts.",
    icon: <Shield className="h-3.5 w-3.5" />,
  },
  {
    title: "Active Community",
    description: "2,000+ members sharing wins and strategies daily.",
    icon: <Users className="h-3.5 w-3.5" />,
  },
  {
    title: "100% Free Access",
    description: "No subscriptions, no hidden fees. Ever.",
    icon: <Gift className="h-3.5 w-3.5" />,
  },
];

const makeStats = (): Stat[] => [
  { value: "95%+", label: "Win Rate" },
  { value: "2,000+", label: "Members" },
  { value: "24/7", label: "Support" },
];

const GROUP_MAP: Record<string, GroupInfo> = {
  "group-1": {
    name: "VIP Predictions Group 1",
    subtitle: "Join 2,000+ winners getting free daily tips",
    link: "https://chat.whatsapp.com/K9uh2cK4YYBCwmOYfJOpQ4",
    invite: "K9uh2cK4YYBCwmOYfJOpQ4",
    features: makeFeatures(),
    stats: makeStats(),
  },
  "group-2": {
    name: "VIP Predictions Group 2",
    subtitle: "Join 2,000+ winners getting free daily tips",
    link: "https://chat.whatsapp.com/G1hbUID8NdMH9Ehsmq63JO",
    invite: "G1hbUID8NdMH9Ehsmq63JO",
    features: makeFeatures(),
    stats: makeStats(),
  },
  "group-3": {
    name: "VIP Predictions Group 3",
    subtitle: "Join 2,000+ winners getting free daily tips",
    link: "https://chat.whatsapp.com/BTt1r1u4uBOGTztZkMer0Z",
    invite: "BTt1r1u4uBOGTztZkMer0Z",
    features: makeFeatures(),
    stats: makeStats(),
  },
  "group-4": {
    name: "VIP Predictions Group 4",
    subtitle: "Join 2,000+ winners getting free daily tips",
    link: "https://chat.whatsapp.com/I1xggy39yi25RmUUogGsOT",
    invite: "I1xggy39yi25RmUUogGsOT",
    features: makeFeatures(),
    stats: makeStats(),
  },
};

// ─── Open WhatsApp link correctly per platform ────────────────────────────
const openWhatsApp = (group: GroupInfo) => {
  if (isAndroid()) {
    // Android intent with fallback to universal link
    window.location.href = `intent://chat.whatsapp.com/${group.invite}#Intent;scheme=https;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(group.link)};end`;
  } else {
    // iOS & Desktop — universal link handles routing natively
    window.location.href = group.link;
  }
};

// ─── Sub-components ───────────────────────────────────────────────────────
const FeatureItem = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="flex gap-3 text-left">
    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30">
      {icon}
    </div>
    <div className="space-y-0.5">
      <p className="text-sm font-semibold text-white leading-snug">{title}</p>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

// ─── In-App Browser Escape Screen ─────────────────────────────────────────
const InAppBrowserScreen = ({ group }: { group: GroupInfo }) => {
  const [copied, setCopied] = useState(false);
  const [autoCopied, setAutoCopied] = useState(false);

  // ── Auto-copy the link silently as soon as the screen appears ──────────
  useEffect(() => {
    navigator.clipboard.writeText(group.link).then(() => {
      setAutoCopied(true);
    }).catch(() => {
      // Clipboard write requires a user gesture on some browsers — silent fail
    });
  }, [group.link]);

  const copyLink = () => {
    navigator.clipboard.writeText(group.link).catch(() => {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = group.link;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // ── One-tap open: Android intent bypasses Facebook's in-app browser ────
  const handleOpenDirect = () => {
    if (isAndroid()) {
      // intent:// scheme opens WhatsApp directly; Chrome is the fallback
      window.location.href = `intent://chat.whatsapp.com/${group.invite}#Intent;scheme=https;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(group.link)};end`;
    } else {
      // iOS — universal link; WhatsApp intercepts it if installed
      window.location.href = group.link;
    }
  };

  const menuLabel = isIOS() ? "⋯ menu (bottom)" : "⋮ menu (top-right)";
  const openLabel = isIOS() ? "**Open in Safari**" : "**Open in Chrome** or **Open in browser**";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-8">
      <div className="w-full max-w-md space-y-4">

        {/* ── Auto-copied badge ── */}
        <div
          className={`flex items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-500 ${
            autoCopied
              ? "border-emerald-500/30 bg-emerald-500/10 opacity-100"
              : "border-white/5 bg-white/5 opacity-40"
          }`}
        >
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">
            {autoCopied ? "Link auto-copied to clipboard ✓" : "Copying link…"}
          </span>
        </div>

        {/* ── Main card ── */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />

          <div className="flex flex-col items-center text-center space-y-5">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-500/30 text-3xl">
              🚀
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-extrabold text-white tracking-tight uppercase">
                Join VIP Aviator Predictor Group
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                You're one tap away from unlocking daily winning predictions! Tap the button below to open your exclusive invite directly in WhatsApp.
              </p>
            </div>

            {/* ── Primary CTA: one tap to open ── */}
            <button
              id="open-whatsapp-direct-btn"
              onClick={handleOpenDirect}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-95"
            >
              <ExternalLink className="h-5 w-5" />
              Open in WhatsApp
            </button>

            {/* ── Divider ── */}
            <div className="flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[11px] text-slate-500">or do it manually</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* ── Simplified 2-step fallback ── */}
            <div className="w-full space-y-3 text-left">
              <Step number={1} text={`Tap the ${menuLabel} → ${openLabel}`} />
              <Step
                number={2}
                text={
                  autoCopied
                    ? "Your link is already copied — just paste it in the address bar"
                    : "Paste the link (copied above) in the address bar"
                }
              />
            </div>
          </div>
        </div>

        {/* ── Copy link card ── */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              Your VIP Link
            </p>
            {autoCopied && (
              <span className="text-[10px] font-semibold text-emerald-400">✓ Already copied</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <p className="flex-1 truncate font-mono text-xs text-emerald-400 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
              {group.link}
            </p>
            <button
              id="copy-link-btn"
              onClick={copyLink}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reassurance */}
        <p className="text-center text-xs text-slate-600">
          🔒 Free · No spam · You can leave anytime
        </p>
      </div>
    </div>
  );
};

const Step = ({ number, text }: { number: number; text: string }) => (
  <div className="flex gap-3 items-start">
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-slate-950">
      {number}
    </span>
    <p
      className="text-sm text-slate-300 leading-snug pt-0.5"
      dangerouslySetInnerHTML={{
        __html: text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }}
    />
  </div>
);

// ─── Main Join Page ────────────────────────────────────────────────────────
const JoinGroup = () => {
  const { slug } = useParams<{ slug: string }>();
  const group = useMemo(() => (slug ? GROUP_MAP[slug] : undefined), [slug]);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const inApp = useMemo(() => isInAppBrowser(), []);

  // ── Auto-redirect users who arrive via a real browser ──────────────────
  useEffect(() => {
    if (!group || inApp) return;

    // Give the page 800ms to paint so user sees the brand, then redirect
    const timer = setTimeout(() => {
      openWhatsApp(group);
    }, 800);

    return () => clearTimeout(timer);
  }, [group, inApp]);

  // ── If inside Facebook/Instagram in-app browser, show escape screen ────
  if (group && inApp) {
    return <InAppBrowserScreen group={group} />;
  }

  const handleJoin = () => {
    if (!group) return;
    setJoining(true);
    openWhatsApp(group);
    setTimeout(() => setJoining(false), 3000);
  };

  const copyInviteLink = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-6 text-center shadow-2xl">
          <p className="text-sm font-medium text-red-400">404 – Not Found</p>
          <h2 className="text-xl font-semibold text-white mt-1">
            Group not found
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            The invite link might be invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-8 md:py-12">
      <div className="w-full max-w-md space-y-5" id="redirect-container">

        {/* Auto-redirect notice */}
        {!inApp && (
          <div className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-emerald-400">
              Opening WhatsApp automatically…
            </span>
          </div>
        )}

        {/* Glassmorphic card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-xl">

          {/* Ambient glow */}
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-emerald-600/15 blur-3xl animate-pulse pointer-events-none" />

          <div className="flex flex-col items-center space-y-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Exclusive VIP Invite
              </span>
            </div>

            {/* Headline */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                {group.name}
              </h1>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                {group.subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 w-full bg-white/5 border border-white/10 rounded-2xl p-4">
              {group.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5 text-center">
                  <p className="text-xl font-extrabold text-emerald-400 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Features */}
            <div className="w-full space-y-4 pt-1">
              {group.features.map((feature, idx) => (
                <FeatureItem key={idx} {...feature} />
              ))}
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* CTA */}
            <div className="w-full space-y-3">
              <button
                id="join-group-btn"
                onClick={handleJoin}
                disabled={joining}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:scale-[1.02] hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {joining ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    Opening WhatsApp…
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5" />
                    Join the VIP Group Now
                  </>
                )}
              </button>

              <p
                className="text-center text-xs text-slate-500 font-medium"
                id="redirect-status"
              >
                🔒 Free to join · No spam · Leave anytime
              </p>
            </div>

            {/* Copy link fallback */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate-500 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
              <span>
                Invite code:{" "}
                <span className="font-mono text-slate-400">{group.invite}</span>
              </span>
              <button
                onClick={copyInviteLink}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700">
          Auto-redirect active · WhatsApp Universal Link
        </p>
      </div>
    </div>
  );
};

export default JoinGroup;
