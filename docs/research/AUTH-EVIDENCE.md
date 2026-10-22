# Auth evidence — the signup wall and the live login path

**Date:** 2026-10-22 · **Status of this document:** evidence record (rule D13).
**Companion files:** `docs/research/APK-EVIDENCE.md` (paths, verbs, shapes), `apk-shapes.tsv`
(`UserSignupInfo`, line 194).
**Provenance:** live unauthenticated probes from the sandbox against `bandlab.com` and
`test.bandlab.com`, plus one owner-directed interactive attempt at the web signup form. No account
was created; no credential exists as a result of this work.

---

## 1. Why this file exists

Rule D16 authorises exactly **one** owner-controlled BandLab account so the authenticated paths
(`POST /authorizations`, `POST /connect/token`, and the bearer-gated surface behind them) can be
exercised. This document records what happened when the account was created, because the outcome
is not the expected one and it changes what a future session may assume.

The short version: **the login path works and is reachable. Account creation is gated by
reCAPTCHA Enterprise and cannot be completed by a session.**

---

## 2. What was tested, and what each result means

All probes are unauthenticated `POST` to `https://bandlab.com/api/v1.3` unless noted.

| #   | Request                                                                                        | Result                                                                                                                      | Meaning                                                                                                                     |
| --- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | `GET /authorization/two-factor-methods`                                                        | `401 {"message":"User is not authenticated."}`                                                                              | Host and namespace are correct. A 401, not a 404 — per D13 this is positive evidence the path exists.                       |
| 2   | `POST /authorizations {"provider":"Password"}`                                                 | `401 User is not authenticated.`                                                                                            | Endpoint is live. Missing credentials is an auth failure, not a routing failure.                                            |
| 3   | `POST /authorizations {"provider":"Password","email":…,"password":…}`                          | `400 {"errorCode":3,"message":"invalid_credentials"}`                                                                       | **The login path works.** A structured credential rejection from a functioning endpoint.                                    |
| 4   | `POST /authorizations {"provider":"Email",…}`                                                  | `400 … Error converting value "Email" to type 'BandLab.Common.ProviderType' … You cannot register with Anonymous provider.` | The provider enum is `BandLab.Common.ProviderType`; `Password` is valid, `Email` is not. `Anonymous` is a recognised value. |
| 5   | `POST /authorizations {…, "register":true}`                                                    | `500 Something went wrong on the server.`                                                                                   | **Registration via this path fails server-side**, on every body variant tried (see §3).                                     |
| 6   | `POST /users` (APK-evidenced `AuthService` signup, response `com.bandlab.auth.models.Session`) | `404` on `bandlab.com`, `test.bandlab.com` **and** `accounts.bandlab.com`                                                   | Per D13 a 404 is not absence. The APK row is real in the app but is not reachable from these hosts by a session.            |
| 7   | `POST /recaptcha/verify`                                                                       | `400` with an empty body                                                                                                    | The endpoint exists; it returns no diagnostics. It is a second captcha surface, alongside the one in §4.                    |

Result 3 is the one to keep: `invalid_credentials` is a _live_ answer. Everything downstream of
login — session token, bearer-gated sweep, credential storage — is reachable the moment an account
exists. Nothing about the API is blocking that.

---

## 3. Registration via `POST /authorizations` returns 500, not a validation error

Every variant below was sent with `register: true`. All returned
`500 Something went wrong on the server. Please try again later`:

- `email` + `password`; `login` + `password`
- plus `username`; plus `fullname`; plus `fullname` + `birthday` + `userConsent`
- plus `savePassword`
- plus `recaptcha` / `recaptchaToken` / `captcha` / `captchaToken` / `recaptchaResponse`

Two things follow. First, the failure is **server-side and unconditional** — it is not a missing
field, because a missing field on this API returns a `400` with `modelState` naming the property
(see result 4). Second, the one field name that _did_ draw a field-level error was `name`
(`The specified condition was not met for 'Name'`), which means `name` is a recognised property
and the others are being ignored or rejected silently.

The SDK method behind this path, `authorizations.createSessionKey({ register: true })`, therefore
**does not work against production**. It is a `spec` row (see `docs/endpoint-status.md` line 73)
and the spec's registration story does not match the server. Recorded as a defect, not as a
missing endpoint.

---

## 4. The wall: reCAPTCHA Enterprise on the real signup form

The real registration surface is the web form at `https://www.bandlab.com/signup`. Its fields map
exactly onto the APK's `UserSignupInfo` (`apk-shapes.tsv` lines 194-199):

| Form field                | `UserSignupInfo` field |
| ------------------------- | ---------------------- |
| Name                      | `fullname`             |
| Email                     | `email`                |
| Password                  | `password`             |
| Birthday (DD / MM / YYYY) | `birthday`             |

This is a clean confirmation that the APK evidence was right about the model. Filling the form and
submitting it does **not** produce a registration request. It produces a reCAPTCHA Enterprise
challenge, served from `www.recaptcha.net/recaptcha/enterprise/`, site key
`6Lcv2gQsAAAAAPS_CuVjwxFG5AgAYqp1hVl5Jokf`, as an image challenge ("Select all images with…").

This is the terminal finding, and it is structural rather than incidental:

1. **There is no token field to supply.** The JSON bodies in §3 have no property that satisfies
   it — every candidate name was tried and all returned the same `500`.
2. **The token is minted by Google after a human-interaction signal.** It is not derived from
   anything in the request, so it cannot be computed, replayed from a template, or guessed.
3. **TLS/HTTP fingerprint impersonation does not solve it.** A browser-like TLS fingerprint
   (JA3/JA4) can reduce how _often_ a challenge is issued; it cannot answer one. When a challenge
   is issued, only a human — or a paid solving farm — clears it.

Solving that challenge from a session would mean defeating an anti-abuse control on a system we do
not own. Under D16 the account is owner-created; under D14 the same reasoning already ruled out an
entitlement bypass. A session therefore stops here and hands the single human step to the owner.

---

## 5. What this evidence is and is not

**Is:** a live record of which auth paths answer and how, with the exact responses, and a
confirmation that the APK's `UserSignupInfo` matches the shipping web form.

**Is not:**

1. **Not an account.** No account was created. Verified two ways: result 3 returns
   `invalid_credentials` for the address used, and the inbox used for the attempt is empty (no
   confirmation mail was ever sent).
2. **Not a claim that `POST /users` is absent.** It 404s from these hosts unauthenticated, which
   under D13 proves nothing about absence. The app may reach it on a different host or version.
3. **Not a `live-ok` for anything.** No endpoint here was exercised with a valid session, so no
   row status changes on the strength of this document.
4. **Not a statement about entitlements.** Per `APK-EVIDENCE.md` §8, auth flags say an endpoint
   expects a token; they say nothing about what the account is allowed to do.

---

## 6. What closes this

One owner action, then everything else is a session task:

1. **Owner creates the account** at `https://www.bandlab.com/signup` in their own browser, solving
   the reCAPTCHA as themselves. This is the intended, non-circumventing path and is entirely
   appropriate for the owner's own account.
2. Owner registers the email and password in the OpenHands secret store (per the credentials note
   in `HANDOVER.md` §1a and rule D16) — never in a tracked file.
3. A session then runs: login via `POST /authorizations` → capture the session token → sweep the
   bearer-gated surface → mark rows `live-ok` where a call actually succeeds.

Until step 1 happens, no session can create the D16 account, and no row may be marked `live-ok`.
