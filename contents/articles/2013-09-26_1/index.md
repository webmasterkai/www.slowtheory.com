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

First, I made a hackish ruby script to run locally:

```
#!/usr/bin/env ruby

require 'fileutils'
Dir.chdir('/Users/timlupfer/git/sites/www.slowtheory.com/')
puts "Building website..."
`wintersmith build`
puts "Committing raw files..."
`git add . 2> /dev/null && git commit -am "Website build" 2> /dev/null && git push origin master 2> /dev/null`
Dir.chdir('build')
puts "Copying build to deploy directory..."
`rsync -rclDvh * /Users/timlupfer/git/sites_deploy/www.slowtheory.com/`
puts "Deploying site..."
Dir.chdir('/Users/timlupfer/git/sites_deploy/www.slowtheory.com/')
`git add . 2> /dev/null && git commit -am "Website updates" 2> /dev/null && git push origin master 2> /dev/null`
```

This builds the site, syncs the files to the deploy directory, and pushes to two different repos. Next, I needed the files to get from my Github repo to Amazon S3. It's pretty easy to just how your site on Github, but Amazon seems to offer better performance, reliability, and much faster publishing times.

```
require 'json'
require 'aws/s3'
require 'pp'

#Connect to AWS S3
AWS::S3::Base.establish_connection!(
  :access_key_id     => 'ME',
  :secret_access_key => 'MYSECRET'
)
payload_obj = JSON.parse(URI.unescape(payload).gsub!(/.*payload=(.*)/, '\1'))
#Process the payload
repo    = payload_obj["repository"]["url"]
address = payload_obj["repository"]["name"]
`git clone #{repo}`
Dir.chdir address
`git checkout master`

#Get a directory listing
files        = Dir.glob("**/*")
upload_files = Array.new
remove_files = Array.new

#Go through the commits and add files to be uploaded and deleted
payload_obj['commits'].each do |commit|
  upload_files = commit['added'] + commit['modified'] + upload_files
  remove_files = commit['removed'] + remove_files
end

remove_files.each do |filename|
  puts "Removing #{filename}..."
  AWS::S3::S3Object.delete(filename, address)
end
#Push each file that isn't a directory
upload_files.each do |filename|
  if !File.directory? filename
    puts "Uploading #{filename}"
    AWS::S3::S3Object.store(filename, open(filename), address, :access => :public_read)
  end
end
```

Then I got the webhook address for the worker, told Github where to find it, and watched the magic happen. Despite the fact that Iron Worker's filesystem is wiped each time a task is spawned, and consequently the repo needs to be re-cloned, my changes are still on the internet within 30 seconds of typing "deploy-slowtheory".