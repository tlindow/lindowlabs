# 00: In plain English

Before any YAML, open `api.md` and write what someone calling the **rides**
service needs to know. Use plain sentences or English pseudocode.

Answer each of these:

1. **ask** - What can they ask for?
2. **send** - What do they send?
3. **return** - What comes back?
4. **wrong** - What can go wrong?

This is the problem OpenAPI was designed to solve: turn that shared
understanding into a machine-readable contract. Later steps translate slices of
your `api.md` into YAML.

Done when each of the four has an answer. No lint check for this step.
