# Corsairs Pathway

A mobile-first Nottingham Corsairs U14 rugby development prototype. It includes a player profile, coach feedback, training and session logging, food guides, and pathway interest, dates and badges.

Use the **Player** and **Coach** buttons to try both views. The app starts with fictional players and saves changes in the current browser. Open both views in the same browser to see a coach's updates. Use fictional information when trying the demo.

The site is static. Serve the repository root with any static web server and open the printed local URL. GitHub Pages can publish the root of the main branch directly.

The coaching library is organised as Programmes → Sessions → Activities. Programmes contain ordered session snapshots; sessions can come from the reusable library or be created for a single programme. New activities can be saved for reuse. Coaches can duplicate, reorder and adapt sessions, then assign a programme to several fictional players. Assigned work is copied so later library edits preserve player logs and progress. Players open an assigned programme from Home or S&C, log each session and track completion.

Food topics support recipe cards with ingredients, steps, time, servings, allergens and an optional uploaded JPG, PNG or WebP photo. Images are resized in the browser. Coaches can edit recipes and remove photos or recipes. Storage errors leave the editor draft intact.

These library and recipe features are browser-local prototype data. They do not yet write to the separate Neon pilot, and do not sync between devices. Keep using fictional data in this public demo.

Coach **Setup** holds the shared skill library, editable core skills and position defaults. Names and descriptions can change without changing the internal skill key, preserving ratings and history. A player's **Rate skills** screen displays these configured groups as individual rating rows; additional skills can be added to that player. Each review stores a dated level and/or note, with optional praise and coach focus. Rating drafts stay separate per player and skill during the browser visit. Shared setup and ratings in this demo are also browser-local.
