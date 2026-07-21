---
title: "The three-gate operating model"
number: 1
kind: "Framework"
pillar: "Product Operations"
deck: "Definition Ready, Build Ready, Delivery Ready. What each gate actually checks, and what it costs when a team waves something through."
published: 2026-04-14
readTime: 11
---

Most product organizations do not have a prioritization problem. They have an intake problem that presents as a prioritization problem six weeks later, when the thing everyone agreed to build turns out to have never been defined.

I have now stood up some version of this model in four organizations, and the pattern that made it necessary was the same every time. Work entered the system as a sentence. Somebody senior said a sentence in a meeting, the sentence became a ticket, the ticket became a sprint, and the sprint became three sprints because the sentence had at least four possible readings and nobody had picked one.

The fix is not more rigor at the end. Adding review to the end of a pipeline that admits ambiguous work at the front just moves the argument later, when it is more expensive to have.

## Gate one, Definition Ready

A request passes when four things exist in writing and one person owns each of them. Not when everyone feels good about it.

- **The problem**, stated as a condition in the world rather than a missing feature.
- **The population** it affects, with a rough size. "Users" is not a population.
- **The decision** this work lets someone make differently.
- **The failure condition**. What has to be true in ninety days for us to call this a mistake.

The fourth one is where most intake dies, and that is the point. A team that cannot say what failure looks like has not agreed on what success looks like either. They have agreed on a sentence.

> A gate that never rejects anything is not a gate. It is a form.

## Gate two, Build Ready

Definition Ready says we agree on the problem. Build Ready says we agree on the solution shape and someone has checked that it can be measured.

This is the gate people skip most often, because by the time you are here the work feels inevitable. It has a name. It has a slide. Somebody has already told a client it is coming. Skipping it is how you ship something correct that you cannot evaluate.

## Gate three, Delivery Ready

The last gate is the least controversial and the most frequently faked. Everyone agrees things should be instrumented before launch. Almost nobody blocks a launch on it.

So make it cheap to pass and expensive to fake. One page. Owner, metric, alert threshold, and the name of the person who gets paged when the metric moves.

## What this does not fix

Gates do not fix a strategy problem. If leadership cannot say what the organization is for, a well-run intake process will produce a very orderly queue of well-defined work pointed in five directions. I have built that queue. It is a nicer artifact than chaos and it is not the same thing as being right.
