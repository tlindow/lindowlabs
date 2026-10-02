# Authenticated sessions

This service signs a [Browserbase](https://www.browserbase.com) cloud browser into websites and keeps that login for later runs.

Browserbase runs real Chrome browsers in the cloud. A **session** is one of those runs: you can watch it live and replay it afterward. A **context** is the saved browser profile for that login — cookies, localStorage, and the rest of the site data — so the next session opens already signed in. A context does not store the JSON your caller asked for. That result is returned on the response. The context stores the browser state that makes the next run skip the login.

**Stagehand** is Browserbase's framework for driving the page with short instructions (`act`) instead of brittle selectors. Credential steps pass the username and password through Stagehand variables, with caching turned off for those steps, so the model sees `%username%` and `%password%` rather than the secret. Repeated non-secret steps (such as "click the Login button") use Browserbase's server-side cache. No separate model API key is set: Stagehand uses Model Gateway on the Browserbase key. The Free plan includes $5 of those tokens.

## How another AI calls this

```
AI platform
  → this service (MCP over stdio, or HTTP)
      → 1Password service account resolves op:// references
      → Browserbase session, bound to a per-site context with persist enabled
      → Stagehand signs in only when that context is not already authenticated
  ← context id, session replay link, and whether the login was reused
```

The other AI can then keep browsing through Browserbase's own MCP:

- After a normal call, start that MCP session with the returned `contextId` and persist enabled. The browser opens already signed in.
- After a call with `keepAlive: true`, pass the returned `sessionId` to Browserbase MCP `start`, drive that same browser, then call `release_session` so the cookies are written back.

Browserbase's hosted MCP does not forward tool calls into this process. Point the AI at this service for the login, and at Browserbase MCP for general browsing afterward.

1Password here is the [service-account SDK](https://docs.browserbase.com/integrations/1password/quickstart): a token reads the vault item, and a person does not have to approve each login. The first successful login is what fills the context. Later calls reuse that context and do not read the vault again until the site logs the browser out.

## Setup

```bash
cd services/authenticated-sessions
npm install
```

Copy `.env.example` to `.env` and set:

- `BROWSERBASE_API_KEY` — the only Browserbase secret. Do not set a project id. The key identifies the project.
- `OP_SERVICE_ACCOUNT_TOKEN` — a 1Password service account that can read the vault named in `sites.json`.

Leave every model provider key unset.

`sites.json` maps a site id to a login URL and to `op://` references. Add one object per website. The included `practice-login` entry targets the public form at `https://the-internet.herokuapp.com/login`. Put that site's published demo username `tomsmith` and password `SuperSecretPassword!` in a 1Password item titled `Practice Login` inside a vault named `Browserbase Agent`.

Sites such as LinkedIn, Instagram, Yelp, Facebook, TikTok, and X block plain cloud browsers. The Free plan does not include Verified sessions or residential proxies, so this service refuses those hosts unless the caller passes `allowProtected`.

## Run

```bash
export BROWSERBASE_API_KEY=...
export OP_SERVICE_ACCOUNT_TOKEN=...

npm run smoke
npm run login -- --site practice-login
npm run mcp
npm run http
```

`npm run smoke` opens `https://example.com` in a cloud browser, prints the full session link, and removes the throwaway context. It does not call 1Password or the model.

`npm run login` signs in (or reuses the saved context) and prints JSON including `sessionUrl`.

HTTP, bound to `127.0.0.1` unless `SERVICE_AUTH_TOKEN` is set:

- `GET /health`
- `GET /sites`
- `GET /contexts`
- `POST /sessions` with `{ "siteId": "practice-login" }`
- `POST /sessions/<sessionId>/release`

MCP tools: `list_sites`, `list_contexts`, `open_authenticated_session`, `release_session`.

```json
{
  "mcpServers": {
    "authenticated-sessions": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "services/authenticated-sessions",
      "env": {
        "BROWSERBASE_API_KEY": "your_browserbase_api_key",
        "OP_SERVICE_ACCOUNT_TOKEN": "your_1password_service_account_token"
      }
    }
  }
}
```

Context ids are recorded in `data/contexts.json` (gitignored). Treat that file like a credential. If it is lost, pass the `contextId` from an earlier response.

Watch a live kept-alive session, and the replay of a finished one, at the `sessionUrl` in the response: `https://www.browserbase.com/sessions/<session-id>`.
