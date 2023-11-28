# Git Commit Messages

The commit message is a very important part of committing code.
It is the first thing that other developers see when they look at the commit history.

## Format

Generally, the Conventional Commits format is used for commit messages.
This format is used by many open-source projects, including Angular, Ember, and
the Linux kernel.

A commit message consists of a **header**, a **body**, and a **footer**.
The header is the only required part of a commit message.

### Header

The header consists of a **type**, a **scope**, and a **subject**.

#### Type

The type can be one of the following:

* `build`: Changes that affect the build system or external dependencies
* `ci`: Changes to the CI configuration files and scripts
* `docs`: Changes to the documentation
* `feat`: New features
* `fix`: Bug fixes
* `perf`: Changes that improve performance
* `refactor`: Changes that neither fix a bug nor add a feature
* `style`: Changes that do not affect the meaning of the code
* `test`: Changes that add missing tests or correct existing tests
* `revert`: Changes that revert previous commits
* `chore`: Other changes that do not modify the source code
* `release`: Release a new version
* `deps`: Update dependencies

> These are just some of the types that can be used.
> For a more complete list, see the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/#specification).

#### Scope

The scope can be anything that describes the location of the commit change.
For example, `docs`, `core`, `compiler`, `http`, `cli`, `packaging`, etc.

#### Subject

The subject is a short description of the change.
It must not exceed **50 characters**.
It must start with a capital letter and must not end with a period (`.`).

### Body

The body is a more detailed description of the change.
It must not exceed **72 characters**.
It must be written in the imperative, present tense.
It must start with a capital letter and must end with a period (`.`).

### Footer

The footer is used to reference issues that this commit closes.
It must be written in the following format:

```
Closes #123
```

## Example { #git-commit-messages-example }

```
feat(core): add new feature

This is a detailed description of the new feature.

Closes #123
```
