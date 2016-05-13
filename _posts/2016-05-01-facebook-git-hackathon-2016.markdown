---
layout: post
title:  "Facebook x Girls In Tech Hack For Cause Reflection"
date:   2016-05-01 11:33:00 +0800
tags: hackathon
description: This post is about the experience of my first ever hackathon.
---

# Introduction

I'm writing this about 3 hours since leaving Facebook HQ Singapore, after more than 12 hours of hacking and technical workout.

It's my first real hackathon ever. By chance, I saw a Facebook post about this event, which is a hackathon to solve one charity organization, [Dayspring](http://dayspring.org.sg)'s problems. I decided to just attempt the technical challenge and test my technical ability, and see if I could actually join the hackathon. When I got an invitation to the event for successfully ranking top 30s in the test, I thought maybe there weren't many participants so I had the chance to go. It was then encouraging to hear from the organizing team that there were actually over 500 submissions and I got to where I was because of my technical skills.

<!-- more -->

It was pretty exciting yet stressful for me prior to the event. On one hand, I was excited that I could join a hackathon for real, because I haven't been to one. On the other hand, I felt that I wasn't prepared for such a feat just yet and felt stressful about whether I could contribute to the event at all.

# Preparation

I read up on what problems we were supposed to solve for Dayspring. They needed a revamp for their donation portal where they can capture donor's details for tax reporting and also for data analytics. They also wanted a mobile app for one of their campaigns: *Message of Hope*. I figured that since I have zero background in mobile apps, I should try to solve the donation portal problem.

