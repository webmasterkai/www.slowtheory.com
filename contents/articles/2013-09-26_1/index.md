---
title: 'Publishing with wintersmith, github, iron worker, and amazon s3'
date: '2013-09-23 12:44:00'
template: post.html
---

This post will be a dramatic departure from my typically self-absorbed missives about running, life, homemaking, and various other topics that interest only a handful of dedicated friends...and, of course, my mom. By comparison, the following may seem like equally purposeless, but oddly placed *nerd-mumble*. However, I believe it reflects simplicity, predictability, and sustainability that can inform other aspects of life, so here we go...

### The situation

I've maintained a blog for the past decade or so. It's shape, purpose, and density have remained in a continuous state of change. I will write frequently. Then I will seldom write. Very suddenly I will be a person who posts a lot of photos filtered and manipulated by iPhoto. I will read Bob Dylan's *Tarantuala*, after which I will leave a desperate trail of free-form vomit. I try to remain uncensored and self-indulgent, not because I think the world wants, needs, or deserves it, but because its purposelessness inevitably creates shape and substance--from nothing, comes something, though not as any one thing in particular. There was a very interesting [Radiolab episode](http://www.radiolab.org/) that discussed this idea much more provocatively and intelligently. An individual tracked the seemingly irrelevant minutia of his life for a very long time, but from this an amazing portrait eventually emerged. Tracking this seemingly strange life-flow requires software that is free-form, flexible, durable, simple, but capable of anything. Sure, I could just get a tumblr account, but what happens when I decide that tumblr is mean, dispiriting, and downright *evil*? I need something that is portable to all variations of Tim.

### The solution

In short, the solution is a *static website generator*. For a long time the internet was an increasingly complex place. Simple people like me, those who just wanted to contribute noise to its ephemeral and noisy space, found their thoughts mired in a complex web where content and presentation were muddled together, the same pages were dynamically generated over and over, and fragile server infrastructure held the mess together while holding the author prisoner. Ick. The first thing I needed to do was free my content. Most people who used wordpress, drupal, or any of the other bloated content management systems that reached their peak popularity a few years ago, had or have messy content that's been nearly ruined by wysiwyg editors and over-connectedness with the site's presentation.

I'll gloss over several steps since my initial intent wasn't to span the boring history of my website. The short version is that I converted my content to [markdown](http://daringfireball.net/projects/markdown/syntax#philosophy), made a simple interface based on [twitter bootstrap](http://www.getbootstrap.com), and embarked on my static website adventure. I tried a couple different pieces of software to put the pieces together, eventually settling on [Ruhoh](http://www.ruhoh.com). While it worked well, I recently switched to [Wintersmith](http://www.wintersmith.io) for its superior speed and flexibility. But see?! It doesn't really matter. All of the pieces existed independently and I could easily change the *builder* without too much effort.

So, the real purpose of this post is that I wanted to do something with the built site. I spent the time creating a worker on [Heroku](http://www.heroku.com) that handled post commit messages from Github, cloned, compiled the site, and pushed to Amazon S3. I didn't really want to do this with Wintersmith for a variety of reasons. However, I did want to be able to type "deploy-slowtheory" and have my site compiled, raw data pushed to one repo, compiled data to another repo, and only modified files pushed to Amazon S3. Also, I wanted to do this in 10 minutes. Here we go.

<div class="alert alert-info">
<strong>Update!</strong> The internet has a much better solution for deployment <a href="http://luke.vivier.ca/wintersmith-with-wercker/">HERE</a>. If you'd prefer, as I do, to deploy to s3 instead of gh-pages, combine it with <a href="http://devcenter.wercker.com/articles/deployment/jekylls3.html">this article</a>.
</div>