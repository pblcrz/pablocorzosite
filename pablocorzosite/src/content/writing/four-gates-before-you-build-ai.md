---
title: "Four Gates Before You Build AI"
number: 6
kind: "Article"
pillar: "AI"
deck: "Cheap prototyping removed the filter that used to kill weak AI ideas before they shipped. Four gates put it back - each one far cheaper to check now than to regret later."
published: 2026-07-31
readTime: 6
featured: true
primaryIdea: "ai-foundations-for-product-leaders"
relationships:
  - target: "ai-enabled-or-ai-native"
    type: "builds-on"
    note: >
      Picks up where that piece left off: once you know what kind of system
      you're building, these four gates decide whether the feature should exist
      at all.
---

[Last time](/writing/ai-enabled-or-ai-native) I argued that the first AI decision is architectural. Turn the model off and look at what is left. What survives tells you what kind of system you are really building.

That article was about the kitchen. This one is about the menu.

A chef adding a dish does not ask if they can cook it. That is the easy question. They ask whether anyone will order it, whether it can be sourced consistently, and if it will sell at a margin that keeps the lights on.

The problem is, AI discovery mostly asks the first question, gets a quick yes, and starts building without getting to the other three.

## The filter that disappeared

Product ideas used to be triaged and sorted by cost. When proving an idea took a quarter and a team, only a handful of ideas ever reached the point of being worth building. The expense did the sorting before anyone had to make a judgment call. Bad ideas died of exhaustion in the backlog, and nobody had to defend the decision, because nobody had to make one.

That is over. A working AI feature now takes days to prototype, and it demos beautifully. Ideas that would have died quietly now arrive at your roadmap finished, with a stakeholder attached who has already watched it run and wants it in a week.

Unfortunately, nothing has replaced that filter in AI workflows yet. The solution? Gates. Four of them to be exact. They run in order, and each one costs more to fail than the one before it.

## Gate 1: Intelligence

Knowing when not to use AI kills more ideas than the other three gates put together. There are three tests, and they are quick.

1. **The microwave test.** Press the same button, get the same result, every time. Account balances. Invoice totals. Who can see which folder. A model that is right ninety-nine times out of a hundred is fine for a summary and a disaster for a balance. Use code.
2. **The line cook test.** The problem follows a recipe. You can write the steps down and the list ends. Route the ticket by category. Apply the discount over fifty dollars. Rules are cheaper, faster, auditable, and right every time. Teams walk past rules because rules feel unambitious. A router that works is not unambitious.
3. **The executive chef test.** The input is a mess and the rules keep moving. Somebody's email. A forty-page contract. A support thread with six people arguing in it. Nobody can write the recipe down, because it changes with the ingredients. This is the one worth paying for.

Underneath all three sit two properties: how structured the input is, and whether the answer has to be exact.

|  | Answer must be exact | Variation is fine |
| :---- | :---- | :---- |
| **Clean input, fixed rules** | Ordinary software. A database query. | Enrichment. Tagging, sorting, extraction. |
| **Messy input, moving rules** | The trap. Brittle parsers and heuristics. | The opportunity. Reasoning over context. |

The opportunity is the only box that is clearly asking for a model.

The trap is the one to watch, and a popular one organizations are investing in. Messy input, exact answer required. Ten thousand invoices, no two laid out the same, and you need the totals right. Regular expressions break on inputs that are messy, so a model looks like the answer, but it is not.

The way out is not to pick a side. Let the model read the invoice and let ordinary code check the arithmetic. Or send the uncertain ones to a person, and accept that your exception rate is the real product.

Enrichment sits in an interesting middle ground. When categories are totally fixed, a regular database query or hardcoded logic usually handles it. But if the categories drift or keep moving, you are actually dealing with moving rules. Reach for a big model when categories keep shifting under your feet, or when volume is too low to justify training a small, steady classifier that won't change its mind the week a vendor pushes an update.

The failure this gate catches is not bad AI. It is a model doing a job a hundred lines of code would have done better, and two quarters spent trying to make it as reliable as the code option would.

## Gate 2: Improvement

A feature that answers and forgets is a wrapper. It works. People might even like it. And anyone can copy it by Friday, because the part that makes it good comes from a vendor who provides it to others too. Everyone is shopping at the same market.

The difference between that wrapper and a product is a closed feedback loop. It is the only part of your system that compounds. It takes five steps, and most teams build three.

Let's look back at the kitchen.

A guest orders the salmon. No butter, extra lemon. Step 1. The runner checks their file and sees they asked for the same thing in March. That is step 2. The chef cooks to the note, making it step 3. Most software stops here, at launch. And so do most kitchens.

