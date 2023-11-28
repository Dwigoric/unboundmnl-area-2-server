# Introduction

Welcome to the documentation for the %product%!

In this documentation, you will find information about the %product%
and its underlying quality attributes and design.

## Structure

The product uses separate repositories for the frontend
and the backend. The frontend is written in %lang%
using the %framework% framework.
The backend is written in %lang% as well using the
%backend-framework% framework.

There are two repositories for this project:

* [Frontend](%frontend-repo-url%)
* [Backend](%backend-repo-url%)

Instructions on how to set up the project can be found in the
[README](%frontend-repo-url%/blob/main/README.md) file of the frontend repository.

Running the backend is also required; instructions can be found in the
[README](%backend-repo-url%/blob/main/README.md) file of the backend repository.

## Deployment

The frontend part of the product is deployed on %deployment-platform%.
On the other hand, the backend is deployed on %backend-deployment-platform%.

### Pipeline

The pipeline is configured using GitHub Actions.
The pipeline is triggered on every push to the repository.

The frontend pipeline is configured directly from Cloudflare Pages.

The backend pipeline is configured using GitHub Actions, which you may
find in the [backend repository](%backend-repo-url%/blob/main/.github/workflows/deployment_azure-app-service.yml).

## Feedback and support

Please utilize the GitHub issue feature to report any issues,
usability improvements, or feature requests.

<seealso>
    <category ref="uh">
        <a href="Admin.md" />
        <a href="Authenticating-Logging-In.md" />
        <a href="Loans.md" />
        <a href="Deposits.md" />
        <a href="Profiles.md" />
    </category>
    <category ref="ds">
        <a href="Naming.md" />
        <a href="Comments.md" />
        <a href="Code-Style.md" />
        <a href="Git-Commit-Messages.md" />
    </category>
</seealso>
