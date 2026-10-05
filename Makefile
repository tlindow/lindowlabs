.PHONY: typing-coverage coverage-bar coverage-bar-check

# Measure hand-typed coverage across the working tree (stdlib Python only).
# Not wired into CI: the site tree is mostly unmarked provenance and fails the 10% bar.
typing-coverage:
	python3 scripts/check_typing_coverage.py --mode working-tree

# Rewrite the README provenance bar from the full working tree.
# Requires coverage-bar markers in README.md (profile-repo feature; not present here).
coverage-bar:
	python3 scripts/check_typing_coverage.py --write-bar

# Fail when the committed README bar does not match the measured working tree.
coverage-bar-check:
	python3 scripts/check_typing_coverage.py --check-bar