The experience continues though: the plate comes back half eaten, lemon untouched. The runner asks why, the guest says too dry. That is a new step, 4. Somebody writes _their salmon, two minutes less_ on the card, where the next chef will read it on the next shift, becoming step 5.

One through three are a vendor's API and a database lookup. Four and five are the only parts a competitor cannot buy. They can rent the same model and copy the same schema, that's all.

A feature that does not learn from being used is an API wrapper with your logo on it, a subscription your competitor can also buy and build.

Unlike a human line cook who reads a card for the next shift, automated software loops require deliberate operational overhead. Passive collection is not enough; turning edits and deletions into fine-tuning, dynamic prompts, or updated evaluation sets requires real data engineering.

The test is in these three questions, and you need all three:

1. **What is the signal?** Not a thumbs up. The edit somebody made to your draft before sending it. The suggestion they deleted. The question they asked again ten seconds later, differently.
2. **Where does it land?** Somewhere that changes what the system does next time. What gets retrieved. What sits in the prompt as an example. What the evaluation set contains. A dashboard is not a destination.
3. **Who owns it?** A name. Not the team - the team is still nobody.

## Gate 3: Economics

Normal software costs almost nothing to serve one more user. That is why SaaS runs at eighty to ninety percent margin.

As I covered in [The Cost of AI](/ideas/cost-of-ai), AI features come with a bill. It arrives monthly, and it grows with use.

The math fits on a napkin:

<pre class="napkin">Cost per answer  =  (words in &times; price in) + (words out &times; price out)
Cost per user    =  cost per answer &times; answers per day &times; 30</pre>

Run it on the usage you want, not the usage you have. Then run it on your heaviest user, who does ten times the volume of everyone else and costs you ten times as much.

Sit with that one. In normal software your heaviest user is your best user. In an AI product they are your most expensive one, and on a flat monthly price, the more they love it the more they cost you. That is not a pricing detail you clean up later. Pricing and context budgets are the same conversation, and it has to happen before launch. Fixing it usually means shifting away from flat-rate tiers toward usage-based caps, dynamic token limits, or enterprise variable pricing before adoption exposes you.

Latency comes with its own bill, set by what the user is doing rather than by what the model can do.

| What the user is doing | What they will tolerate | What buys you room |
| :---- | :---- | :---- |
| Typing, with help appearing inline | Under 200ms | Smaller models, caching, local execution |
| Having a conversation | Under a second and a half to first word | Streaming, visible progress |
| Handing off a task and walking away | Seconds to minutes | Progress steps, notify when done |

The last row is the one to notice. Move a task into it and everything upstream gets cheaper. A user who has agreed to wait will let you use a bigger model, more context, and a second attempt. The same task in a chat window will not.

This leads directly into safety: asynchronous workflows and waiting periods also buy you the room needed for the heavy guardrails and verification checks required in Gate 4. Interaction design, unit economics, and risk mitigation are all part of the same puzzle.

## Gate 4: Failure

Ask what happens when the answer is confident and wrong.

In a brainstorming tool, a wrong answer is a bad idea. The user scrolls past it and thinks nothing of it. In contract review, a wrong answer is a missed clause. In clinical support, it is somebody's afternoon going very badly.

Two things set the shape of the answer: how bad the failure is, and how much the feature is worth when it works.

|  | Low value when it works | High value when it works |
| :---- | :---- | :---- |
| **Cheap to be wrong** | The gimmick. Do not build it. | Ideal. Ship it and learn in production. |
| **Expensive to be wrong** | Unviable. Nothing here covers the risk. | Buildable, with sources, checks, and a human signing. |

Bottom right is where the durable enterprise products live, and they are expensive on purpose. Answers grounded in something you can click through to. Checks that run before the user sees anything. A person who signs. The system drafts, the human decides. The cost of those guardrails is the moat.

Top left deserves more attention than it gets. Nothing at stake, nothing gained, trivial to build. The summarize button nobody presses twice. The chatbot on a page that did not need one. Nothing breaks. Nothing improves. It ships, it demos, and it eats a slot something else needed. These are the easiest features to build and the easiest to justify, which is exactly why they pile up.

## What the gates cost

All four are cheap. A conversation, a spreadsheet, and the nerve to bring them forward before somebody builds the prototype.

Skipping them can be expensive, and the bill eventually comes. It shows up when a model spends a quarter failing at a task a regular script should have owned. It shows up when a feature flatlines on day one because nobody engineered a way to learn from it. It shows up the month everyone is celebrating because tons of people are finally using your product, but your bill comes in and you realize you are losing money on every single click. And it shows up when you have to turn away your biggest, highest-paying corporate clients because you never figured out how to keep the model from making dangerous mistakes.

You can get any ingredient now, today, for almost nothing. That is exactly why the menu is the hard part.

Decide what you are willing to serve.
