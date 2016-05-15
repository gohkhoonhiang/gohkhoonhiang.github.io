---
layout: post
title:  Simple Contact Form On Jekyll
date: 2016-05-16 00:25:17 +0800
tags: 
description: This post is about how to create a simple contact form on Jekyll blog.
---

One advantage of using Jekyll for a blogging platform is that I can host it free on Github Pages. It means I don't have to deal with servers and server-side scripting. However, there are times that I really wish I could have a server to do some processing for me, like, collecting visitors' contact details. As I was building my [one-page resume]({{site.url}}/about/), I wanted to provide a contact form for visitors to leave their details, but I didn't want to set up a separate server just for this purpose. Fortunately, I found a way to do that without having to set up a server.

<!-- more -->

# Google Forms to the Rescue

The first thing that came into my mind was Google Forms. I remember seeing websites embedding a Google Form, and I thought I could do that too. So I went over to my Google account, and created a Google Form. But I was not very pleased with the UI, it didn't really match my website theme. Upon further googling, I found this [tutorial](http://morning.am/tutorials/how-to-style-google-forms/) that talks about how to style your Google Form. This was pretty cool, but I was not very pleased with all the complicated HTML attributes that are created by Google Form. So I thought, why not I create my own form, and then post the data to Google Forms instead?

I started investigating the form data being sent by the original Google Form using Chrome's developer tools. I found out that the original form sent the form data as such:

```
Contact Me:something
entry.976136711:something
Contact Me:something@email.com
entry.1715736389:something@email.com
Contact Me:99999999
entry.261050291:99999999
Contact Me:purpose
entry.177081687:purpose
```

I don't know what are those `Contact Me` data doing, probably because the original Google Form contains fields with `name="Contact Me"`.

I tried to `curl` to the form action URL with just the data prefixed `entry.`, and I successfully posted the form data. That's very simple, I thought.

# Custom Form

Then I created a form with just the `entry.` elements. 

```
<form action="https://docs.google.com/forms/d/16S1tuPQY_g0atfjLNnGxv5vyo3BiWThXoYchwOArXy0/formResponse" method="post">
  <div class="form-group">
        <label for="contact-name">How should I address you?</label>
        <input type="text" class="form-control" id="contact-name" placeholder="Name" name="entry.976136711" aria-describedby="contact-name-error">
        <p id="contact-name-error" class="help-block"></p>
  </div>
  <div class="form-group">
        <label for="contact-email">How can I contact you through email?</label>
        <input type="email" class="form-control" id="contact-email" placeholder="Email" name="entry.1715736389" aria-describedby="contact-email-error">
        <p id="contact-email-error" class="help-block"></p>
  </div>
  <div class="form-group">
        <label for="contact-number">Or you would prefer a phone call?</label>
        <input type="text" class="form-control" id="contact-number" placeholder="Contact Number" name="entry.261050291" aria-describedby="contact-number-error">
        <p id="contact-number-error" class="help-block"></p>
  </div>
  <div class="form-group">
        <label for="contact-purpose">I'm excited to know how I can help you!</label>
        <textarea class="form-control" id="contact-purpose" placeholder="Purpose" name="entry.177081687" aria-describedby="contact-purpose-error"></textarea>
        <p id="contact-purpose-error" class="help-block"></p>
  </div>
  <button type="submit" class="btn btn-default" id="contact-form-submit">Submit</button>
</form>
```

Upon completing the form element, I realized that submitting the form will redirect my visitors to Google Forms' confirmation page, which I don't really want them to go to. I want to show them a custom page, so that they can navigate back to my blog from there. This means, I will have to do AJAX call, and then set the URL to the confirmation page upon success.

# Custom AJAX Form Submit

So I wrote a custom AJAX call to the form action URL and created a custom confirmation page that I redirect to after receiving response from Google Forms.

```
$('#contact-form-submit').click(function(e) {
    e.preventDefault();
    var contactName = $('#contact-name').val();
    var contactEmail = $('#contact-email').val();
    var contactNumber = $('#contact-number').val();
    var contactPurpose = $('#contact-purpose').val();
    // data validation code here
    var url = "//docs.google.com/forms/d/16S1tuPQY_g0atfjLNnGxv5vyo3BiWThXoYchwOArXy0/formResponse";
    var data = {
        'entry.976136711': contactName,
        'entry.1715736389': contactEmail,
        'entry.261050291': contactNumber,
        'entry.177081687': contactPurpose,
    };
    $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: data,
            statusCode: {
                    0: function() {
                            console.log("unknown");
                            window.location.href = "contact_confirm/index.html";
                    },
                    200: function() {
                            console.log("success");
                            window.location.href = "contact_confirm/index.html";
                    }
            }
    });
});
```

# CORS

So far things have gone well, except that I keep getting this error on Chrome:

```
XMLHttpRequest cannot load https://docs.google.com/forms/d/16S1tuPQY_g0atfjLNnGxv5vyo3BiWThXoYchwOArXy0/formResponse. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

, and this error on Firefox:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://docs.google.com/forms/d/16S1tuPQY_g0atfjLNnGxv5vyo3BiWThXoYchwOArXy0/formResponse. (Reason: CORS header 'Access-Control-Allow-Origin' missing).
```

After some trial-and-error, I realized that if the protocol is `https`, the data will be posted despite having the same error message in the console. However, this creates another problem: how do I force the user to visit the `https` version of my page?

Finally, I found a proper documentation that talks about forcing `https` for every request [here](https://konklone.com/post/github-pages-now-sorta-supports-https-so-use-it).

# Conclusion

The strange error message aside, I find that Google Forms is a very handy way to create a simple datastore on a Jekyll blog. It requires a little setup at the Google Forms page, some custom form creation on the blog, and the Javascript to force `https` protocol for every page visit. However, there is no need to set up a backend server and to deal with server-side scripting, which will make life easier for many bloggers who just want to focus on writing content. I hope this post has been helpful for you.

If you ever know why the error occurred yet the data were posted, feel free to comment in the comments section. I would love to hear from you why that is so. Thank you!

