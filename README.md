*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 1: Touch Grass](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)*

it's live on https://touchgrass.ilyasuperglue.tech/

## What I Built
I vibecode an app that give you randomize 3 quest everyday to touch some grass, cause me and y'all need it fr fr.

to complete the challenges you need to take picture of said quest, here is example screenshot : 

![this is the screenshot of quest](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/dadaeujgejbdj8f5seol.png)

the image later will be validated using [clip classification model](https://huggingface.co/Xenova/clip-vit-base-patch32)

the quest will be saved in zustand with local storage middleware, as for image validation API is using bun server deployed on [RENDER](https://render.com/) server $50 freeby. (thanks for the dot tech freeby too)

and the image will be compressed before feed to AI.

## Demo

[![Youtube video demo](https://youtube.com/shorts/O0q0p0Zh9vo)](https://youtube.com/shorts/O0q0p0Zh9vo)


### Live on Render server

https://touchgrass.ilyasuperglue.tech/

## Code
https://github.com/ilyaSuperGlue/sloptoberfest-touchgrass

## How I Built It
100% vibecoded using gpt 5.6 luna [light], but i tell them to use the tech stack i choose so i can review it later, which turn out i don't cause man, vibecoding is so depressing.

here is the stack :
- bun http serve
- react
- clip model
- zustand w localstorage middleware
- dayjs
- podman / docker compose




## Why Does Open Innovation Matter?
open source code is absolutely mattered because 90% of the internet probably built upon or has use some open source code project.

it also mattered for AI company so they can steal work from software developer hardwork to feed it to LLM and then replace developer job :)

like who cares if the software enginer job market crashed as long AI company monopolize tech industry it will be fine 

## My Agent Session
sorry judges i forget to add it, but i can promise you is 100% vibecoded, just look at it.

## Prize Categories
man just put the fries in the bag

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->

<!-- Thanks for participating! -->
