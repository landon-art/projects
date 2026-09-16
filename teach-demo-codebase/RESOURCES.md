# hermes-demo Resources

## Knowledge

- [Docs: Hermes Agent — Scheduled Tasks (Cron)](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron)
  Primary source for the gate contract, `[SILENT]` marker, output paths, skill attachment. Use for: anything a gate script prints.
- [PR #12373: add wakeAgent gate](https://github.com/NousResearch/hermes-agent/pull/12373)
  Design rationale: last non-empty stdout line, strict `false`, fail-open. Use for: edge cases of the gate parser.
- [Docs: Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
  `~/.hermes` layout, SOUL.md as system-prompt slot #1, skills discovery. Use for: where files live at runtime.
- [Docs: Hermes Agent — Profiles](https://hermes-agent.nousresearch.com/docs/user-guide/profiles)
  Per-profile SOUL.md/skills/cron. Use for: running the demo beside other agents.
- [Hacker News API (official)](https://github.com/HackerNews/API)
  `topstories` returns up to 500 ids; item fields; no rate limit. Use for: hn_ai_digest.py changes.
- [Cron source: website/docs/user-guide/features/cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)
  Same as docs, but versioned. Use for: checking whether behaviour changed after a release.

## Wisdom (Communities)

- [NousResearch/hermes-agent issues and PRs](https://github.com/NousResearch/hermes-agent)
  Maintainers answer contract questions here. Use for: "is this gate behaviour intended?"

## Gaps
- No primary source yet for Hermes skill frontmatter schema (`metadata.hermes`). Need agentskills.io spec + Hermes skills doc.
