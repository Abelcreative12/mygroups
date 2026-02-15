import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle, Users, ExternalLink, CheckCircle } from "lucide-react";

const GROUP_MAP: Record<string, { name: string; link: string; invite: string }> = {
  "group-1": { name: "Group 1", link: "https://chat.whatsapp.com/K9uh2cK4YYBCwmOYfJOpQ4", invite: "C3V8oWYifKmH12eBlb3bRd" },
  "group-2": { name: "Group 2", link: "https://chat.whatsapp.com/Ekd8b4W3kiVFAaNyBquQyb", invite: "DrREfy1YHvgHuQoXbvdW8M" },
  "group-3": { name: "Group 3", link: "https://chat.whatsapp.com/BTt1r1u4uBOGTztZkMer0Z", invite: "CEjx5pFax748g7bxkf3irZ" },
  "group-4": { name: "Group 4", link: "https://chat.whatsapp.com/I1xggy39yi25RmUUogGsOT", invite: "Ctcb24OtZsp1GXsvBB5Irb" },
};

const isInAppBrowser = () => {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line|Twitter|MicroMessenger|Snapchat/i.test(ua);
};

const JoinGroup = () => {
  const { slug } = useParams<{ slug: string }>();
  const [redirecting, setRedirecting] = useState(false);

  const group = useMemo(() => (slug ? GROUP_MAP[slug] : undefined), [slug]);

  const redirectToWhatsApp = () => {
    if (!group) return;
    setRedirecting(true);

    const ua = navigator.userAgent || "";
    const isAndroid = /android/i.test(ua);
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const inApp = isInAppBrowser();

    if (inApp && isAndroid) {
      const systemBrowserUrl = `intent://${window.location.host}/${slug}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
      window.location.href = systemBrowserUrl;
      return;
    }

    if (inApp && isIOS) {
      window.open(group.link, "_blank", "noopener,noreferrer");
      return;
    }

    if (isAndroid) {
      window.location.href = `intent://chat.whatsapp.com/${group.invite}#Intent;scheme=https;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(group.link)};end`;
    } else if (isIOS) {
      window.location.href = group.link;
    } else {
      window.open(group.link, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    if (!group) return;
    const timer = setTimeout(() => redirectToWhatsApp(), 1200);
    return () => clearTimeout(timer);
  }, [group]);

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <p className="text-muted-foreground">Group not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MessageCircle className="h-10 w-10 text-primary" strokeWidth={2.2} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Join {group.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tap the button below to join the community
          </p>
        </div>

        <div className="space-y-3 text-left">
          {["Community updates", "Exclusive content", "Direct support"].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-secondary-foreground">
              <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={redirectToWhatsApp}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98] hover:brightness-110"
        >
          {redirecting ? (
            <>
              <ExternalLink className="h-5 w-5 animate-pulse" />
              Opening WhatsApp…
            </>
          ) : (
            <>
              <Users className="h-5 w-5" />
              Join Group Now
            </>
          )}
        </button>

        <p className="text-xs text-muted-foreground">
          Free to join · You can leave anytime
        </p>
      </div>
    </div>
  );
};

export default JoinGroup;
