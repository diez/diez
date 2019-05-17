# `@diez/oauth`

A simple OAuth 2.0 handshake broker for Diez built with [`serverless`](https://serverless.com).

Diez currently performs browser-based Figma authentication when `diez extract` is run inside a project with Figma design sources.

The following environment is required in order to deploy the OAuth 2.0 handshake broker to AWS:
 - Environment variables:
   - `DIEZ_HOSTED_ZONE_ID`: a Route 53 Hosted Zone ID for `diez.org`.
   - `DIEZ_FIGMA_CLIENT_ID`: the Diez Figma OAuth client ID.
   - `DIEZ_FIGMA_CLIENT_SECRET`: the Diez Figma OAuth client secret.
 - AWS profiles:
   - `diez-serverless`: a profile with the requisite permissions for `serverless` ([see gist](https://gist.github.com/ServerlessBot/7618156b8671840a539f405dea2704c8)) and `serverless-domain-manager` ([see "Prerequisities"](https://github.com/amplify-education/serverless-domain-manager#prerequisites)).

First-time activation of domains requires running `create_domain` from `serverless-domain-manager`, e.g.:

```
  $ sls create_domain --aws-profile diez-serverless --stage prod
```

### Deploying

 - Run `make deploy` to deploy the prod stage.
 - See [`Makefile`](./Makefile) for details.
