/** Everything the /anvil download page links to, in one place. */
const REPO = "https://github.com/Ruchin-Audichya/anvil-usb";

export const ANVIL = {
  repo: REPO,
  /** Always the newest published release, so the page never goes stale. */
  apkUrl: `${REPO}/releases/latest/download/Anvil.apk`,
  assetName: "Anvil.apk",
  latestApi: "https://api.github.com/repos/Ruchin-Audichya/anvil-usb/releases/latest",
  releases: `${REPO}/releases`,
  issues: `${REPO}/issues`,
  privacy: `${REPO}/blob/main/docs/PRIVACY.md`,
  /** Shown until (or if) the GitHub API answers. */
  fallback: {
    version: "0.5.0",
    sizeBytes: 16_709_620,
    sha256: "7452e25a8c1407591c984ac8305120d09419b58170d7ca609b20946624b3244f",
    notesUrl: `${REPO}/releases/tag/v0.5.0`,
  },
} as const;
