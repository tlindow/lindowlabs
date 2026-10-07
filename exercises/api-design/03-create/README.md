# 03: Create

**The gap:** Your `api.md` says a caller can create a ride. How does a machine
know what they must send in the body?

**Why it exists:** Reads alone leave create clients guessing. A request body
(the JSON you POST) plus a `required` list on the create schema makes "must
send" enforceable.

Copy your step 02 `openapi.yaml` here first.

**Shape hint:**

```yaml
/<path>:
  post:
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/<CreateThing>"
```

**Done when:** `npm run check:step -- 03` passes (`POST /rides` has a JSON body
and a create schema with at least one required field).

**If stuck:** add `post:` under `/rides` with no body, run the check, then add
`requestBody` from the error.
