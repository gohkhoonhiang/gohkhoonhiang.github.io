---
layout: post
title:  Experience With Momocentral (Part 1)
date: 2016-05-17 23:18:17 +0800
tags: [momocentral, sharing, reflection]
description: This post is about my experience in attempting the coding test for applying to join MomoCentral.
---

When I went to the Facebook x GIT Hackathon last month, I got to know someone who is working as a freelancer for [MomoCentral](https://momocentral.com/). I got really interested to find out more, because the platform uses a coding test to shortlist candidates. I like coding tests as a way to assess potential candidates, because interviews do not reveal much about a developer's technical abilities.

So I signed up at the website, received an email with the link to the coding test, and started my journey in trying to become one of MomoCentral's talents.

<!-- more -->

# The Coding Test

The coding test consists of 3 questions. We are supposed to use their in-house programming language called `MokoM` to attempt the questions. I have not dealt with that many languages so far, but I find `MokoM` is a combination of Python and Javascript. They have a pretty comprehensive documentation and ample examples to help us pick up the language on the spot. I took about 20 minutes to read through the entire docs and understand the language's syntax and features. This is also the first time I properly learn about function scoping and closures.

After reading the docs, I started to attempt the questions. The first one was pretty simple, I guess it was used to filter out those who have difficulties learning another language on-the-fly. The second one requires some algorithms to solve, it didn't take me long to come up with a straightforward solution. However, when I submitted the solution, it took a very long time for the server to respond. I guess my solution is not very optimized and the server has to take a longer time to run my code against its test cases. While waiting for the server to respond, I figured that perhaps I should have used some optimization algorithms. So far I have spent only about an hour on the test, and I was pretty confident I could complete the entire test by the 3rd hour.

The final question was more demanding, but I still could figure out an algorithm to solve it. However, when I test-ran against the limited test cases, I kept failing at the same few cases with errors along the line of `IndexOutOfBound`. I kept checking my code but couldn't figure out where might have caused that error. At this point, I was pretty drained mentally, and I couldn't think straight anymore to debug my code. So by almost the end of the 4th hour, I decided to just submit the solution with partially passed test cases. I was pretty disappointed actually, because I was confident I could solve all questions eventually.

After submitting the last solution, I went back to look at the question again. To my horror, I actually interpreted the question wrongly! That explains why I kept getting the error. I felt really angry at myself for making such a mistake. I should have tried to read the question again before submitting the solution, then I could have had the chance to change my answer! However, all has been done, and there is no way for me to redo the questions. Nevertheless, I decided to still write out my solution in Python, ran and tested it, then translated into `MokoM`. Maybe I would have a chance to show this improved solution if I got a chance to do the video interview.

Right after I submitted my final solution, I thought all hope was lost. I remember reading the website that only the best scores will be selected for the next stage. Since my solution didn't even pass all test cases, how could I have gotten the best score? To my surprise though, I got an email from MomoCentral the next day, inviting me to do the video interview. This really made my day. Now, I'm waiting to meet the people at MomoCentral, and see if I can qualify to join them as a talent. Hopefully I won't screw up again during the interview like how I screwed up the test!

# Learning Points

Through this experience, I really thought a lot about myself. Here are some points that I found out after attempting the test:

## I'm still pretty impatient in doing things, even though I have tried to tame that down since a long time ago.

I know I'm very impatient, and I have tried to slow things down as much as I can. With this test though, this bad habit has come back and haunt me. It was stated in the test instruction that we can take as much time as we need to complete the test, because a good solution is better than a quick solution to them. Nonetheless, I couldn't resist the temptation to do things fast, because I don't think I can dwell on the test for many hours and still have my sanity. I think I did a pretty good job in not rushing to read through the documentation, because I know that learning the language correctly is the most appropriate thing to do. However, I did rush to write my solutions and submit them as soon as I could pass all limited test cases. This is perhaps the reason for why I could not come up with an optimized solution for the second question, and could not fix the last solution.

I should remind myself again that there is no need to rush through things, but to take my time to think through solutions. Remember that a good solution is better than a quick solution.

## I sort of forgot how to debug with lack of information.

I suppose that for fairness's sake, the test cases' inputs are hidden from us. We can only know the result and error message if any. Because of this lack of information, I found it difficult to debug the last solution. When I was working my first job, I often had to trace an error without knowing the input. Since I knew the system pretty well, I could guess what could have been the scenario that led to the error, and I was almost always right about my guesses. However, somehow this ability has stopped working when I was doing the test. My ability to imagine scenarios for a possible error has suddenly vanished when I needed it most.

I guess this is due to lack of practice. It's been a while since I last had the chance to debug something really difficult, because in my current job, the system is pretty well-written by my predecessors, and the errors encountered are almost always straightforward.

Perhaps it is time I go look somewhere to train my debugging skills?

## I still care a lot about the end instead of the means.

People have always said that the process matters more than the result. I should have celebrated the fact that I took the courage to attempt the coding test. It is one great way for me to test my coding skills, especially when this test comes from a recruitment platform. However, the moment I realized I failed the last question due to my careless mistake, I have forgotten all about my purpose for taking the test and the progress I have made so far. All the sense of achievement for learning a new language on-the-fly and completing the first 2 questions is lost, and I'm filled with disappointment. All I could think about at this point was that I have failed the test, *entirely*.

Once I have calmed down and reflected on the whole incident, I realized that perhaps I have been too obsessed with the outcome. No doubt that I didn't pass the last question, but I shouldn't ignore the fact that I have passed the first 2 questions. How could I simply say that I have *failed* when I merely just didn't complete 1 part of the test? That is taking away a lot of credits for myself, and I don't think it is healthy for my learning.

So, the next time I need to do something, I need to consciously remember to enjoy the process and celebrate the small wins along the way. Most importantly, I should learn from mistakes, instead of dwelling on them and forget all about the things I've achieved and learnt.

## Reflect on myself first, before blaming others for my mistakes.

I know this is a bad one, and I hate to admit I have done it. Right after submitting the test, I was asked to provide a feedback about the entire experience. It explicitly asks us to *please be honest*, so I did exactly it. In my feedback, I started with praising (with all sincerity and honesty) how useful and informative the documentation is, and how the questions are appropriate in gauging the developer's aptitude level. Then, I went on to talk about how the test cases have been unhelpful, because no input was provided, and only the results or errors were shown, worse is that the line number in the error message does not correspond to a line in my code. I even said that it was not fair for them to judge a developer's inability to debug if the test case information was incomplete. I'm not sure if the people at MomoCentral could sense it, but I wrote this with quite a lot of frustration because I couldn't fix the bug with limited information on the errors.

Once I realized that the bug was a result of my careless mistake, I immediately sent another response to them to tell them it was my problem and admitted that I wrote the previous response with a little frustration. Again, I'm not sure if the same people will read the second response, but I really felt it was only fair that I admit my mistake and apologize for criticizing their system.

As I did my reflection, I felt what I did was really unprofessional. I should have reflected on what I did wrong that causes the bug, instead of blaming it on incomplete test case information. Afterall, it is also expected of a competent developer to debug with limited information. There will be times that we are forced to trace an error without knowing the steps that lead to it, as I have encountered before in my job. This time, it is really my inability to debug without complete information that caused me to fail the last question, and I should not have blamed it on the system.

In the future, I need to remember to first look at myself before I start to push the blame to someone else, especially during the time when I feel frustrated.

# Conclusion

All the frustration aside, I really enjoyed taking the test. There aren't many ways for me to assess my own skills, and having such tests really help me find out where I stand. And through this test, I found out more about myself and my behaviour. This will help me improve on my weaknesses and be a better person thereafter. Now, I'm looking forward to the video interview next!

