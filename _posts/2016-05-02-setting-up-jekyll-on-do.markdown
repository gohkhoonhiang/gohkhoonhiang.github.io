---
layout: post
title:  "Setting up Jekyll on Digital Ocean's Droplet"
date:   2016-05-02 15:50:00 +0800
tags: [jekyll, digitalocean]
description: Setting up Jekyll on Digital Ocean Droplet
---

Finally I have setup a Digital Ocean Droplet for my development use! *See [previous post]({{site.baseurl | prepend:site.url}}/2016/05/facebook-git-hackathon-2016) for why I decided to use Linux for development*

Since I have used Ubuntu a long long time ago, I decided that I will setup a Ubuntu instance for my droplet, hoping that some of those long time memories can be used here. I followed this [tutorial](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-16-04) through steps 1 to 7 faithfully. It's one of the most reliable tutorials I've followed, there is no assumptions about anything, I just have to do exactly it says and things will work well. Naturally, I thought setting up stuff isn't *that* difficult afterall.

Then I moved on to install Jekyll on my droplet so that I can use it to publish my tech blog on github pages. I went to [jekyllrb.com](https://jekyllrb.com/docs/installation/) for installation guide. I started with installing `ruby`, then I ran `sudo gem install jekyll` to install Jekyll. This was where things started falling apart. I started getting a lot of build errors. After some googling, I realized I haven't installed `ruby-dev`, so I went on to install it. Now I got some other errors regarding `libffi`, and then some other errors which by now I have lost track of. Finally, I managed to search for this [thread](https://talk.jekyllrb.com/t/error-installing-jekyll-failed-to-build-gem-extension/1523) on [jekyll talk](https://talk.jekyllrb.com). The solution is right at the bottom of the thread, which instructs to install some other libraries. Yay, now I can smoothly run `sudo gem install jekyll`. I still have no idea why this has not been added to the official installation guide. Is it something that is commonly encountered by everyone? Or just a selected few?

Anyway, now that I have Jekyll installed, I started with the default template. I published my first post about my experience at the Facebook hackathon. Then I decided to change to a different [theme](https://github.com/drvy/minimal-block), but somehow the headings are not working properly, after trying to do `<h1>` or the markdown `#` syntax. Then I had to look for a different [theme](https://github.com/streetturtle/jekyll-clean-dark) which can support proper headings. I'm pretty satisfied with this theme, so I changed a little settings on the theme and what you read now is the end product.

As I was doing all these changes, I realized one problem. I always have to push the changes to github to see the visual changes on my github pages. This is not very efficient and I also don't like polluting my commit history with things like `Changed theme` and `Changing theme again`. So I decided I should use `jekyll serve` to view the changes locally first, and commit and push after I'm satisfied with the outcome.

When I tried accessing my local Jekyll page via the browser, I kept getting "Failed to load" error. It seems like I cannot access my droplet from external browsers. So I consulted my mentor, and after some trial-and-error, we finally found out a few issues and solutions:

1. Jekyll is serving at `127.0.0.1`, which is only locally accessible. I have to change to using `0.0.0.0` with this `jekyll serve -H 0.0.0.0`. 
1. Firewall has been enabled after following through the Ubuntu setup guide on Digital Ocean, so external browsers cannot access Jekyll's server at port 4000. I have to allow external access to port 4000 with this `sudo ufw allow 4000/tcp`.

Finally, I can access my local Jekyll server at `mydoip:4000`! Now I don't have to commit and push my changes to github pages to see the visual changes.

I'm not sure if anyone else has encountered the same problems I did. I hope this post will help those who have similar issues when setting up their own Jekyll blog on a droplet.

