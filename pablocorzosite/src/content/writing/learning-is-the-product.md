---
title: "Learning Is the Product"
number: 17
kind: "Article"
pillar: "Experimentation & Measurement"
deck: "Experiment volume looks like a staffing number. Take it apart and most of it is knowledge the program produced and lost."
published: 2026-07-22
featured: true
primaryIdea: "experimentation-compounds"
relationships:
  - target: "experimentation-platforms-are-becoming-organizational-memory"
    type: "builds-on"
    note: >
      Takes that piece's claim — the platform's real output is preserved
      reasoning — and shows what the lost reasoning costs: it is what caps a
      program at ten experiments a quarter.
  - target: "from-first-hypothesis-to-institutional-knowledge"
    type: "builds-on"
    note: >
      Extends its argument that cheaper experiments only widen the gap between
      programs that keep knowledge and those that lose it, by tracing the
      mechanism to the specific costs memory removes from each test.
---

Here is the pattern I keep running into. An experimentation program has plenty of traffic, a backlog of forty ideas waiting to be tested, two capable analysts, and modern tooling. It runs about ten experiments a quarter. It ran about ten last year, and about ten the year before. Nothing appears broken. The statistics are sound. The platform works. The team is competent. Yet the number barely moves.

That problem is usually explained as a prioritization issue, a staffing constraint, or simply the natural capacity of the program. Eventually, ten experiments a quarter becomes accepted as "how many we do."

That explanation stops too early. Something makes it ten, and nobody is asking what.

## Why the count is worth arguing about

Azevedo and colleagues modeled experimentation as a screening problem and measured the distribution of true effect sizes using experiments from Bing's platform. They found extremely fat tails. The typical idea is worth close to nothing, most do nothing at all, and nearly all the gain comes from a few rare large winners. That shape has a consequence they draw out at length, which is that a program is better off spreading its sample across more attempts than concentrating it in a careful few.¹

How far to take that is a live argument in the field, and not one I am going to settle. Kohavi and colleagues, reporting on Bing's platform, note that a one percent revenue improvement is worth more than ten million dollars a year in the US, and that many ideas move key metrics by roughly that much. Detecting an effect that small takes an enormous sample.⁵ So the size of the valuable tail is contested even inside the same company's data.

The part that matters here is not contested. If the winners are rare and you cannot tell in advance which ones they are, how many you try is not a detail. Which makes ten tests a quarter something other than an efficiency statistic. It is the width of the net. And in every program I have been close to, that width gets treated as a fact about the team and left there.

## What the model holds still

The paper does what models do, which is fix some things in place in order to see others clearly. It takes the pool of candidate ideas as given and asks how best to spend sample across it. That is the right question if the pool is the part you cannot change.

In the programs I have worked in and around, the pool is the part that moves. What decides how many ideas get screened in a quarter has little to do with sample allocation, and a great deal to do with three things sitting outside the model. Each of them is made of something the program once knew.

## What three weeks is made of

An experiment costs you two separate things:

1. Traffic. Meaning how many users have to pass through before the result means anything.
2. People's time. Someone designs the test, decides what to measure, gets tracking in place, waits, reads the result, and walks it to a decision. Call it three weeks. That three weeks is roughly the same whether the test needs two hundred thousand users or two million.

Which of the two is binding decides what helps. If traffic is short, statistics help. Variance reduction using pre-experiment data, introduced as CUPED and now standard practice, gets the same answer from a smaller sample by stripping predictable noise out of the measurement.² More tests fit in the same traffic.

But traffic is frequently not what a program runs out of. Ten million sessions a quarter is plenty. Two analysts is not. Two analysts at three weeks a test is around ten tests a quarter, and no amount of statistical cleverness produces an eleventh, because the shortage was never in the sample.

Three weeks is mostly spent on things that were settled before.

| Where the three weeks goes | When it did not have to |
| :---- | :---- |
| Defining conversion for this test. | It is already defined somewhere everyone trusts, and nobody wants to reopen it. |
| Deciding which guardrails matter on this surface. | Somebody settled that two years ago and had reasons. |
| Guessing how large an effect to look for. | Eleven similar tests already fixed the range, so the power calculation was an hour of work rather than a week of argument. |

