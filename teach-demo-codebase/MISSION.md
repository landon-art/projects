# Mission: The hermes-demo workspace

## Why
Contribute code to the `hermes-demo` workspace (`../hermes-demo`): a Hermes Agent
automation kit made of cron pre-run gates, a research skill, a voice file, and
generated outputs. Changes must respect Hermes' scheduler contracts, or jobs
silently misfire (agent wakes for nothing, or an alert never delivers).

## Success looks like
- Can add or modify a cron gate script and predict, without running it, whether
  the LLM wakes and whether output delivers.
- Can explain the three layers (gate, agent+skill, delivery) and which file
  belongs to which.
- Can find and fix the real defects in the existing gate and digest scripts.
- Can write a new SKILL.md that Hermes discovers and a cron job can attach.

## Constraints
- Learner prefers short, direct answers (see NOTES.md).
- Codebase is small (8 files, no git); lessons should go deep, not wide.

## Out of scope
- Hermes Agent internals beyond cron, skills, SOUL.md.
- LLM prompt engineering for the digest content itself.
