import { Link } from "react-router-dom";
import { MessageCircle, Users, Copy, Check } from "lucide-react";
import { useState } from "react";

const GROUPS = [
  { id: "1", name: "Group 1", slug: "group-1" },
  { id: "2", name: "Group 2", slug: "group-2" },
  { id: "3", name: "Group 3", slug: "group-3" },
  { id: "4", name: "Group 4", slug: "group-4" },
];

const Index = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const getFullLink = (slug: string) => `${window.location.origin}/${slug}`;

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(getFullLink(slug));
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MessageCircle className="h-10 w-10 text-primary" strokeWidth={2.2} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            WhatsApp Groups
          </h1>
          <p className="text-sm text-muted-foreground">
            Copy each link to use in your Facebook ads
          </p>
        </div>

        <div className="space-y-3">
          {GROUPS.map((group) => (
            <div
              key={group.id}
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm"
            >
              <Link
                to={`/${group.slug}`}
                className="flex flex-1 items-center gap-3 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all active:scale-[0.98] hover:brightness-110"
              >
                <Users className="h-5 w-5 shrink-0" />
                {group.name}
              </Link>
              <button
                onClick={() => copyLink(group.slug)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent"
                title="Copy link"
              >
                {copied === group.slug ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Each link redirects users to the WhatsApp group
        </p>
      </div>
    </div>
  );
};

export default Index;
