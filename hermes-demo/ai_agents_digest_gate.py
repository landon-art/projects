#!/usr/bin/env python3
"""
Daily AI Agents Digest — gate script.
The digest agent has web + terminal toolsets and can search on its own.
This gate always wakes the agent so it can do its own research.
"""
import sys

def main():
    print("Gate: waking digest agent (agent has web tools for its own research)", file=sys.stderr, flush=True)
    print("wakeAgent=true")
    sys.exit(0)

if __name__ == "__main__":
    main()
