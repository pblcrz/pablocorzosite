---
title: "Experimentation Platforms Are Becoming Organizational Memory"
number: 13
kind: "Article"
pillar: "Experimentation & Measurement"
deck: "Documentation keeps conclusions and loses the reasoning behind them. Experimentation platforms keep the reasoning, which quietly makes them the place an organization stores what it knows."
published: 2026-07-20
featured: true
primaryIdea: "experimentation-compounds"
relationships:
  - target: "from-first-hypothesis-to-institutional-knowledge"
    type: "builds-on"
    note: >
      Picks up where that piece ended — the difference between running
      experiments and building knowledge — and argues the experimentation
      platform is where the compounding record actually lives.
---

The article ['From First Hypothesis to Institutional Knowledge'](/writing/from-first-hypothesis-to-institutional-knowledge) ended on the difference between running experiments and building knowledge. Compounding was the word for it: a program where the next team starts from a previous answer instead of starting from zero. That leaves us with an open question. If knowledge is supposed to accumulate, where is it actually being kept?

Ask a leader and the answer is almost always documentation. A wiki. A readout deck. The quarterly learning digest, the shared drive, the summary email that went to forty people. The answer feels obviously correct, but it is wrong in a specific way that explains why so many programs have a large archive and no memory.

## Documentation preserves conclusions

Consider what a readout actually is. It is written after the outcome is known, by someone summarizing for an audience that was not in the room, under presentation or communication constraints, for a meeting with an agenda. Every one of those conditions is valid at that moment but it keeps the verdict and drops the thinking. What survives is the finding: the variant won, the lift was four percent, we shipped it.

What does not survive is everything surrounding that finding. The hypothesis as it was stated before the data arrived. What the team expected, and how confident they were. The alternative explanations that were considered and rejected. The guardrail metrics that were checked and the ones that were not. The segment where the effect was concentrated. The reason the test ran three weeks rather than two. The specific thing that would have changed the decision.

That is not a failure of effort. Summaries are supposed to compress; that is their function. The failure happens downstream, when the organization treats the summary as the end of the road and quietly discards the material that record was derived and compressed from.

## Reasoning is the part you need later

The distinction matters because of who eventually reads the archive. The person who needs your experiment eighteen months from now is not looking for your verdict — everyone has moved on from it by then. They are trying to establish whether your situation resembled theirs closely enough that your answer applies to their question — learning reusability. That is a judgment about conditions, mechanisms, and assumptions, and it can only be made from the reasoning. A conclusion travels easily and carries almost nothing with it: it can be pasted into a new deck by someone with no way to check whether it still holds or why.

Science has an instructive version of this problem. The Reproducibility Project: Cancer Biology spent eight years attempting to repeat 193 experiments drawn from 53 high-impact papers. Not one of the 193 was described in enough detail for the team to design a replication without going back to the original authors, and the data needed to compute effect sizes was publicly available for four of them.¹ Peer-reviewed papers are documentation at its most disciplined: written by trained specialists, to a standard enforced by reviewers, for the explicit purpose of being built upon. Even at that standard the published conclusion was not sufficient to rebuild the reasoning that produced it. A readout written for a Thursday meeting is not going to do better.

There is a sharper finding underneath that one. When the reasoning is recorded before the outcome is known rather than after, the results themselves change. A comparison of registered reports, where the hypothesis and analysis plan are reviewed and accepted before any data is collected, against a matched sample of conventional publications found positive results in ninety-six percent of the conventional reports and forty-four percent of the registered ones.² The underlying science was not different. The timing of the record was. Reasoning written after the result bends toward the result, which means an archive assembled from retrospective summaries is not merely thin. It is systematically biased and flattering.

## Most of what a program produces never gets written down

There is a second, quieter loss. Across the online experimentation literature, the most commonly reported success rates sit between ten and twenty percent: most well-run experiments do not move the metric they were designed to move.³ Take that seriously and the large majority of what a program generates is flat or negative. Those results carry real value and they are also learnings to consider, because they narrow the space of ideas worth spending on. They are also precisely the results nobody writes a deck about. Documentation is selective: it keeps the wins and discards the map of the dead ends, which is the larger and more reusable half of what was learned.

The same work makes a further point that matters here. When the underlying success rate is that low, a significance threshold of five percent means a meaningful share of the results that clear it are false positives.³ A stored conclusion stripped of its design is therefore not only incomplete. Sometimes it is wrong, and nothing left in the archive gives a later reader any way to tell which results are affected, or why.

