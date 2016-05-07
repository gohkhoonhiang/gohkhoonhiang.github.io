---
layout: post
title: "Setting up MongoDB on Ubuntu 16.04"
date: 2016-05-02 18:54:00 +0800
tags: [mongodb, ubuntu-16-04]
description: This post is about setting up MongoDB on Ubuntu 16.04
---

Previously I have done a simple [Tornado Tutorial](http://gohkhoonhiang.github.io/coloredlist) and I have used [MongoDB](https://www.mongodb.org) for data persistence. After I have setup a Digital Ocean droplet running Ubuntu 16.04, I started to migrate all my coding projects to this development machine. That means I have to also start installing some of these libraries so that I can run my projects locally.

<!-- more -->

When I went to the [MongoDB docs](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/) page for how to install on Ubuntu, I found out that they don't support 16.04 *yet*. However, I decided to give it a try and install based on 14.04 instructions. I installed as per the instructions under *Install MongoDB Community Edition* and everything seems to work fine. The problem comes when I tried to run `sudo service mongod start`, where I get the error `Failed to start mongod.service: Unit mongod.service failed to load: No such file or directory`. After some googling, I found this [thread](http://askubuntu.com/questions/690993/mongodb-3-0-2-wont-start-after-upgrading-to-ubuntu-15-10) for the solution.

What I did was I created a file `/lib/systemd/system/mongod.service`, and write the following:
{% highlight bash %}
[Unit]
Description=High-performance, schema-free document-oriented database
After=network.target

[Service]
User=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongodb.conf

[Install]
WantedBy=multi-user.target
{% endhighlight bash %}

Now when I ran `sudo service mongod start` again, and I checked the log at `/var/log/mongodb/mongod.log`, I found the line `[initandlisten] MongoDB starting : pid=11161 port=27017` `dbpath=/var/lib/mongodb 64-bit host=my-dev-server-01`, which means good news!
