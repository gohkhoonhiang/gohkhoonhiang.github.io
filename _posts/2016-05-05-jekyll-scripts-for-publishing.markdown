---
layout: post
title: Jekyll Scripts for Publishing 
date: 2016-05-05 00:34:29 +0800
tags: [jekyll, shell-scripts]
description: This post is about writing shell scripts for Jekyll publishing
---

I started using Jekyll out of curiousity, and also because I thought it would be more convenient if I host my blog on Github Pages (it's free), together with all my coding projects. While other blogging platforms like Wordpress and Blogger are feature-rich, I found them too complex for my simple use. I just need a place to write and specifically, to write about tech stuff, which will include a lot of codeblocks. Markdowns are perfect for code syntax highlighting, and since I use Vim for code editing, it's even easier for me to copy-and-paste code blocks into my blog posts.

<!-- more -->

That being said, the process of creating a new post, drafting it and publishing isn't automated. It simply doesn't make sense for me to create a new post and have to type the metadata every single time. I could do a copy-and-paste from an older post, but I have to delete the content and replace the timestamp, tags, title etc., which isn't very productive. So I wrote some scripts to help with creating a new post, publishing a post from draft status and unpublishing a post back to draft status. I didn't search for the web for existing scripts, because I wanted to experiment writing the scripts myself.

The scripts are still unpolished, but they work for my purpose. Anyway, I still decided to google for what others have done to automate their Jekyll workflow. I find these tools are too sophisticated for my simple use. I don't intend to install another [gem](http://www.guyroutledge.co.uk/blog/automate-jekyll-post-creation-with-thor/), while this [script](http://kenju.github.io/blog/2015/06/03/shell-for-create-jekyll-post-automatically/) does mostly what I want, I still have to make some changes, I might as well write my own script. This [script](https://gist.github.com/Merovius/6736709) just blew my mind away and I don't intend to run something I cannot understand.

As with many things, I figure that sometimes it is best to write your own tools, so that you can customize to your heart's desire. Also, since you understand how it works, you can debug and fix the issues yourself without relying on the creator. I published my scripts on [Github](https://github.com/gohkhoonhiang/jekyll-scripts) for your reference, but I encourage you to write your own scripts to do what best suit your needs.