## What the platform holds that the document cannot

A well-designed experimentation platform preserves a different thing, and it does so as a byproduct of the work rather than as an act of discipline afterward.

The hypothesis is captured at intake, before launch, which fixes the timing problem at its source. Metric definitions are resolved once in a shared registry, so a lift measured today is comparable to a lift measured two years ago by someone who has since left. The design is recorded with its constraints: power, duration, exclusions, guardrails, and the segments declared in advance rather than discovered afterward. The decision sits attached to the evidence that produced it instead of living in a communication that might not even be retained past a certain window.

One more consideration belongs on that list and deserves some detailing. Results can get invalidated after the fact. A randomization turns out to have been broken, a pipeline quietly dropped a segment, a metric definition changed mid-flight and nobody noticed for a quarter. Under a documentation regime the invalidated finding is never recalled, because nothing records who relied on it. It keeps paying dividends long after it is known to be false: quoted in strategy decks, used as the prior for the next test, cited by people who were not in the room when it fell apart. A platform that tracks which decisions cited a result, and which experiments took it as a starting assumption, can answer the question a document cannot: now that this is wrong, what else is wrong? Retraction is a normal event in any knowledge base. Most experimentation programs have no mechanism for it at all.

The property all of those share is that none of them requires anyone to decide to preserve knowledge. The record is a consequence of doing the work correctly, not a separate chore competing with the next sprint. That is the whole difference, and it is why memory is an architectural outcome rather than a feature.

This is where the learnings library comes in, and why it fails. Someone gets assigned to keep it current. For two quarters they do. Then the entries thin out, the most recent one is eight months old, and the field everyone actually needed, why we chose that segment, was optional from the start.

I underestimated this when building an in-house experimentation platform from nothing. The work that felt important at the time was the statistical engine and the workflow: getting the methods right, cutting test lead time by forty-one percent, doubling experiment volume, moving revenue per visitor three percent. Those were the outcomes I reported, and still matter. But what I did not anticipate was that the accumulated record would end up mattering more to the program than any single capability inside it, because it changed the rhythm of discovery. Answering one question stopped meaning design a test and started meaning read the archive first.

## The successor test

A diagnosis is only useful if it comes with something you can check, and the cancer biology project supplies the shape of one. That team could not design a replication of a single experiment without going back to the person who ran it. Hold your own archive to the same bar and you get a test worth running: can a colleague who was not involved, using only what is in the system, determine whether your result applies to their question, without contacting anyone who worked on it?

Note that the test does not ask them to reproduce your analysis, which is a stricter standard than most programs need. It asks whether they can decide that your answer is relevant to their situation, which is what people actually come to an archive for. Pull ten experiments from last year at random and try it. The result is usually uncomfortable, and it is specific enough to act on, because every failure points at a particular missing artifact rather than at a vague call for better documentation. Programs that pass have memory. Programs that fail have storage, and the difference stays invisible right up until the person who held the context leaves.

## What this makes the platform

Nothing about the software changed while this happened. The platform was funded as infrastructure for running tests, and it still runs tests, and it runs them reliably. But somewhere along the way it became the place where the organization keeps what it believes to be true, together with the evidence and the reasoning that justify believing it, biasing that trust. Nobody scoped it for that. The gap shows up the first time someone proposes switching tools, when the discussion stops being about features and turns into a question nobody has a ready answer for: does the record come with us?

It also messes with how you keep score. If what lasts is the record and not any one result, then experiment volume was never the measure. If you cannot tell which one describes your program, that is the finding, and you can check it this week. Something else was compounding the whole time, or nothing was. The experiment count looked the same either way.

## Notes

1. Errington, T. M., Denis, A., Perfito, N., Iorns, E., and Nosek, B. A. "Challenges for assessing replicability in preclinical cancer biology." eLife 10:e67995 (2021). 193 experiments from 53 papers; none described in sufficient detail to design a replication without author clarification; data needed to compute effect sizes publicly accessible for 4 of 193, and unobtainable for 68 percent of experiments even after contacting the original authors.
2. Scheel, A. M., Schijen, M. R. M. J., and Lakens, D. "An Excess of Positive Results: Comparing the Standard Psychology Literature With Registered Reports." Advances in Methods and Practices in Psychological Science 4, no. 2 (2021). Registered reports n = 71; standard literature sample n = 152; first hypothesis of each article.
3. Kohavi, R. and Chen, N. "False Positives in A/B Tests." Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (KDD '24), 5240-5250 (2024).
