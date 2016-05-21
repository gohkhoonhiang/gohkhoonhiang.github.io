---
layout: post
title:  Experience With Momocentral (Part 2)
date: 2016-05-21 23:43:28 +0800
tags: [momocentral, sharing, reflection]
description: This post is about my interview experience with MomoCentral.
---

So the day has finally come for the interview with MomoCentral! Overall I think it went quite well, except for the hiccup at the beginning when Chrome refused to detect my microphone in Hangouts.

Unlike the previous [post]({{site.url}}/2016/05/experience-with-momocentral-part-1/){:target="_blank"}  which I talked quite negatively about the experience, I shall share the second part in a more cheerful mood, because it really did make my day!

<!-- more -->

# The Video Interview

*I shall use initials for the name of the person from MomoCentral I spoke to, just in case he doesn't like it made public in a random blog like this.*

I spoke to J. from MomoCentral during the interview. At first, my Chrome didn't seem to pick up any sound from my microphone, so it took some time for me to finally get it work with Safari. It really helped that J. was very patient and friendly, so that calmed my nerves quite a bit. He started with introducing how MomoCentral works, and the kinds of clients using the platform. Expectedly most clients are looking for developers who do web or mobile, so my current skills in Java don't really fit well. I then talked about what I did in the past, and he commented that it must have been quite boring, no offense to my previous employer, but that's my sentiment exactly. When all chit-chatting was done, it's time for real fun!

# Coding Test Revisited

I expected to be asked about the coding test, and specifically the last question which I didn't solve during the test. I explained my mistake in interpreting the question, and surprisingly I was not the only one who made the same mistake. With this wrong assumption about the question, I ran through my logic for the solution. He then asked given that now I know the correct assumption for the problem, how would I solve it? Fortunately, I have prepared my solution beforehand, so I was quite ready to show him the code. After fixing some syntax issues, he ran my code again with his set of test cases. This solution still failed some test cases, so he showed me the test case to fix my code. Upon seeing the test case, I finally understood why I have failed 1 test case with `Wrong answer` during the test, it's because I have not taken into account a boundary case. 

Once my solution has passed all test cases, it was time for the Big O. Knowing that I had studied CompSci, J. decided to ask me to analyze the complexity of my solution. Honestly I haven't done any analysis since I finished the algorithm analysis module in Uni, so I just tried my best this time. Though I have forgetten most part about Big O, it's good that I was able to give a pretty close answer. Up to this point, everything has been pretty smooth, at least I felt quite calm during the whole process, which is good sign.

# Real-time Coding Challenge

I knew there will be a live coding challenge, and this is also the most exciting part about the whole interview. The last time I was thrown a problem and was expected to solve it on the spot was during my programming module in Uni, which I didn't do very well.

I'm really glad that I have picked up Python along the way as a second language. The coding challenge has been made much easier when written in Python instead of the overly-verbose Java. Anyway, I tried to think of a more optimized solution but at this point, my brain seemed to start to slow down a bit. Instead of spending time to come up with nothing, I decided to brute-force my solution for a start. I didn't really keep track of how long I took to come up with the first version of the solution, but I think it should be about 10 minutes. Again, J. asked me to analyze the complexity, but I was wrong for this one because I forgot to take into account the complexity of checking a value in a list, so it actually ran in approximately O(N^2). He didn't give up and pushed me further to write a faster solution based on the current structure. With a bit of hint from him, and pushing myself to think harder, in about another 10 minutes I came up with a solution that is approximately O(N).

# Post-mortem

Before we ended the interview, I asked him about the possibility of getting an assignment for a framework I have barely used. He suggested that while there have been cases where freelancers have been given a try on new frameworks, it is still best that I can build a nice portfolio of side projects that can catch the clients' attention. It also surprises me that Ruby on Rails is quite significantly in demand compared to Python-based frameworks, which means Rails will probably have to be on my TO-LEARN list. 

Overall, the interview has been an enjoyable one. Again, I really like the live coding challenge. It's an opportunity to test my ability to solve problems on the spot under the pressure of limited time, I'm glad to say I think I did pretty well. Of course, there will always be room for improvements, so here are some points for me to take note and improve on.

## Be Versatile

So far I haven't really spent much time on picking up new skills. Although I have tried to pick up Python, I'm still stuck with just 1-2 languages at my disposal. Knowing that the freelancing marketplace demands more Rails developers than Python developers, it seems I still have a long way to go in becoming a in-demand developer. Therefore, I have to expand my list of skills by trying more things, instead of only dwelling on the things I already know.

## Always Be Coding

I stumbled upon this [blog](https://medium.com/always-be-coding/abc-always-be-coding-d5f8051afce2#.4mvwc0r5l){:target="_blank"} sometime back. The only way to show that you have done something is to actually do it. My Github account has been dormant for a long time since I have created it. Having been advised by J. that the more side projects I have done, the better the chance I can get a client's attention, it's time for me to turn those squares on the contribution chart on Github green. There are a lot of things queueing up in my [projects list]({{site.url}}/projects){:target="_blank"} and I hope I can find the time to check them off one by one eventually.

## Just Be The Best You Can Be

This one sounds odd in this context, but I feel I should really bring this up. I have to admit that all this while I have been very anxious about the process of trying to become a better engineer. All the worries about not being able to meet the expectations of a good engineer have caused me a lot of stress and sometimes depression. But after this experience with MomoCentral, I realized that I'm actually probably on the right track. While I still don't know a lot of things a good engineer should know, at least I have been able to complete most tasks given by them. I must believe that I have the potential to eventually become a better engineer, because utlimately *being better* really just means being better than my previous self. I think this will be a better approach for me instead of trying hard to achieve the *absolute* standards of a good engineer.

# Conclusion

After actually talking with J. from MomoCentral, I really admire what they are doing there. Coming up with their own programming language to test potential candidates shows that they are not biased against any language background, and also appropriately test a developer's ability to pick up new languages. They have also put a lot of thoughts in designing the entire screening and interview process. Although I personally find it quite daunting, I believe that actually seeing the person code on the spot is a much better way to gauge his skills as compared to just reading resume. At the same time, they are very encouraging and try to provide reasonable amount of guidance during the test, because no one is ever perfect and can come up with a solution with the snap of their fingers. Another nice thing is that they have a Talent Manager for each freelancer to sort out billing and act as a career coach, which shows that they are willing to groom a talent to become better at what he does, at the same time serving the evolving demands of the market.

Having said all these, I hope the interview will turn out well and that I get to join this exciting freelancing marketplace!

