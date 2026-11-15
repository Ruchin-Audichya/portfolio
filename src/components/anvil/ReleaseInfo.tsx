"use client";

import { useEffect, useState } from "react";
import { ANVIL } from "@/lib/anvil";

type Release = {
  version: string;
  sizeBytes: number | null;
  sha256: string | null;
  notesUrl: string;
  /** True once the numbers came from GitHub rather than the built-in fallback. */
  live: boolean;
};

const FALLBACK: Release = {
  version: ANVIL.fallback.version,
  sizeBytes: ANVIL.fallback.sizeBytes,
  sha256: ANVIL.fallback.sha256,
  notesUrl: ANVIL.fallback.notesUrl,
  live: false,
};

type GitHubAsset = { name: string; size: number; digest?: string | null };
type GitHubRelease = { tag_name: string; html_url: string; body?: string | null; assets: GitHubAsset[] };

/** File SHA-256 for a release: the asset digest GitHub computes, else the "| SHA-256 | `…` |" row of the notes. */
function sha256Of(release: GitHubRelease, asset: GitHubAsset): string | null {
  if (asset.digest?.startsWith("sha256:")) return asset.digest.slice("sha256:".length).toLowerCase();
  const row = release.body?.match(/\|\s*SHA-256\s*\|\s*`([0-9a-f]{64})`/i);
  return row ? row[1].toLowerCase() : null;
}

function formatSize(bytes: number) {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

/**
 * Version, size and SHA-256 of the APK that the Download button actually serves
 * (GitHub's latest release). Falls back to the built-in 0.5.0 values if GitHub can't be reached.
 */
export function ReleaseInfo() {
  const [release, setRelease] = useState<Release>(FALLBACK);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(ANVIL.latestApi, { headers: { Accept: "application/vnd.github+json" }, signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<GitHubRelease>) : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((rel) => {
        const asset = rel.assets.find((a) => a.name === ANVIL.assetName);
        if (!asset) throw new Error("no Anvil.apk in the latest release");
        setRelease({
          version: rel.tag_name.replace(/^v/, ""),
          sizeBytes: asset.size,
          sha256: sha256Of(rel, asset),
          notesUrl: rel.html_url,
          live: true,
        });
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => ctrl.abort();
  }, []);

  const copy = async () => {
    if (!release.sha256) return;
    try {
      await navigator.clipboard.writeText(release.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: the hash is selectable text anyway */
    }
  };

  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-8" aria-live="polite">
      <div className="contents">
        <dt className="label pt-1">Version</dt>
        <dd className="font-mono text-ink">
          {release.version}
          <a href={release.notesUrl} target="_blank" rel="noopener" className="link ml-3 font-sans text-ink2">
            Release notes
          </a>
        </dd>
      </div>
      <div className="contents">
        <dt className="label pt-1">Size</dt>
        <dd className="font-mono text-ink">
          {release.sizeBytes ? formatSize(release.sizeBytes) : "—"} · Android 8.0+
        </dd>
      </div>
      <div className="contents">
        <dt className="label pt-1">SHA-256</dt>
        <dd className="min-w-0">
          {release.sha256 ? (
            <div className="flex flex-wrap items-start gap-3">
              <code className="min-w-0 break-all font-mono text-[0.8125rem] leading-relaxed text-ink2">{release.sha256}</code>
              <button type="button" onClick={copy} className="btn btn-ghost h-8 px-3 text-xs">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          ) : (
            <span className="text-ink3">Listed in the release notes.</span>
          )}
        </dd>
      </div>
    </dl>
  );
}
