# Spaced Repetition Software for Language Learning: State of the Field

Date: 2026-09-08

## Summary

Spaced repetition software in 2026 is defined by one clear shift: the fixed-formula SM-2 scheduler that dominated for three decades has been overtaken by trainable memory models, chiefly FSRS. FSRS-6 (21 parameters) is what Anki desktop, AnkiMobile, AnkiDroid, and RemNote ship today; FSRS-7 (34 parameters, fractional intervals, an 8-parameter forgetting curve) tops the open-spaced-repetition benchmark but has not shipped in a production Anki release as of the 26.09 betas [3][8][12]. SuperMemo answered in June 2026 with SuperMemo 20, which runs five schedulers in parallel (SM-20, SM-19, FSRS, SM-15, SM-2) and weights them by how well each predicts the user's recall [16]. On the app side, Anki remains the open-source hub for language learners because of its ecosystem: AnkiConnect, Yomitan, asbplayer, and Migaku turn browsing and video watching into "sentence mining," while commercial apps (Duolingo, Memrise, Quizlet, LingQ, Migaku, Readlang, WaniKani, Bunpro, jpdb, Clozemaster, Lingvist, Speakly) bundle spaced repetition into curated content, audio, and reading tools, increasingly with LLM features. The research base for spacing is strong (Cepeda et al. 2006; Nakata 2015), but the evidence that sentence cards beat word cards is weak, and Duolingo's own published model (half-life regression, 2016) is now far behind FSRS on the public benchmark [1][20][21][23].

## 1. Scheduling algorithms

### SM-2 (SuperMemo, 1987-1989)

SM-2 was developed by Piotr Wozniak between December 1987 and March 1989 and shipped in SuperMemo 1.0-3.0 [14]. Each item carries an "easiness factor" (EF) starting at 2.5 and never dropping below 1.3. The first interval is 1 day, the second 6 days, and each subsequent interval is the previous interval multiplied by EF. After each review the user gives a 0-5 grade q and EF is updated with EF' = EF + (0.1 - (5 - q)(0.08 + (5 - q)0.02)) [14]. SuperMemo's own page reports roughly 92% retention in practice with this scheme [14]. Anki's legacy scheduler is a variant of SM-2, and RemNote's default scheduler is explicitly labelled "Anki SM-2" [7][31].

### FSRS (Free Spaced Repetition Scheduler)

FSRS is an open-source, community-driven project (open-spaced-repetition on GitHub) that models each card with three variables: Difficulty (D, 1-10), Stability (S, the interval at which retrievability falls to 90%), and Retrievability (R, the probability of recall at time t). It uses a power-law forgetting curve rather than SM-2's exponential growth of intervals, and its parameters are fitted to each user's review history by an optimizer [2][3].

Version history, per the project's own wiki and benchmark README [2][3]:

- FSRS v3 (13 params): first public release, as an Anki custom-scheduling script.
- FSRS v4 (17 params): first version integrated into Anki; power-law forgetting curve.
- FSRS-4.5 (17 params): forgetting-curve shape changed.
- FSRS-5 (19 params): uses same-day review data for training.
- FSRS-6 (21 params): trainable decay parameter, so the flatness of the forgetting curve differs per user; improved same-day handling.
- FSRS-7 (34 params): designed for fractional interval lengths; the only version that gives realistic recall predictions for same-day reviews; forgetting curve now has 8 optimizable parameters. The benchmark README says that in Anki, FSRS-7 "should be shipped with both recency weighting and scheduling penalties enabled" [3].

How FSRS differs from SM-2 (per the FSRS wiki) [2]: difficulty has mean reversion rather than SM-2's linear EF adjustments, which avoids "ease hell"; it explicitly models the spacing effect with a convergence term so stability growth is bounded; and every constant is trainable rather than hand-picked.