Every one of those is the archive doing work, and every one is made of the reasoning [the previous piece](/writing/experimentation-platforms-are-becoming-organizational-memory) argued documentation throws away. Which is also the mechanism behind a claim made in ['From First Hypothesis to Institutional Knowledge'](/writing/from-first-hypothesis-to-institutional-knowledge): that lowering the cost of running experiments only widens the gap between organizations that turn results into knowledge and organizations that accumulate a larger pile of forgotten ones. It widens because the cost that got cheaper was never the one separating them. Better tooling and AI-assisted analysis pull the traffic cost down for everyone, including the program with no memory at all. The time cost only falls where the reasoning was kept.

## What the program already found out

Some of those ten tests are not new. A question gets re-litigated a year later by someone who never saw the first answer (a new hire, for example), and a slot goes to re-establishing something the program already knew. [The previous piece](/writing/experimentation-platforms-are-becoming-organizational-memory) explained why this happens: most results are flat or negative, but nobody writes a deck about a flat result, and so the record of what has already been tried is the part most reliably missing.

The same gap decides where the remaining slots point. The record of where a program has looked and found nothing is what separates untried ground from exhausted ground. Without it, a surface that has come back flat nine times gets tested a tenth, and whole areas go untouched, not by decision but because nothing ever told anyone they were untouched.

That map is considerably harder to read in a marketplace, where the space is a grid rather than a list, because a change on one side moves the other. Raise a floor price and demand bids differently, which changes what inventory clears, which changes what supply sees the following week. A flat result on one side may not be flat at all. It can be two effects cancelling across sides, which is a different finding pointing somewhere else. So the record has to hold which side was changed and which side was measured, or the map cannot be read even by the people who drew it.

I want to be clear about something. The research describes the large wins as rare and unpredictable, and I have no basis for claiming a good archive tells you where the next one is. What it does is stop you looking in the same place twice and show where you have not been.

## What nobody can say for certain

The third is the one I think is least discussed and most expensive. Concurrent experiments interfere. Some collide outright, breaking the experience in ways that have to be prevented. Others coexist but bias each other's estimates. Google built its overlapping experiment infrastructure to work around exactly this, partitioning traffic into layers so that experiments incapable of interacting are free to run at the same time.³ The scarce resource in that design is not sample. It is containment.

What I have watched happen is that programs without that knowledge serialize defensively. Two tests that could almost certainly have run together get staged one after the other, because nobody could say with confidence that they would not interact, and the cost of being wrong is a contested result that damages trust in everything around it. That is a rational decision, and an avoidable one, because somewhere in the history of the program is the information about which levers actually touch each other, and it was never written down in a form anyone could act on.

So the pool shrinks for a reason that looks like infrastructure and is actually memory.

## A test is worth more than its result

Take a test on frequency capping. It runs three weeks and comes back flat. The readout is a single line: no significant effect, no change recommended.

Here is what the program owns the next morning, assuming somebody kept it.

- A definition of the frequency metric that survived a review nobody wants to sit through twice.
- The guardrails somebody decided mattered on that surface, and the reasoning for choosing those and not others.
- A ceiling on the effect: whatever the test was powered to detect and did not find.
- Evidence that this lever and the one running beside it did not interfere.
- One fewer place worth looking.

The result was flat. The residue is five things the next test does not have to produce, and they land on all three constraints at once: three of those items relate to 'time per test', one to 'the isolation problem', one to 'the map'. None of it depends on the test having worked.

That residue does two things. It decides how many tests get run at all, which is what the three constraints govern. And it decides how much of what comes back can be believed, because running more tests on smaller samples produces more results that look like wins and are not. [The previous piece](/writing/experimentation-platforms-are-becoming-organizational-memory) made that point from the other side: when only ten to twenty percent of tests succeed, a good share of the ones clearing the bar are noise. Widen the net and you catch more of them. Something has to separate the real wins from the flukes, and the body of past results is what does it. Empirical Bayes uses the spread of results across many earlier experiments to sharpen the estimate from any single one.⁴ A program that tests broadly needs that more than a careful one does.

