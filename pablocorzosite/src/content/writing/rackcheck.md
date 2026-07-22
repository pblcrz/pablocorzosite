---
title: "RackCheck"
number: 7
kind: "Prototype"
pillar: "AI"
deck: "Point a camera at a gym rack, get the equipment identified and matched to the lift you are about to do."
published: 2026-02-10
draft: true
externalLink: "https://example.com/rackcheck"
featured: true
---

I train before dawn at a gym that rearranges its floor every few weeks. The problem I wanted solved was small and specific: walk in, look at what is free, and know in two seconds whether today's session is possible.

That turned out to be a good prototype brief, because it is a hard perception problem wrapped in a trivial interface. There is nowhere to hide behind product polish.

## What I learned that transfers

The interesting failure was not accuracy. It was what to do at low confidence. My first build hid anything under a threshold, which is the technically defensible choice and the wrong product choice. An empty screen at 5:15am reads as broken, not as cautious.

> Hiding uncertainty does not make a system look confident. It makes it look broken.
