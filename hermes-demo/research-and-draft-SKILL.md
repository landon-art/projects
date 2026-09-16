---
name: research-and-draft
description: "Research a topic and draft content in your voice."
version: 0.1.0
author: Alvaro Cintas (longduong), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [Research, Writing, Drafting, Voice, Sources]
    related_skills: [grounded-citations, web_search, web_extract]
---

# Research and Draft

Take a topic, research it, and produce finished drafts written in your voice.
Search for current, credible information, open the two or three best sources,
identify one clear angle, then draft the content in the requested format and
platform, in your voice. List sources used and the angle chosen at the end.

This skill does not cover live-blogging, social monitoring, or
citation-heavy report writing. For cited reports with a source ledger, use
the `grounded-citations` skill instead — this one is for produced drafts where
the voice and the angle matter as much as the facts.

## When to Use

- The user asks for a draft (article, post, guide, explainer, newsletter
  issue) on a topic they want researched first
- A topic needs current, specific information the model does not already know
- The deliverable must read in a recognizable human voice, not a generic AI tone
- The user names a format and platform (blog post, LinkedIn, newsletter, X
  thread, etc.) and expects a finished draft, not an outline

Don't use for: opinion-only pieces with no factual load, pure code generation,
tasks where the model already knows the topic cold and no fresh sources are
needed, or anything that wants a formal citation ledger.

## Prerequisites

- `SOUL.md` at the repo or workspace root — or anywhere the agent can find it
  via the search path — describing how you write (tone, pet phrases, things to
  avoid, examples of your work)
- Access to `web_search` and `web_extract` (or equivalent retrieval tools) for
  the topic
- A clear spec from the user: topic, format, platform, length, audience, and
  any hard requirements (must mention X, must avoid Y, must link Z)

No installs, keys, or env vars beyond the standard toolset. If `SOUL.md` is
missing, this skill still works — it just produces a competent default voice
instead of yours, and says so.

## Procedure

① **Read your voice file first.** Load `SOUL.md` and any memory entries that
describe how you write — preferred sentence length, vocabulary level, what you
rip out in editing, pet constructs you reuse. If neither exists, proceed with a
plain professional voice and note the gap. The goal is to know what "your voice"
means before a single source is opened.

② **Clarify the spec in one pass.** Before researching, confirm topic, format,
platform, length, audience, deadline pressure, and anything the draft must
include or avoid. If the spec is thin, ask — don't guess and write the wrong
thing. A one-line topic with no format gets clarified before step ③.

③ **Research broadly, then cut to two or three sources.** Run a focused
`web_search` for the topic. From the results, pick the two or three most credible
and specific sources — primary where possible (the company, the paper, the
official doc), then high-quality secondary. Open each with `web_extract` and
read for the usable facts, fresh numbers, and quoted material. Discard sources
that only repeat what the search snippet already said.

④ **Choose one clear angle.** From what the sources say, pick the single most
useful framing for the requested format and audience. The angle is a sentence:
what this piece is really about, and why a reader would care now. If two sources
conflict, decide which you weight and why — or present both if the format calls
for it. The angle drives the draft; it is not a recap of the search results.

⑤ **Draft in your voice, in the requested format.** Write the piece as if you
were handing it back for publication — structure, length, and register match the
platform. Use the sentence rhythms and vocabulary from `SOUL.md` where they
exist; where they don't, default to clear, direct, and concrete. Factual claims
that came from a source get named in the sources list at the end, not necessarily
inline-cited (this skill is not `grounded-citations`). Cut throat-clearing,
hedging, and anything that sounds like a language model introducing itself.

⑥ **Run a voice check on the draft.** Read it back against `SOUL.md`: does it
sound like you, or like a generic assistant wearing your name? Flag any sentence
you would cut in editing and cut it. If `SOUL.md` says you avoid a construct
(e.g. "delve," "testament," "it's important to note"), make sure none survived.

⑦ **Append the sources and the angle.** At the end of the deliverable, list:
- **Angle:** the one-sentence framing chosen in step ④
- **Sources:** the two or three sources opened in step ③, each with its URL and
  a one-line note on what it contributed

This block is for the reader (and for you, later) to see what the draft rests on.
It is not a citation ledger and does not use `[n]` numbering — for that, run
`grounded-citations` instead.

⑧ **Deliver with the angle and sources attached.** Hand back the draft with the
closing block intact. If the user wants a revision, keep the same sources and
angle unless they asked for a new angle or new facts.

## Pitfalls

- **Researching before clarifying.** A thin spec plus a full research pass wastes
  both. Confirm format, length, and audience before opening sources.
- **Opening more sources than you use.** Three good sources beat eight skimmed
  ones. The draft should rest on what you actually read, not on the search page.
- **Angle as summary.** "This piece covers X, Y, and Z" is a table of contents,
  not an angle. The angle is the through-line — the one thing the reader should
  leave with.
- **Voice drift.** Without a `SOUL.md` pass in step ①, drafts default to a
  polite, balanced, slightly generic register. The voice check in step ⑥ catches
  the worst of it, but a real `SOUL.md` is what makes the output yours.
- **Inline-citing by default.** This skill lists sources at the end; it does not
  sprinkle `[1]` through the prose. If the deliverable needs a citation ledger,
  use `grounded-citations` instead — don't half-implement it here.
- **Sources that contributed nothing.** A source on the list should have changed
  the draft in some detectable way — a fact, a figure, a quote, a framing. If it
  only confirmed what you already wrote, it can drop off the list.
- **Skipping the voice check.** Drafting fast and delivering without step ⑥ is
  how "sounds like me" becomes "sounds like an assistant" with your name on it.

## Verification

- [ ] `SOUL.md` (or a memory entry) was read before drafting, or the absence was
      noted
- [ ] Spec was clarified before research began — format, platform, length,
      audience, must-include/must-avoid
- [ ] Two or three sources were opened and read, not just searched
- [ ] A one-sentence angle exists and is stated in the closing block
- [ ] The draft matches the requested format and platform
- [ ] The closing block lists sources with URLs and what each contributed
- [ ] A voice check was run against `SOUL.md`; flagged sentences were cut
- [ ] No citation-numbering `[n]` appears in the prose (that belongs to
      `grounded-citations`)