So the record sets how much a program can look at, and then how much of what it finds it can believe. That is what an experimentation platform makes. Not the software, and not the tests. The accumulated reasoning behind both, and it is the only thing the platform makes that gets bigger the more it is used.

## The same two analysts

None of that changes headcount. The program still has two people and the same ten million sessions. But three weeks becomes two once the metric is already defined, the guardrails are already settled, and the range is already known. One of the ten was a re-run and is not anymore. Two that were staged apart now run side by side, because somebody can finally say they do not touch.

Ten becomes fourteen. Nobody was hired, no new tooling was bought, and from the outside the program looks identical. Fourteen is not an impressive number. It is forty percent more attempts at something rare, which is where the returns live if the winners are as rare as that work suggests.

## Three things you can check

| Constraint | What to count | What a poor number means |
| :---- | :---- | :---- |
| Time per test | Of your last ten experiments, how many design decisions were inherited from the record rather than invented: metric definition, guardrails, the effect size you powered for, segments, runtime. | Every test is starting from zero, and three weeks is what starting from zero costs. |
| The map | Of the experiments launched this quarter, how many posed something the archive had already settled. | Part of the net is being spent on ground the program already covered. |
| Isolation | How many pairs of levers the program can state with confidence do not interact, as against pairs it has been quietly avoiding. | Capacity is being rationed against a risk nobody has measured. |

The third is the one I would run first. It is the least likely to have ever been asked, and the most likely to be costing slots this quarter.

I built a version of this before I had a name for it. When I stood up an experimentation platform in-house, I intentionally built the operating model to hold on to the things teams normally re-derive every time. The numbers I reported were lead time down forty-one percent, volume doubled, and revenue per visitor up three percent. What I did not report was why the lead time moved, because I had no language for it then. Each test was starting further along than the one before it.

## The output does not execute itself

There is a limit to how far this goes on its own. A platform can produce learning that its organization then sets aside. The metric can be defined, the range known, the layers mapped, and a decision can still go to whoever spoke last in the room.

So the output compounds only where an organization has decided that this is what it wants from the platform. That decision does not get made in a roadmap, or by the team that owns the tool.

## Notes

1. Azevedo, E. M., Deng, A., Montiel Olea, J. L., Rao, J., and Weyl, E. G. "A/B Testing with Fat Tails." Journal of Political Economy 128, no. 12 (2020), 4319-4377. The supplementary material adds a qualifier that matters here: where fixed costs per experiment are large, the benefit of a small experiment may not cover them, which pushes a program back toward fewer and larger tests.
2. Deng, A., Xu, Y., Kohavi, R., and Walker, T. "Improving the Sensitivity of Online Controlled Experiments by Utilizing Pre-Experiment Data." Proceedings of the Sixth ACM International Conference on Web Search and Data Mining (WSDM '13), 123-132 (2013).
3. Tang, D., Agarwal, A., O'Brien, D., and Meyer, M. "Overlapping Experiment Infrastructure: More, Better, Faster Experimentation." Proceedings of the 16th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (KDD '10), 17-26 (2010).
4. Azevedo, E. M., Deng, A., Montiel Olea, J. L., and Weyl, E. G. "Empirical Bayes Estimation of Treatment Effects with Many A/B Tests: An Overview." AEA Papers and Proceedings 109, 43-47 (2019).
5. Kohavi, R., Deng, A., Frasca, B., Walker, T., Xu, Y., and Pohlmann, N. "Online Controlled Experiments at Large Scale." Proceedings of the 19th ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (KDD '13). On how sample requirements scale, see Kohavi, R., Tang, D., and Xu, Y., Trustworthy Online Controlled Experiments: A Practical Guide to A/B Testing (Cambridge University Press, 2020), which notes that detecting a 1% improvement to conversion requires roughly 25 times the users needed to detect 5%.