Reference implementations: fsrs-rs (Rust, BSD-3-Clause, optimizer plus scheduler, bindings for C, Python, Node.js, Dart, PHP; Anki depends on it and bumps its version in release notes) [4][12]; py-fsrs (Python, MIT, 21-parameter model, optional optimizer that also computes optimal retention) [5]; ts-fsrs (TypeScript, MIT) [6]. The awesome-fsrs list also names ports in Go, Java, Scala, Swift, Clojure, Ruby, Kotlin, Elixir, OCaml, Lisp, and Haskell [6]. fsrs-rs releases in 2026 ran from v6.3.0 (June 4) to v6.6.2 (August 28) [4].

### Benchmark results (open-spaced-repetition/srs-benchmark)

The benchmark uses roughly 1.7 billion Anki reviews from 20,000 users, evaluated with a time-series split so no future data leaks into training. Metrics: log loss and RMSE(bins) for calibration, AUC for discrimination. The "without same-day reviews" table (about 350 million reviews from 9,999 collections) reports [3]:

| Algorithm | Params | Log loss | RMSE(bins) | AUC |
|---|---|---|---|---|
| RWKV-Instant (neural, not shippable) | large | 0.2773 | 0.0250 | 0.8329 |
| GRU (meta-learned) | - | 0.3328 | 0.0549 | 0.7324 |
| FSRS-7 recency | 34 | 0.3370 | 0.0593 | 0.7220 |
| FSRS-7 | 34 | 0.3401 | 0.0634 | 0.7167 |
| FSRS-6 | 21 | 0.3460 | 0.0653 | 0.7034 |
| FSRS-5 | 19 | 0.3561 | 0.0742 | 0.7010 |
| FSRS-4.5 | 17 | 0.3625 | 0.0764 | 0.6891 |
| FSRS-7 default params (no per-user fit) | 0 | 0.3620 | 0.0910 | 0.7029 |
| DASH | 9 | 0.3682 | 0.0838 | 0.6311 |
| AVG (constant baseline) | 0 | 0.3945 | 0.1034 | 0.4997 |
| ACT-R | 5 | 0.4033 | 0.1074 | 0.5225 |
| HLR (Duolingo half-life regression) | 3 | 0.4694 | 0.1275 | 0.6369 |
| Ebisu v2 | 0 | 0.4989 | 0.1627 | 0.6051 |

Note that Duolingo's HLR scores worse than a constant-average predictor on log loss on this Anki-derived dataset, and that FSRS-7 with default parameters already beats FSRS-4.5 with per-user fitting [3]. The README's script list mentions SM-2 as a benchmarkable algorithm but no SM-2 row appears in the current published tables I could retrieve; see gaps [3].

### Anki's default scheduler status

The Anki manual describes FSRS as something to "Enable ... under the 'FSRS' section, at the bottom of the deck options page," and notes it can only be enabled globally. The legacy SM-2-based scheduler remains the default; "Easy Days" works with both FSRS and legacy SM-2 [7]. The FSRS project's own list describes Anki as offering FSRS as an "opt-in feature replacing SM-2" [6]. Anki release notes show FSRS-6 landed in Anki 25.07 (July 4, 2025) and the fsrs-rs dependency was bumped to 6.6.1 in 26.08 and 6.6.2 in 26.09b2 [8][10][12]. In an Anki forum thread from June 2026, a moderator states FSRS-7 has neither been released by the open-spaced-repetition project nor submitted as an Anki pull request, so "Nothing can happen in Anki until at least those things have happened" [13].

### SuperMemo: SM-18, SM-19, SM-20

Per supermemo.guru (as summarized in search snippets; the page blocks direct fetches), Algorithm SM-18 (2019, SuperMemo 18) differs from SM-17 mainly in how item difficulty is computed: difficulty is no longer assumed constant and is estimated per repetition, which the author says is simpler to implement and cheaper than SM-17's hill-climbing [15]. SuperMemo 20 for Windows, sold by SuperMemo World for a one-time $68, describes an "Algorithm Arena" in which five algorithms run in parallel on the user's data and earn weight in proportion to predictive accuracy: SM-20 (machine learning, labelled "current champion"), SM-19 ("your memory condensed to 40,000 parameters"), FSRS ("Smart algorithm by Jarrett Ye"), SM-15, and SM-2 ("the engine behind Anki"). It adds PDF and EPUB import, YouTube in WebView, MathJax, AI explanations, and 64-bit builds; SM-20/FSRS optimization "may require supermemo.com API access" [16]. A search snippet attributes a June 29, 2026 release date and a reduction from 40,000 to about 40 parameters in SM-20 to supermemo.guru, which I could not open directly [15].

