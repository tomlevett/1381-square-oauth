# 1381 Square OAuth callback

A small static HTTPS callback for the account owner's Square reporting connection.
It requests only MERCHANT_PROFILE_READ, ORDERS_READ and PAYMENTS_READ.

This repository contains no application secret, access token, refresh token or payment records.
The page validates a per-request state nonce, removes the response query from the address bar,
and holds only a temporary authorisation code in a masked field until setup completes.
OAuth token exchange and storage are handled separately through Square and encrypted GitHub secrets.

Configure the production redirect URL as https://tomlevett.github.io/1381-square-oauth/.
