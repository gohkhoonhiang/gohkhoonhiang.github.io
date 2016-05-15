---
layout: post
title:  Revamp About Page
date: 2016-05-16 00:25:22 +0800
tags: [css, html, jekyll] 
description: This post is about my attempt in revamping the About page of my blog.
---

Previously, I talked about [how I created a simple contact form in my About page using Google Forms]({{site.url}}/2016/05/simple-contact-form-on-jekyll/) and how I had to force `https` on every page visit.

Because of this, I have to change the `About` page to using the blog's templating framework, so that I can inject the Javascript across all the pages instead of duplicating it just for the `About` page.

<!-- more -->

# `about.html` Layout

First of all, I created a `about.html` layout in `_layouts`. What I did basically was copy the original `about/index.html` into this layout as template.

Instead of using its own scripts and CSS declarations, I included the common `head.html` and `scripts.html` layouts in the new `about.html` layout. On top of that, I included the `about.js` and `about.css` that were created together with `about/index.html`.

Then, to cater to mobile view, I added some responsive utility classes such as `visible-xs` and `hidden-xs` for some sections of the page.

I also revamped the menu on the mobile view, instead of a one-line menu like how it is like on desktop, I tried to make a block menu that is displayed on top of the layers. It took quite some time for me to learn how to manipulate the CSS to achieve this effect.

# `about/index.html`

In the original `about/index.html`, I removed all the HTML, declared the front-matter, and used the `about` layout.

Now when the blog is generated, I will be able to force visit to `/about` using `https`.

# Mobile Ready

In the attempt to make the `About` page mobile-ready, I discovered that HTML/CSS is such a deep rabbit hole that if I decided to jump in, it will take quite some time to learn enough to be proficient. Nonetheless, it's very satisfying to see that I have managed to adapt the original [template by Bootstrap](http://getbootstrap.com/examples/cover/) and make it look as closely as what I wanted it to be.

There are still some issues I haven't learnt enough to be able to solve. For example, I wanted to resize my icons under `Skills` section accordingly to screensize, but I haven't figured out how to try to cater to most of the different sizes. Then, I also wanted to implement on lose focus, hide the menu on mobile, but due to lack of knowledge in CSS manipulation, I still haven't gotten it to work.

