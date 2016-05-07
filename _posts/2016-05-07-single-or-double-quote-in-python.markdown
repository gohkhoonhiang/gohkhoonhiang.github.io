---
layout: post
title:  Single Or Double Quote In Python
date: 2016-05-07 11:18:12 +0800
tags: [python] 
description: This post is about whether to use single quote or double quote for string in Python.
---

This is actually a very serious question for me. Should I use single quote or double quote for strings? I tried looking at the [Python library references](https://docs.python.org/3/library/index.html) for a clue. However, I'm all the more confused after I read these 2 different code blocks within the same section:

```
>>> v = memoryview(b'abcefg')
>>> hash(v) == hash(b'abcefg')
True
>>> hash(v[2:4]) == hash(b'ce')
True
>>> hash(v[::-2]) == hash(b'abcefg'[::-2])
True
```

```
>>> m = memoryview(b"abc")
>>> m.tobytes()
b'abc'
>>> bytes(m)
b'abc'
```

<!-- more -->

They are both using the `memoryview()` function, but one passes in `b'abcefg'` which is in single quote, and the other passes in `b"abc"` which is in double quote.

So, should I be using single quote or double quote? I decided to search for answers elsewhere, then I found this [stackoverflow thread](http://stackoverflow.com/questions/56011/single-quotes-vs-double-quotes-in-python).

The most upvoted answers seem to suggest an informal convention:

1. Text - double quotes, eg. `"This is a string of text."`
2. Raw string literals for regex - double quotes, eg. `r"[0-9a-zA-Z]+"`
3. Identifier - single quotes, eg. `a_dict['key']` or `{'key': "value"}`
4. Docstring - triple double quotes, eg. `"""This is the docstring for this method"""`

I also found another [statckexchange thread](http://programmers.stackexchange.com/questions/155176/single-quotes-vs-double-quotes), where the top voted answer suggests additionally:

5. String related to functionality of code - single quotes, eg. `'SELECT str FROM table_of_strs;'`

I feel it is *not* necessary to make such a distinction between user-readable text and code-related text. For me, I'm more inclined towards having all *right hand side* strings in double quotes, and all *left hand side* strings in single quotes. This is quite consistent with the first 4 rules where the identifier, which is almost always used on the *left hand side*, uses single quotes, and the rest of the strings, usually on the *right hand side*, use double quotes.

I can't seem to find an answer regarding strings that are passed as function arguments. So I decided to standardize for my future self: `always_call_function("with a string argument")`.

At the end of the day, I conluded that I should follow this style:

1. Left hand side strings - single quotes
2. Right hand side strings, except when it is an identifier - double quotes
3. Function argument strings - double quotes

Since it is more likely to have a single quote (apostrophe) than a double quote within a string, it will also be easier to construct a string with few escaping. This should justify writing most strings in double quotes.

I write this post more for my own reference than to argue about whether to use single or double quote in any scenario I have described. Since Python itself doesn't enforce a strict rule, and apparently its documentations, such as the `memoryview` above, also suggest *it doesn't matter*, I guess it is really up to me whether I want to have a consistent style. Being a little obsessive, I decided to enforce a consistent rule for myself, so that I won't have to lose my mind when I see `'` and `"` everywhere without a consistent pattern.

I really would like to hear from you of which rules do you use in your own code. Feel free to comment below.

