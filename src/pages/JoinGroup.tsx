import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, Copy, Check } from "lucide-react";

interface Feature {
  title: string;
  description: string;
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

const GROUP_MAP: Record<string, GroupInfo> = {
  "group-1": { 
    name: "VIP Group 1", 
    subtitle: "You're one step away from winning!",
    link: "https://chat.whatsapp.com/K9uh2cK4YYBCwmOYfJOpQ4", 
    invite: "K9uh2cK4YYBCwmOYfJOpQ4",
    features: [
      { title: "Real-Time Predictions", description: "Get instant notifications for high-probability wins" },
      { title: "Expert Analysis", description: "Detailed breakdowns of patterns and strategies" },
      { title: "Active Community", description: "Share wins and learn from experienced members" },
      { title: "100% Free Access", description: "No subscriptions, no hidden fees, completely free" }
    ],
    stats: [
      { value: "95%+", label: "Win Rate" },
      { value: "2000+", label: "Active Members" },
      { value: "24/7", label: "Support" }
    ]
  },
  "group-2": { 
    name: "VIP Group 2", 
    subtitle: "You're one step away from winning!",
    link: "https://chat.whatsapp.com/G1hbUID8NdMH9Ehsmq63JO", 
    invite: "G1hbUID8NdMH9Ehsmq63JO",
    features: [
      { title: "Real-Time Predictions", description: "Get instant notifications for high-probability wins" },
      { title: "Expert Analysis", description: "Detailed breakdowns of patterns and strategies" },
      { title: "Active Community", description: "Share wins and learn from experienced members" },
      { title: "100% Free Access", description: "No subscriptions, no hidden fees, completely free" }
    ],
    stats: [
      { value: "95%+", label: "Win Rate" },
      { value: "2000+", label: "Active Members" },
      { value: "24/7", label: "Support" }
    ]
  },
  "group-3": { 
    name: "VIP Group 3", 
    subtitle: "You're one step away from winning!",
    link: "https://chat.whatsapp.com/BTt1r1u4uBOGTztZkMer0Z", 
    invite: "BTt1r1u4uBOGTztZkMer0Z",
    features: [
      { title: "Real-Time Predictions", description: "Get instant notifications for high-probability wins" },
      { title: "Expert Analysis", description: "Detailed breakdowns of patterns and strategies" },
      { title: "Active Community", description: "Share wins and learn from experienced members" },
      { title: "100% Free Access", description: "No subscriptions, no hidden fees, completely free" }
    ],
    stats: [
      { value: "95%+", label: "Win Rate" },
      { value: "2000+", label: "Active Members" },
      { value: "24/7", label: "Support" }
    ]
  },
  "group-4": { 
    name: "VIP Group 4", 
    subtitle: "You're one step away from winning!",
    link: "https://chat.whatsapp.com/I1xggy39yi25RmUUogGsOT", 
    invite: "I1xggy39yi25RmUUogGsOT",
    features: [
      { title: "Real-Time Predictions", description: "Get instant notifications for high-probability wins" },
      { title: "Expert Analysis", description: "Detailed breakdowns of patterns and strategies" },
      { title: "Active Community", description: "Share wins and learn from experienced members" },
      { title: "100% Free Access", description: "No subscriptions, no hidden fees, completely free" }
    ],
    stats: [
      { value: "95%+", label: "Win Rate" },
      { value: "2000+", label: "Active Members" },
      { value: "24/7", label: "Support" }
    ]
  },
};

const isInAppBrowser = () => {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger|Snapchat/i.test(ua);
};

const FeatureItem = ({ title, description }: { title: string; description: string }) => (
  <div className="flex gap-3.5 text-left">
    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
      <Check className="h-3 w-3" strokeWidth={3} />
    </div>
    <div className="space-y-0.5">
      <p className="font-semibold text-sm text-white leading-none">{title}</p>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

const JoinGroup = () => {
  const { slug } = useParams<{ slug: string }>();
  const group = useMemo(() => (slug ? GROUP_MAP[slug] : undefined), [slug]);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleJoin = () => {
    if (!group || !slug) return;
    setJoining(true);

    // Detect platform
    const ua = navigator.userAgent || "";
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const inApp = isInAppBrowser();

    if (inApp && isAndroid) {
      // Escape from in-app browser to system browser first
      window.location.replace(`intent://${window.location.host}/${slug}#Intent;scheme=https;action=android.intent.action.VIEW;end`);
      setTimeout(() => setJoining(false), 2000);
      return;
    }

    if (isAndroid) {
      // Target WhatsApp scheme via Android intent without explicit package
      // This prompts the native chooser dialog if multiple WhatsApp apps are installed
      window.location.replace(
        `intent://chat.whatsapp.com/${group.invite}#Intent;scheme=https;S.browser_fallback_url=${encodeURIComponent(group.link)};end`
      );
    } else {
      // iOS or Desktop – universal link handles routing natively
      window.location.replace(group.link);
    }

    setTimeout(() => setJoining(false), 2000);
  };

  const copyInviteLink = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 px-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-8 py-6 text-center shadow-2xl">
          <p className="text-sm font-medium text-emerald-400">Error</p>
          <h2 className="text-xl font-semibold text-white mt-1">Group not found</h2>
          <p className="text-sm text-slate-400 mt-2">The invite link might be invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-8 md:py-12">
      <div className="w-full max-w-md space-y-6" id="redirect-container">
        
        {/* Glassmorphic card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-xl transition-all duration-300">
          
          {/* Pulsing glow background effects */}
          <div className="absolute -left-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-emerald-600/20 blur-3xl animate-pulse" />

          <div className="flex flex-col items-center space-y-6">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Exclusive Invite</span>
            </div>

            {/* Title & Headline */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
                {group.name}
              </h1>
              <p className="text-sm text-slate-300 font-medium">
                {group.subtitle}
              </p>
            </div>

            {/* Stats Summary Panel */}
            <div className="grid grid-cols-3 gap-2 w-full bg-white/5 border border-white/10 rounded-2xl p-4">
              {group.stats.map((stat, idx) => (
                <div key={idx} className="space-y-0.5 text-center">
                  <p className="text-xl font-extrabold text-emerald-400 tracking-tight">{stat.value}</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 leading-none">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Dynamic Features List */}
            <div className="w-full space-y-4 pt-1">
              {group.features.map((feature, idx) => (
                <FeatureItem key={idx} title={feature.title} description={feature.description} />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Action Section */}
            <div className="w-full space-y-3">
              <button
                id="join-group-btn"
                onClick={handleJoin}
                disabled={joining}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {joining ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                    Opening WhatsApp...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-5 w-5" />
                    Join WhatsApp Group Now
                  </>
                )}
              </button>

              <p className="text-xs text-slate-400 font-medium" id="redirect-status">
                By joining, you'll be redirected to WhatsApp
              </p>
            </div>

            {/* Compact copy code panel */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate-500 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
              <span>Invite code: <span className="font-mono text-slate-400">{group.invite}</span></span>
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

        {/* Footer info */}
        <p className="text-xs text-slate-600">
          Universal Routing System · Auto account prompt enabled
        </p>
      </div>
    </div>
  );
};

export default JoinGroup;
