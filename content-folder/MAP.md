# MAP.md

## Part Four (header)

Files read: 6 of 6 (every file in the folder, none skipped).
Date: 2026-09-16.

Files: brief-template.md, example-post-1.md, old-draft.md, random-idea.md, voice-current.md, voice-notes-old.md

Legend: FOUND = both files state the link. GUESSED = inferred, not stated by either file.

---

## Part One: Topics and files, ranked by inbound links

Inbound link = another file names this file by filename.

| Rank | Topic | File | Inbound links | Pointed at by |
|---|---|---|---|---|
| 1 | Voice and tone rules (current) | voice-current.md | 2 | brief-template.md, example-post-1.md |
| 2 | Post structure / brief format | brief-template.md | 1 | example-post-1.md |
| 3 | Finished post (applies brief + voice) | example-post-1.md | 0 | none |
| 3 | Voice and tone rules (older, contradicts current) | voice-notes-old.md | 0 | none |
| 3 | Abandoned draft | old-draft.md | 0 | none |
| 3 | Topic idea (stale, ~June 2026) | random-idea.md | 0 | none |

Topic groupings:
- Voice / tone: voice-current.md, voice-notes-old.md. Only voice-current.md is referenced. voice-notes-old.md covers the same ground but gives opposite advice (long conversational sentences vs. short direct ones).
- Structure / template: brief-template.md.
- Output posts: example-post-1.md.
- Unattached leftovers: old-draft.md, random-idea.md. Both self-describe as unlinked or never referenced again.

Explicit link list (all FOUND, stated in the pointing file):
- brief-template.md -> voice-current.md ("Follow voice-current.md for tone")
- example-post-1.md -> brief-template.md ("Written using brief-template.md")
- example-post-1.md -> voice-current.md ("and voice-current.md as the guide")

Note on FOUND: the target files do not name the source files back. FOUND here means the link is literally written in the file, not inferred.

---

## Part Two: Orphans

Files nothing points at: 4 of 6 = 66.7%.

- example-post-1.md (points outward, but nothing points at it)
- voice-notes-old.md
- old-draft.md
- random-idea.md

---

## Part Three: Connections not obvious from the links

1. voice-notes-old.md <-> voice-current.md — GUESSED
   Why: same subject (voice), and voice-current.md is titled "Updated Sept 2026", which suggests it replaced an older guide. Neither file names the other. The two give conflicting rules, so treating voice-notes-old.md as superseded is the safest reading.

2. voice-notes-old.md <-> old-draft.md — GUESSED
   Why: both self-describe as outside the current system, and an abandoned draft plausibly followed the older voice rules. Nothing in either file confirms this.

3. random-idea.md <-> brief-template.md — GUESSED
   Why: a topic idea is the natural input to a brief, so the idea could become a post via the template. Neither file mentions the other; the idea says it was never referenced again.

No hidden FOUND connections exist. Every stated link is already listed in Part One.

---

## Working rule

Read this file before any job in this folder. Append what was learned below when the job finishes.

## Log

- 2026-09-16: Initial map built from a full read of all 6 files.
- 2026-09-16: Reviewed Part Three with user. Item 1 acted on: voice-notes-old.md now carries a "Superseded by voice-current.md" line at the top (link is now FOUND from the old file's side; voice-current.md still does not name it). Items 2 and 3 left unchanged by user decision; nothing breaks if they stay.
- 2026-09-16: Folder now lives inside git repo landon-art/projects (private) as content-folder/. CLAUDE.md added at folder root with the read-MAP.md rule. Six sibling folders got the same CLAUDE.md line but have no MAP.md yet.
