# Working in this repository (Claude and other agents)

This repo publishes the privacy policies for the owner's Apple apps on GitHub Pages:
`https://n05124.github.io/privacy-policies/<Folder>/`. Agent Forge uses it as the default home for every app's
privacy policy.

## Ground rules

- **Pushing to `main` publishes.** The repo is public, and Pages serves `main` within a minute or two. Work on a
  branch (`policy/<app>`) and open a pull request. Merge, or push to `main`, only after the owner has approved the
  exact text.
- **Describe what the app really does.** Before writing, read the app's repository: Info.plist usage strings,
  `PrivacyInfo.xcprivacy`, entitlements (iCloud/CloudKit, App Groups), network code and third-party SDKs, in-app
  purchases, analytics and crash reporting, plus the App Store privacy-label draft if there is one. Never claim a
  behaviour the code doesn't have, and never leave out one it has. If something is unclear, ask the owner; don't
  guess.
- **No email addresses.** Never publish the owner's or any personal email address, and no `mailto:` links. Contact goes
  through the filtered contact form once it exists; until then the Contact section says "Contact details for questions
  about this policy will be published here."
- **Keep secrets out.** No keys, tokens, internal
  hostnames, server IPs or personal details.
- **Keep URLs stable.** Never rename or move an existing folder. App Store Connect and the apps link to it.
- **No Python on the owner's Mac.** `scripts/build_catalog.py` runs in GitHub Actions on every push to `main`. To run
  it yourself, use a container (see "Catalog" below).
- **Undo only two steps back.** Never undo more than the last two commits (`git revert --no-edit HEAD` or `HEAD~1`).
  No force-push and no history rewrites.

## Add a policy for a new app

1. Copy `Docs_to_Wallet_Privacy_Policy/` to `<App_Name>_Privacy_Policy/`. Use underscores and the same style, for
   example `Gear_Studio_Privacy_Policy/`.
2. In `policy.json`, set:
   - `title`: the app's display name
   - `summary`: one sentence for the home-page card
   - `updated`: today, written like `October 14, 2026`
   - `symbol`: one of `wallet`, `ticket`, `lock` or `doc`
3. In `index.html`, change every app-specific part:
   - `<title>` (it becomes the document's tab name) and the meta description
   - `data-folder` on `<body>`: the folder name
   - the `<h1>` and the "Privacy Policy · Updated …" line
   - the article itself
4. Keep the section structure. Every policy needs these sections; App Review guideline 5.1.1(i) expects a clear policy:
   - what the app collects (or that it collects nothing) and where it stays (on device, iCloud/CloudKit in the
     user's own account, a server)
   - why it is used
   - sharing and third parties (Apple services, payment, any SDK)
   - retention and deletion, and how the user deletes their data
   - the user's choices and rights
   - children, if relevant
   - **Changes**, which also states the current version date
   - **Contact**
5. Check the page locally by opening `index.html` in a browser. Links are relative (`../assets/…`) and the back link
   goes to `../`.
6. Open a pull request titled `Add the <App> privacy policy`. The description lists:
   - the app's data use you checked
   - the URL the policy will have
   - where it goes in the app and in App Store Connect

## Update a policy (behaviour changed)

1. Change the affected sections only. Don't rewrite the parts that are still true.
2. Set the new date in three places:
   - `updated` in `policy.json`
   - the "Updated …" line under the `<h1>`
   - the current-version sentence in the **Changes** section
3. In **Changes**, add one line saying what changed and when, for example
   `October 14, 2026: Added iCloud sync of designs.`
4. Open a pull request titled `Update the <App> privacy policy: <what changed>`.
5. If the change also affects the App Store privacy label, say so in the pull request. The owner updates the label in
   App Store Connect.

## Patch a policy (no change in meaning)

Use this for typos, wording, formatting and broken links. Don't change the dates or the Changes section. Use a short
pull request titled `Fix <what> in the <App> privacy policy`.

## Extra documents

Any further `.html` file in a policy folder becomes another tab in that policy's segmented control, for example
`terms.html` or `support.html`. Give it a `<title>`, which becomes the tab's label. Use the same header and stylesheet
links as `index.html`.

## Catalog

`catalog.json` drives the home page. It is rebuilt from the folders by `.github/workflows/catalog.yml` on every push to
`main`, so you don't have to touch it. To refresh it inside a pull request, run the script in a container, never on
the owner's Mac:

```
docker run --rm -v "$PWD":/w -w /w python:3.12-slim python3 scripts/build_catalog.py
```

## After the owner merges

- The policy is live at `https://n05124.github.io/privacy-policies/<Folder>/`.
- Agents link it from the app's About/Settings screen.
- The owner enters it as the Privacy Policy URL in App Store Connect.
- In Agent Forge, mark the "privacy policy" production step done with that URL.
