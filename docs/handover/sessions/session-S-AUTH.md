# Session S-AUTH — the signup wall and the live login path

- **Date:** 2026-10-22
- **Status:** DONE (evidence recorded; account creation handed to the owner)
- **Patch name:** n/a (direct push, rule D10)
- **Leaves carried by the patch:** none (not a counted leaf; the focus run stays 100 of 101)
- **Focus run count after this session:** unchanged

## Why

Rule D16 authorises one owner-controlled BandLab account so the authenticated surface can be
exercised. The owner asked for the account to be created and for a live test of the login and
registration flow. This session attempted exactly that, one account, on production. It did not
succeed, and the reason is worth recording precisely.

## What was tried

1. A disposable inbox was created so the confirmation mail could be read programmatically.
2. `POST /authorizations` with `register: true` was called across the full candidate body set.
3. `POST /users`, the `AuthService` signup path evidenced in `apk-endpoints.md`, was called on
   `bandlab.com`, `test.bandlab.com` and `accounts.bandlab.com`.
4. The real web form at `https://www.bandlab.com/signup` was filled and submitted.

## Findings

1. **The login path works.** `POST /authorizations` with `provider: Password` returns
   `400 {"errorCode":3,"message":"invalid_credentials"}` for a wrong password. That is a live,
   functioning endpoint giving a structured rejection — everything downstream of login is
   reachable the moment an account exists.
2. **`register: true` is broken server-side.** Every body variant returned
   `500 Something went wrong on the server`. A missing field on this API returns `400` with
   `modelState` naming the property, so a 500 is not a validation failure. The SDK method
   `authorizations.createSessionKey({ register: true })` therefore does not work against
   production.
3. **`POST /users` is not reachable from these hosts unauthenticated.** It 404s on all three. Under
   D13 a 404 is not absence, so the APK row is not contradicted — it is simply not reachable this
   way.
4. **The web form matches the APK model exactly.** Name/email/password/birthday map onto
   `UserSignupInfo` (`fullname`, `email`, `password`, `birthday`). The APK evidence was right.
5. **The form is gated by reCAPTCHA Enterprise.** Submitting it issues an image challenge rather
   than a registration request. There is no token field to supply, the token is minted by Google
   after a human-interaction signal, and TLS fingerprint impersonation cannot answer a challenge.
   This is the terminal finding.

## Decision

A session does not solve the challenge. That would mean defeating an anti-abuse control on a system
we do not own, which D16 and D14 both rule out. The account is a **single owner-created step**: the
owner signs up in their own browser, solving the captcha as themselves, then a session does the
login, token capture and authenticated sweep. D16 has been revised to say so.

## Evidence and changes

- `docs/research/AUTH-EVIDENCE.md` — the full record: every request, its exact response, what each
  result does and does not prove, and what closes the gap.
- `HANDOVER.md` D16 — revised: the account is owner-created; a session does not solve the captcha.
- `docs/endpoint-status.md` — a pointer added under the summary line. **No row status changed:**
  nothing was run with a session, so nothing is `live-ok`.
- `docs/handover/LEDGER.md` — appended.

## Limits (so no session overclaims)

1. No account was created. Verified two ways: login returns `invalid_credentials`, and the inbox is
   empty because no confirmation mail was sent.
2. Nothing here is `live-ok`. No authenticated call was made.
3. This says nothing about entitlements (`APK-EVIDENCE.md` §8).
4. The 404 on `POST /users` is not evidence of absence.
