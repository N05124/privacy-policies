# Privacy policies

Public privacy policies for Apple apps, published with GitHub Pages.

The home page and the tab bar read `catalog.json`. That file is produced from folders at the root of this repository. Adding a policy means adding a folder. The page layout stays the same.

## Add a policy

1. Create a folder, for example `Another_App_Privacy_Policy/`.
2. Add `policy.json`:

```json
{
  "title": "Another App",
  "summary": "One sentence for the card on the home page.",
  "updated": "September 29, 2026",
  "symbol": "doc"
}
```

`symbol` may be `wallet`, `ticket`, `lock`, or `doc`.

3. Add `index.html` for the policy. Further `.html` files in the same folder become extra documents in that policy’s segmented control.
4. Run `python3 scripts/build_catalog.py` and commit `catalog.json` with the folder.

A push to `main` also rebuilds `catalog.json` when the committed catalog is behind the folders.

## Pages

GitHub Pages serves this repository from the `main` branch. Use the Docs2Wallet document as the privacy policy URL in App Store Connect:

`https://n05124.github.io/privacy-policies/Docs_to_Wallet_Privacy_Policy/`

## For agents

Claude, Cursor and Agent Forge agents follow [CLAUDE.md](CLAUDE.md) to add, update or patch a policy.
