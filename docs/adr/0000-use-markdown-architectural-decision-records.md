# Use Markdown Architectural Decision Records

## Context and Problem Statement

We want to record architectural decisions made in this project.
Which format and structure should these records follow?

## Considered Options

* [MADR](https://adr.github.io/madr/) 2.1.2 – The Markdown Architectural Decision Records
* [Michael Nygard's template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) – The first incarnation of the term "ADR". This is the template in broadest use at WP Engine.
* [Sustainable Architectural Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions) – The Y-Statements
* [Stanford NABC Model](https://web.stanford.edu/class/educ303x/wiki-old/uploads/Main/SRI_NABC.doc) - in use for [Headless](https://github.com/wpengine/headless-infra/blob/96ad8ea6f02548b92e245eba68dee098bcec974c/adr/0001-use-nabc-adrs.md)
* Other templates listed at <https://github.com/joelparkerhenderson/architecture_decision_record>
* Formless – No conventions for file format and structure
* a Google Document following one of the formats above (outside of the repo)

## Decision Outcome

Chosen option: "MADR 2.1.2", because

* Implicit assumptions should be made explicit.
  Design documentation is important to enable people understanding the decisions later on.
  See also [A rational design process: How and why to fake it](https://doi.org/10.1109/TSE.1986.6312940).
* The MADR format is lean and fits our development style.
* The MADR structure is comprehensible and facilitates usage & maintenance.
* The MADR project is vivid.
* Version 2.1.2 is the latest one available when starting to document ADRs.

Why ADRs?

* ADRs will make it easy to lookup decisions and why they were made.
* There is no ambiguity as to if a decision has been approved or not.

Why in the Repo?

* Having the ADRs near the code makes it easy to search for ADRs (No going to another service i.e. Google Drive, Confluence etc.).
* ADRs in git are versioned and allow us to use the existing PR flow on Github as the approval and discussion forum.

<!-- markdownlint-disable-file MD013 -->
