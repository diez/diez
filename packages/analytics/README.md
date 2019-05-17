# `@diez/analytics`

A simple analytics back end for Diez built with [`serverless`](https://serverless.com).

This function provides a simple anonymizing relay to Amplitude devoid of any PII.

The following environment is required in order to deploy the analytics back end to AWS:
 - Environment variables:
   - `DIEZ_HOSTED_ZONE_ID`: a Route 53 Hosted Zone ID for `diez.org`.
   - `DIEZ_AMPLITUDE_API_KEY_DEV`: an Amplitude API key for the "dev" stage.
   - `DIEZ_AMPLITUDE_API_KEY_PROD`: an Amplitude API key for the "prod" stage.
 - AWS profiles:
   - `diez-serverless`: a profile with the requisite permissions for `serverless` ([see gist](https://gist.github.com/ServerlessBot/7618156b8671840a539f405dea2704c8)) and `serverless-domain-manager` ([see "Prerequisities"](https://github.com/amplify-education/serverless-domain-manager#prerequisites)).

First-time activation of domains requires running `create_domain` from `serverless-domain-manager`, e.g.:

```
  $ sls create_domain --aws-profile diez-serverless --stage dev
```

### Deploying

 - Run `make deploy-dev` to deploy the dev stage.
 - Run `make deploy` to deploy the prod stage.
 - See [`Makefile`](./Makefile) for details.