## 2. Major apps and their scheduling

### Anki family

- Anki desktop: current stable 26.08.1 (August 5, 2026); 26.09 betas b1 (Aug 25) and b2 (Sep 4, 2026). 26.05 (June 16, 2026) replaced the launcher with a standard installer, required three clicks to unlock FSRS parameter editing, batched memory-state calculation, and made per-deck desired retention apply in filtered decks. 26.08 added an experimental editor and Preferences > Experiments. 26.09b1 removed the legacy `anki.importing` and `anki.exporting` modules and warns "This affects the AnkiConnect add-on" [8][9][10][11][12]. Free on Windows/macOS/Linux; source on GitHub (the repo's license field is reported as NOASSERTION because it mixes AGPL and other components) [9][17].
- AnkiWeb: free sync and web review service; the Anki site lists it alongside the desktop and mobile clients [9].
- AnkiMobile (iOS): $24.99 one-time; App Store listing says it offers "The same SM2 and FSRS scheduling algorithms that the computer version of Anki uses"; version 25.07 added FSRS-6 [18].
- AnkiDroid (Android): free, GPL-3.0, developed by a separate volunteer community; 2.24.1 released August 31, 2026, 2.25 alphas in progress. Its changelog records FSRS-5 with the 24.11-based 2.20.0 (December 2024) and FSRS-6 with the 25.07.4-based 2.22.2 (July 2025) [17][19].

### SuperMemo

Windows-only commercial software; SuperMemo 20 ($68 one-time) with the five-algorithm arena described above; collections from SM16-SM19 open in SM20 [16]. Not open source.

### Duolingo

Duolingo's published scheduling model is half-life regression (HLR), from Settles and Meeder, "A Trainable Spaced Repetition Model for Language Learning," ACL 2016, pp. 1848-1858. The paper fits a word's memory half-life from features, reports "reducing error by 45%+ compared to several baselines," and reports a 12% improvement in daily student engagement in an operational study; evaluation used 12.9 million student-word instances, with Leitner and Pimsleur shown to be special cases of HLR [20]. Code and the 13-million-trace dataset are on GitHub under MIT [21]. Birdbrain, introduced in 2020, is a separate machine-learning model that predicts the probability a learner answers a given exercise correctly and is used to select exercises in the Session Generator; Duolingo's post does not describe it as a spaced-repetition scheduler [22]. Duolingo is closed source, freemium; a help-center page describes Duolingo Max as a tier above Super Duolingo adding AI "Video Call" and "Roleplay," while Super provides unlimited energy, no ads, and a personalized Practice Hub [24]. Prices were not retrievable from Duolingo pages (see gaps).

### Memrise

Closed source, freemium. Memrise's site describes native-speaker video clips, "MemBot" AI speaking practice, spaced-repetition review, and 150+ languages [25]. Memrise moved user-generated "Community Courses" off the main app to community-courses.memrise.com as of March 31, 2024, and extended the availability window to the end of 2025 [26].

### Quizlet

Closed source, freemium. Quizlet's help center describes a "Spaced repetition" flashcard mode with four ratings (Repeat, Hard, Okay, Easy), automatically enabled for sets of 100+ terms, and currently available only on the website [27]. No algorithm is disclosed.

### Mochi

Markdown-based flashcard app; free tier is unlimited offline, Pro is $5/month for sync and higher AI limits (500,000 AI completion tokens, 1,000 dictionary lookups, 200,000 TTS characters per month). Its default scheduler simply lengthens or shortens intervals on Remembered/Forgot; FSRS is an optional alternative. Some components are open source (github.com/mochi-cards/open-source), the app itself is not [28][29].

### RemNote

Note-taking app with built-in spaced repetition. Default scheduler is "Anki SM-2"; FSRS (version 6) is a beta feature that "may become the default scheduler in the future" and is claimed to need 20-30% fewer reviews for the same retention [30][31]. AI flashcard generation from selected text consumes AI credits and places generated cards in a "Need to Learn" queue [32]. Closed source, freemium.

### Migaku

Closed source. Chrome extension plus iOS/Android apps and "Migaku Memory" web app; one-click cards from Netflix, YouTube, and web pages with sentence, audio, and image; ChatGPT-generated explanations, monolingual dictionaries, TTS; its own built-in SRS (algorithm not disclosed); 11 languages; 10-day free trial [33]. Pricing on the official page requires JavaScript and could not be read; see gaps.

### LingQ

Closed source reading/listening platform with SRS review of saved "LingQs." LingQ's own blog lists Premium at $14.99/month, $10/month on a 12-month plan, or $8.99/month on 24 months, and Premium Plus from about $22.50/month annually with AI voices and AI-simplified lessons [34].

### Clozemaster

Closed source; free with optional Pro (monthly or yearly, prices load dynamically). Cloze-deletion sentences in 50+ languages, TTS audio, "cloze-listening" mode; review intervals default to 1, 10, 30, and 180 days by consecutive correct answers, and a wrong answer resets progress [35][36].

### WaniKani

Closed source kanji/vocab SRS for Japanese: $9/month, $89/year, or $299 lifetime. Fixed SRS ladder of nine stages: Apprentice 1-4 (4h, 8h, 1d, 2d), Guru 1-2 (1w, 2w), Master (1mo), Enlightened (4mo), Burned; wrong answers drop stages by a penalty factor of 2 above stage 5 [37][38].

### Bunpro

Closed source Japanese grammar and vocabulary SRS; free tier without SRS, Premium $5/month, Lifetime $150; 900+ grammar points, 100,000+ vocab sentences, WaniKani integration [39].

### Readlang

Closed source reading tool with inline translation and SRS flashcards from saved words; free tier with unlimited single-word translations, Premium $6/month or $48/year, Premium Plus $15/month or $120/year with better TTS and AI; 100+ languages; iOS/Android apps and a Web Reader extension [40].

### jpdb.io

Closed source Japanese SRS/dictionary (Rust backend, JMdict/KANJIDIC/Tatoeba data). Its FAQ describes an algorithm "based on current scientific research into how the human memory works," a modeled forgetting curve that tolerates early or late reviews, yes/no grading for new cards and a 5-point scale for known cards, and machine-learned difficulty ratings; no native app, works as a PWA [41][42]. Funding is via Patreon (page blocked; see gaps).

### Lingvist

Closed source; subscription (monthly, annual, business) with free trial; 60+ courses focused on high-frequency vocabulary, AI placement, Custom Decks, iOS/Android/desktop; claims a spaced-repetition algorithm without disclosing it [43][44].

### Speakly

Closed source; subscription with 7-day trial; teaches the "4,000 most statistically relevant words" of 10 European languages with spaced repetition, writing/speaking exercises [45][46].

### Comparison table

| App | Scheduler | Open source | Platforms | Price (basic) | Language-specific features |
|---|---|---|---|---|---|
| Anki | SM-2 variant default; FSRS-6 opt-in | Yes (desktop, AnkiDroid GPL-3) | Win/mac/Linux, iOS ($24.99), Android, web | Free; AnkiMobile $24.99 | Add-ons, AnkiConnect, Yomitan/asbplayer/Migaku mining, shared decks [7][9][17][18] |
| SuperMemo 20 | SM-20/SM-19/FSRS/SM-15/SM-2 arena | No | Windows | $68 one-time | Incremental reading, PDF/EPUB/YouTube import, AI explanations [16] |
| Duolingo | HLR (published 2016); Birdbrain for exercise selection | No (HLR code MIT) | iOS/Android/web | Free; Super/Max subscriptions | Courses, audio, AI Video Call/Roleplay in Max [20][21][22][24] |
| Memrise | Undisclosed SRS | No | iOS/Android/web | Free; paid plans | Native-speaker video, MemBot AI speaking [25] |
| Quizlet | Undisclosed 4-rating SRS (web only) | No | Web (SRS), apps | Free; Plus | General flashcards, AI study tools [27] |
| Mochi | Simple interval scaling; FSRS optional | Partial | Desktop, mobile, web | Free; Pro $5/mo | Dictionary lookups, TTS, AI completion quotas [28][29] |
| RemNote | Anki SM-2 default; FSRS-6 beta | No | Desktop, mobile, web | Free; paid tiers | AI card generation, PDF reader [30][31][32] |
| Migaku | Proprietary SRS | No | Chrome ext, iOS, Android, web | Subscription; 10-day trial | Netflix/YouTube one-click sentence cards, AI explanations, TTS, 11 languages [33] |
| LingQ | Undisclosed SRS | No | Web, iOS, Android | Premium $14.99/mo | Reading/listening library, import, AI voices [34] |
| Clozemaster | Fixed ladder 1/10/30/180 d | No | Web, iOS, Android | Free; Pro | Cloze sentences 50+ languages, TTS, listening [35][36] |
| WaniKani | Fixed 9-stage ladder | No | Web (+ API) | $9/mo, $89/yr, $299 life | Kanji/vocab mnemonics [37][38] |
| Bunpro | SRS (intervals not disclosed) | No | Web, apps | $5/mo, $150 life | Japanese grammar points, WaniKani sync [39] |
| Readlang | SRS flashcards | No | Web, iOS, Android, extension | Free; $6/mo | Inline translation reading, AI explanations, TTS [40] |
| jpdb.io | Proprietary forgetting-curve model | No | Web/PWA | Free; Patreon | Japanese decks, frequency, ML difficulty, dictionary [41][42] |
| Lingvist | Undisclosed | No | iOS, Android, desktop | Subscription | Frequency vocabulary, custom decks, AI placement [43][44] |
| Speakly | Undisclosed | No | Web, iOS, Android | Subscription | 4,000 frequency words, speaking/writing [45][46] |

## 3. Language-learning research

- Spacing effect: Cepeda, Pashler, Vul, Wixted, and Rohrer (2006), Psychological Bulletin 132(3), 354-380, meta-analyzed 839 assessments in 317 experiments from 184 articles and found that the inter-study interval producing maximal retention increases as the retention interval increases [23].
- Expanding vs equal spacing in L2 vocabulary: Nakata (2015), Studies in Second Language Acquisition, tested 128 Japanese students on 20 English-Japanese pairs and found "a limited, yet statistically significant, advantage of expanding spacing," while the amount of spacing had large effect sizes, so "introducing spacing may have a larger effect" than its schedule shape [47].
- Flashcard software evaluation: Nakata (2011), Computer Assisted Language Learning 24(1), evaluated nine flashcard programs against 17 criteria from paired-associate learning research [48].
- Sentence vs word cards: The direct experimental literature is older and does not favor sentence context. Laufer and Shmueli (1997), RELC Journal 28(1), 89-108, compared words presented in isolation, in one sentence, in text, and in elaborated text, and found list and sentence presentation were retained better than text presentation, with L1 glosses always better retained than L2 glosses [49]. Nakata's dissertation summary likewise notes that paired-associate learning "may be as effective as or better than contextual approaches" and that context may have little effect on L2 paired-associate learning [50]. I found no primary study showing that sentence-mined cards outperform word cards in SRS apps; the "sentence card" practice is community convention rather than established finding.
- i+1 and comprehensible input: Krashen's Input Hypothesis (Principles and Practice in Second Language Acquisition, 1982) states that "a necessary (but not sufficient) condition to move from stage i to stage i + 1 is that the acquirer understand input that contains i + 1," and that deliberately targeting i+1 is unnecessary because sufficient understood input supplies it automatically [51]. This is a theory of acquisition, not an SRS finding; apps like jpdb and Migaku operationalize it as sorting content by known-word coverage, which is their own design choice.
- SRS efficacy for vocabulary: Chukharev-Hudilainen and Klepikova (2016), CALICO Journal 33(3), 334-354, a double-blind study, reported that about three minutes per day of automatically generated spaced-repetition vocabulary activities increased EFL students' long-term retention roughly threefold [52]. Settles and Meeder (2016) is the largest in-app evidence, with the 12% engagement gain above [20].

## 4. Open-source ecosystem

- FSRS ports and libraries: see Section 1; the awesome-fsrs list also catalogs FSRS adoption in Logseq (database version), several Obsidian plugins, SiYuan, TiddlyWiki, and many small apps (Avorio, Discito, Rember, Read Frog, and others) [6].
- fsrs4anki: the original custom-scheduling script and optimizer for Anki (MIT, about 4,000 stars); its last release v6.1.3 (September 8, 2025) notes FSRS-6 is built into Anki 25.09 [53].
- Anki add-ons: distributed via AnkiWeb; 26.09b1's removal of legacy import/export modules is flagged as breaking AnkiConnect, showing add-on fragility with each release [12].
- AnkiConnect: exposes a local HTTP API for creating cards and driving Anki; the GitHub repo was archived on November 4, 2025 and development moved to git.sr.ht/~foosoft/anki-connect (which returned 502 during this research) [54].
- Yomitan (GPL-3.0): pop-up dictionary extension for Chrome, Firefox, and Edge, successor to Yomichan (sunset February 2023), with "Automatic flashcard creation for the Anki flashcard program via the AnkiConnect plugin" and multi-language support [55].
- asbplayer (MIT): browser media player and Chrome extension for "subtitle sentence mining" from streaming and local video; exports audio/image cards via AnkiConnect and integrates with Yomitan and WaniKani data [56].
- Migaku: the commercial equivalent, closed source, with its own SRS rather than Anki [33].
- LLM card generation: RemNote (credit-based AI card generation) [32], Mochi (AI completion quotas) [28], Migaku (ChatGPT explanations) [33], Readlang (AI context explanations) [40], SuperMemo 20 ("Ask AI to explain while extracting") [16], and Duolingo Max (GPT-4-based Roleplay/Explain My Answer) [24] all now ship LLM features. RemNote's own docs caution that "you'll almost always get the best results by writing your own flashcards" [32].

## 5. Recent developments, 2025-2026

- FSRS-6 shipped in Anki 25.07 (July 4, 2025), AnkiMobile 25.07, and AnkiDroid 2.22.2 [10][18][19].
- FSRS-7 was added to the srs-benchmark as the top FSRS variant; fsrs-rs 6.x (June-August 2026) references FSRS-6 and FSRS-7 internally, but Anki 26.08/26.09b2 still describe FSRS as optional and no FSRS-7 release exists for Anki [3][4][12][13].
- Anki 26.05 (June 2026) shipped a new installer; 26.08 (August 2026) an experimental editor; 26.09 betas removed legacy Python import/export modules [8][11][12].
- AnkiDroid 2.23 (December 2025) redesigned the study screen; 2.24.1 (August 31, 2026) is current [19].
- SuperMemo 20 (2026) introduced SM-20 and the multi-algorithm arena that includes FSRS, the first time SuperMemo has shipped a competitor's algorithm [16].
- Memrise removed community courses from its main app (March 2024) and extended the separate site's availability through end of 2025 [26].
- AnkiConnect's GitHub repo was archived (November 2025) in favor of SourceHut [54].
- I found no primary-source evidence of a major language-learning SRS app shutting down in 2025-2026.

## Confidence and gaps

High confidence (read directly from primary source): SM-2 formula [14]; FSRS version/parameter table and benchmark numbers [2][3]; Anki release dates and FSRS notes from the GitHub API [8][10][11][12]; AnkiMobile price and FSRS statement [18]; AnkiDroid release dates and FSRS changelog [19]; Settles and Meeder abstract and figures [20]; Cepeda abstract [23]; Nakata 2015 abstract [47]; Krashen quote [51]; WaniKani prices and intervals [37][38]; Bunpro, Readlang, Mochi prices [28][39][40]; SuperMemo 20 store description [16]; RemNote FSRS status [31].

Medium confidence (official page summarized by a search engine snippet rather than fetched): SM-18 details and the SuperMemo 20 release date and SM-20 parameter count from supermemo.guru, which returned 403/Cloudflare challenges [15]; Quizlet spaced-repetition help article [27]; Memrise community-course timeline [26]; Laufer and Shmueli 1997 findings [49]; LingQ pricing (from LingQ's own blog) [34]; Anki forum statement on FSRS-7 [13].

Could not verify from primary sources:
- Duolingo Super/Max prices (help pages render client-side and returned no text).
- Migaku plan prices (pricing page requires JavaScript; third-party sites quote $10/month Standard, $15 Early Access, $499 lifetime, unverified).
- jpdb.io Patreon tiers (Patreon blocked; third-party pages say from $5/month).
- Lingvist and Speakly exact prices (pages load prices dynamically).
- AnkiConnect port, license, and API version (SourceHut returned 502; GitHub mirror archived).
- An SM-2 row in the current srs-benchmark tables; older README versions included one but the retrieved table did not.
- Whether SuperMemo ever published a machine-readable SM-19 or SM-20 specification; only marketing text was accessible.
- Nakata 2011 abstract (Crossref record has no abstract); only the paper's title and venue are confirmed.
- Any peer-reviewed comparison of FSRS against SM-2 outside the FSRS project's own benchmark.

## Sources

1. open-spaced-repetition organization on GitHub. https://github.com/open-spaced-repetition
2. awesome-fsrs wiki, "The Algorithm". https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
3. srs-benchmark README. https://github.com/open-spaced-repetition/srs-benchmark (raw: https://raw.githubusercontent.com/open-spaced-repetition/srs-benchmark/main/README.md)
4. fsrs-rs repository and releases. https://github.com/open-spaced-repetition/fsrs-rs and https://github.com/open-spaced-repetition/fsrs-rs/releases
5. py-fsrs repository. https://github.com/open-spaced-repetition/py-fsrs
6. awesome-fsrs README. https://github.com/open-spaced-repetition/awesome-fsrs
7. Anki manual, Deck Options (FSRS section). https://docs.ankiweb.net/deck-options.html
8. Anki releases (GitHub API, tags and dates). https://github.com/ankitects/anki/releases
9. Anki download site. https://apps.ankiweb.net/
10. Anki 25.07 release notes. https://github.com/ankitects/anki/releases/tag/25.07
11. Anki 26.05 release notes. https://github.com/ankitects/anki/releases/tag/26.05 ; Anki 26.08 https://github.com/ankitects/anki/releases/tag/26.08
12. Anki 26.09b1 and 26.09b2 release notes. https://github.com/ankitects/anki/releases/tag/26.09b1 ; https://github.com/ankitects/anki/releases/tag/26.09b2
13. Anki Forums, "When will Anki integrate FSRS-7?" (June 2026). https://forums.ankiweb.net/t/when-will-anki-integrate-fsrs-7/69997
14. SuperMemo, "Algorithm SM-2" (1990 archive). https://super-memory.com/english/ol/sm2.htm
15. supermemo.guru, "Algorithm SM-18", "SuperMemo 20", "Algorithm SM-20". https://supermemo.guru/wiki/Algorithm_SM-18 ; https://supermemo.guru/wiki/SuperMemo_20 ; https://supermemo.guru/wiki/Algorithm_SM-20
16. SuperMemo Store, "SuperMemo 20 for Windows". https://supermemo.store/products/supermemo-20-for-windows
17. GitHub repository metadata for ankitects/anki and ankidroid/Anki-Android. https://github.com/ankitects/anki ; https://github.com/ankidroid/Anki-Android
18. AnkiMobile Flashcards, App Store listing. https://apps.apple.com/us/app/ankimobile-flashcards/id373493387
19. AnkiDroid changelog and releases. https://ankidroid.org/changelog.html ; https://github.com/ankidroid/Anki-Android/releases
20. Settles, B., and Meeder, B. (2016). A Trainable Spaced Repetition Model for Language Learning. ACL 2016, 1848-1858. https://aclanthology.org/P16-1174.pdf
21. duolingo/halflife-regression repository. https://github.com/duolingo/halflife-regression
22. Duolingo Blog, "Learning how to help you learn: Introducing Birdbrain" (2020). https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/
23. Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., and Rohrer, D. (2006). Distributed practice in verbal recall tasks. Psychological Bulletin 132(3), 354-380. https://pubmed.ncbi.nlm.nih.gov/16719566/
24. Duolingo Help Center, "What is Duolingo Max?" https://www.duolingo.com/help/what-is-duolingo-max ; Duolingo Blog, "Introducing Duolingo Max" https://blog.duolingo.com/duolingo-max/
25. Memrise homepage. https://www.memrise.com/en-us/
26. Memrise Help Center, "Will Memrise delete Community Courses?" https://memrise.zendesk.com/hc/en-us/articles/29804562432913-Will-Memrise-delete-Community-Courses
27. Quizlet Help Center, "Studying with Spaced Repetition". https://help.quizlet.com/hc/en-us/articles/48324742264077-Studying-with-Spaced-Repetition
28. Mochi pricing. https://mochi.cards/pricing/
29. Mochi docs, Reviewing. https://mochi.cards/docs/reviewing/
30. RemNote Help, "The Anki SM-2 Spaced Repetition Algorithm". https://help.remnote.com/en/articles/6026144-the-anki-sm-2-spaced-repetition-algorithm
31. RemNote Help, "The FSRS Spaced Repetition Algorithm". https://help.remnote.com/en/articles/9124137-the-fsrs-spaced-repetition-algorithm
32. RemNote Help, "Generating Flashcards with AI". https://help.remnote.com/en/articles/10102901-generating-flashcards-with-ai
33. Migaku homepage and pricing FAQ. https://migaku.com/ ; https://migaku.com/faq/pricing
34. LingQ Blog, "LingQ Free vs Premium". https://www.lingq.com/blog/lingq-free-vs-premium/
35. Clozemaster FAQ. https://www.clozemaster.com/faq
36. Clozemaster Pro. https://www.clozemaster.com/pro
37. WaniKani Knowledge, "SRS Stages". https://knowledge.wanikani.com/wanikani/srs-stages/
38. WaniKani Knowledge, "Subscription Plans". https://knowledge.wanikani.com/account-and-membership/payment-and-billing/subscription-plans/
39. Bunpro pricing. https://bunpro.jp/pricing
40. Readlang homepage. https://readlang.com/
41. jpdb.io About. https://jpdb.io/about
42. jpdb.io FAQ. https://jpdb.io/faq
43. Lingvist homepage. https://lingvist.com/
44. Lingvist pricing. https://lingvist.com/pricing/
45. Speakly homepage. https://speakly.me/
46. Speakly pricing. https://speakly.me/en/pricing
47. Nakata, T. (2015). Effects of expanding and equal spacing on second language vocabulary learning. Studies in Second Language Acquisition. DOI 10.1017/S0272263114000825 (abstract via Crossref).
48. Nakata, T. (2011). Computer-assisted second language vocabulary learning in a paired-associate paradigm: a critical investigation of flashcard software. Computer Assisted Language Learning 24(1). DOI 10.1080/09588221.2010.520675
49. Laufer, B., and Shmueli, K. (1997). Memorizing New Words: Does Teaching Have Anything To Do With It? RELC Journal 28(1), 89-108. https://journals.sagepub.com/doi/10.1177/003368829702800106
50. Nakata, T. (2013). Optimising second language vocabulary learning from flashcards. Doctoral dissertation, Victoria University of Wellington. https://www.academia.edu/4557533/
51. Krashen, S. (1982). Principles and Practice in Second Language Acquisition. https://www.sdkrashen.com/content/books/principles_and_practice.pdf
52. Chukharev-Hudilainen, E., and Klepikova, T. A. (2016). The effectiveness of computer-based spaced repetition in foreign language vocabulary instruction: a double-blind study. CALICO Journal 33(3), 334-354. https://files.eric.ed.gov/fulltext/EJ1143520.pdf
53. fsrs4anki releases. https://github.com/open-spaced-repetition/fsrs4anki/releases
54. AnkiConnect (archived GitHub mirror and new home). https://github.com/FooSoft/anki-connect ; https://git.sr.ht/~foosoft/anki-connect
55. Yomitan repository. https://github.com/yomidevs/yomitan
56. asbplayer repository. https://github.com/killergerbah/asbplayer