For that, I made myself to pick up Tornado framework. *See [My Tornado Tutorial](http://gohkhoonhiang.github.io/coloredlist/).* I figured that it's probably most appropriate to use Python based frameworks for a hackathon due to how fast we can iterate with them. However, I didn't have enough time to learn more in-depth Tornado before the event.

# Actual Day

When I was finally at the event and started mingling around with other participants, I felt so much inferiority comparing with them. There were those who have been hacking since secondary school (there were actually secondary school students at the event as well); there was one who took the effort to come despite having an exam in a few hours' time; there was one who has started her own company teaching programming to young children. I felt out of place because I haven't heard of most of the things they have done and they appeared so technically strong. I secretly hoped that I wouldn't mess up my team's code, if I ever formed one.

I felt really fortunate that I had found a team where I might be able to use my skills in Python. My team's setup is pretty interesting. We have 2 C# developers, 1 front-end developer, 1 C developer and a Java developer myself. After brainstorming, we decided to use C# and Python for the backend, since the C developer and I also know Python. We will have a donation portal running on a C# server, then another Python server for data reporting. With this configuration, every team member's skills in different languages can be utilized.

My partner and I decided to use Django because she has experience in the framework and we would have base code to work with immediately. Since I haven't used Django before, she helped set up the backend API server and I pulled the settings she has set up and tried to work from there.

# Setup Nightmare

The settings were based on the assumption that I was running a Linux/Unix based machine. However, it actually has problems with a MacOS machine. I have tried installing PostgreSQL dependencies for a great 3 hours, spending 1/4 of our hacking time. I was feeling a little discouraged at this point, because I haven't started contributing to my team. Telling myself that there is no point giving up now, I changed strategy and used SQLite instead. Finally I got the server to boot up.

*EDIT: I got so tired at this point I decided to stop writing and go to sleep. The remaining of this post is written after I have gotten a good rest.*

# Hacking Time

As mentioned, we have a C# server capturing the donation data. It exposes a few APIs for the Python server to get the donation data. After some manipulation, the Python server will return the data via APIs for the admin portal.

Since I have spent so much time setting up, my other team mates have already gone ahead with what they were supposed to do. In the end, my partner and I decided that she would do the APIs and I would code the logic for data manipulation so that I didn't have to deal with Django itself. Finally I coded 3 functions for reporting:

* Get the monthly donation amount of a given year
* Get the monthly actual donation vs target donation amounts of a given year
* Get the number of donors who have not donated in the past X number of days/weeks/months/years

There were some bugs here and there when I coded the last function, because it was most complicated and my mind was getting sleepy towards the end of the hackathon. Nevertheless, I still managed to fix those bugs. It was a pity I couldn't start on 1 more function I was supposed to do, which was to get the top ranking donors. My partner has been helpful to take over this feature.

# Sharing Time

Despite my setup nightmare and buggy reporting functions, we managed to complete what we planned to achieve ahead of time. So our team just started chit-chatting and sharing our experiences amongst ourselves. It was really eye-opening to hear about what my other team members are doing in their current job. Coming from a company that is not tech-based, I realized that I haven't been exposed to a lot of the cool frontier technologies they have been using in their companies. It stirred up a desire in me to want to work with such companies where I can be exposed to various tools and technologies.

# Award Presentation

When the time came for every team to present its idea and prototype, it was interesting to see how much people can actually do within such a short amount of time. There was even one brave solo lady developer who came up with the *Best Creative Idea* of a charity organizations aggregator app. Whereas for our team, we managed to win the *Most User-friendly App* award.

# Learning Points

I reflected on the whole event and came up with a few learning points.

## Come Prepared

Even though everyone has different skills and language background, it was unofficially stated on the event group page that it was recommended to use Django as the backend framework. Meaning that I could have done the setup for Django prior to attending the event. Then I wouldn't have spent so much time setting up my dev environment during the actual event, and could have better used the time to write better code or even complete the 4th function I was supposed to write.

## Background Does Not Matter, Desire Does

So I mentioned there were secondary students at the event, they have actually only started coding for 4 months by now. Did it matter that they were not experienced programmers? Not really. Of course realistically we wouldn't expect 4-month old programmers to be able to come up with a full-fledged web app by themselves. But the fact is that they managed to be one of the top 30s in the coding challenge, and they actually shipped a front-end webpage by the end of the 12 hours with coaching from a more senior developer in their team. It just shows to me that background is not the main concern, but the desire to do something is what matters more. So I tell myself that it doesn't matter that I have been doing enterprise systems without using the cool frontier technologies, but the more important thing is that I should have the desire to pick up those tools on my own in my spare time, or actually have the courage to stop doing enterprise systems and venture into tech startups/companies.

## Don't Underrate Yourself

There is a difference between being humble and underrating yourself. I felt intimidated by the background and experiences of most of the participants there. I felt I didn't contribute much to the team because I spent a good amount of time setting up, and I only coded 3 functions which were painfully slow. I felt that my presence was not required at all because they could've done what I did without me. But after some reflection, I realized that I should probably give myself some credits. First, I took up the challenge to attend a hackathon, something I have not done before. It was a first step out of my comfort zone. Second, I took the courage to use Python for the project even though my primary language is Java. Setup issues aside, it was during this event that I realized I can now use Python to write something that works, although still not optimized and structured. Most importantly, I actually *did* contribute. I actually wrote the 3 functions. I actually spoke during the presentation. Regardless of whether the team could have done without me, it is a fact that I did something during the event. This itself is enough a reason to give myself a pat on the back. So from now on, I should learn to be humble about what I can do, instead of always underrating my skills.

## With Great Empathy Comes Great Ideas

So I mentioned the brave solo coder who came up with the idea of a charity organizations aggregator app. In my most honest opinion, I think she really deserved the *Best Creative Idea* award. While other teams have also come up with very practical and beautiful web apps, I have to say that we were just only solving a problem customized for the organization. However, because she has so much empathy for the people who are in need of help and support from a charity organization, she was able to come up with this idea that will facilitate even more people to seek help and support. This makes me realize that an idea should always be about solving people's problems. To do that we actually have to be in their shoes and experience their pain, then we can know what kind of solutions would work best for them. So I hope that in the future, if I really decide to join the startup scenes, I would be able to do the same: solve people's problems from their point of view and not because it's lucrative business.

## MacOS Is Not An Ideal Development Machine

I used to think MacOS is a much better development machine compared to Windows because how it is Unix based. After the setup nightmare, I realized that it is actually not quite the case. It seems that settings on the Linux machine aren't 100% portable to a MacOS machine, which was what I encountered when installing Django. Because of this, I decided to setup a Digital Ocean account, spinned up an Ubuntu server, so that I can start development on a Linux machine. Hopefully I will encounter less setup issues in the future.

# After Thoughts

Even though it was not a 100% pleasant experience, I did enjoy being part of this event. It brought me back to the school days, when I coded together with a team of awesome developers on awesome projects. And through collaborating with these people, I got to know about cool tools and learn new things. This is something I won't be able to experience if I were coding on my own or being in a corporate IT department. I hope I will go ahead and join more hackathons in the future, although I doubt if I can withstand another 12 hours of no-sleep non-stop hacking.
 
