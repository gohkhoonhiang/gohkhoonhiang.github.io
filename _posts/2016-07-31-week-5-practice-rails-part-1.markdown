---
layout: post
title:  "Week 5: Practice Rails (Part 1)"
date: 2016-07-31 22:01:49 +0800
tags: [ruby, rails, tutorial, project]
description: This post is the first part of my process of applying what I have learnt in the past few weeks of the six-week Ruby on Rails learning project.
---

This is the fifth part of the six-week Ruby on Rails learning project.

1. [Week 1: Learn Ruby]({{site.url}}/2016/06/week-1-learn-ruby/)
2. [Week 2: Learn Rails (Part 1)]({{site.url}}/2016/07/week-2-learn-rails-part-1/)
3. [Week 3: Learn Rails (Part 2)]({{site.url}}/2016/07/week-3-learn-rails-part-2/)
4. [Week 4: Learn Rails (Part 3)]({{site.url}}/2016/07/week-4-learn-rails-part-3/)
5. [Week 5: Practice Rails (Part 1)]({{site.url}}/2016/07/week-5-practice-rails-part-1/)
6. Week 6: Practice Rails (Part 2)

<!-- more -->

# Table of Content

* [Introduction](#introduction)
* [Workflow Design](#workflow-design)
* [Page Design](#page-design)
* [Model Design](#model-design)
* [Setup and Installation](#setup-and-installation)
* [Scaffolding](#scaffolding)

# Introduction

Finally, it's time that I apply what I have learnt in the past few weeks. I have decided to choose a project which is simple, but should cover most things that are typical of a web application. It will be a web app called "ReviewPository", which is a portmanteau word combining "review", "positive" and "repository". The purpose of this web app is to allow users to look for *reviews that matter* (which will be used as the tagline of the web app). How this works is through a voting system, similar to that of [Reddit](#https://www.reddit.com) and [StackOverflow](http://stackoverflow.com), so that reviews that are constructive appear higher in the rank. Users can also comment on reviews, and vote up or down on comments as well. The main categories of items for review on this web app will be books, music and movies. Of course, there is no shortage of review websites out there in the wild. This is just a toy project for me to apply my web development and Rails knowledge.

[Back to top](#table-of-content)

# Workflow Design

I will keep the scope of this project as small and realistic as possible, so that I can deliver within 2 weeks. There will only be a few main workflows for the web app:

1. Login/logout
2. Search for item
3. View the item description, reviews and comments
4. Submit a review or comment
5. Post a new item
6. Change account settings
7. Sign up for a new account

Here's an overview picture of the workflow:

![Workflow]({{site.url}}/images/week-5-practice-rails-part-1/workflow_630_630.png)

Note that at any point in time the user is logged in, he/she can logout from the app. Also, he/she can only post new review/comment and submit/edit item information when he/she is logged in. It does not require an user account to perform searching and view listing and reviews/comments.

[Back to top](#table-of-content)

# Page Design

Now that we have designed the workflow, let's create some wireframes for our app. This is to guide us in designing the elements of each page and possible data structure to use to achieve the view of the page. It is not the final design of the app, but it should help us get started with the subsequent design tasks.

[Back to top](#table-of-content)

## Signup

![Signup]({{site.url}}/images/week-5-practice-rails-part-1/signup_860_530.png)

[Back to top](#table-of-content)

## Home Page

![Homepage]({{site.url}}/images/week-5-practice-rails-part-1/home_860_530.png)

[Back to top](#table-of-content)

## Listing

![Listing]({{site.url}}/images/week-5-practice-rails-part-1/listing_860_530.png)

[Back to top](#table-of-content)

## View Item

### Annonymous

![View Item]({{site.url}}/images/week-5-practice-rails-part-1/item_860_830.png)

[Back to top](#table-of-content)

### Logged In

![View Item]({{site.url}}/images/week-5-practice-rails-part-1/item_loggedin_650_880.png)

[Back to top](#table-of-content)

## Account Settings

![Account Settings]({{site.url}}/images/week-5-practice-rails-part-1/account_860_530.png)

[Back to top](#table-of-content)

## New Item

### New Book

![New Book]({{site.url}}/images/week-5-practice-rails-part-1/new_book_860_530.png)

[Back to top](#table-of-content)

### New Music

![New Music]({{site.url}}/images/week-5-practice-rails-part-1/new_music_860_530.png)

[Back to top](#table-of-content)

### New Movie

![New Movie]({{site.url}}/images/week-5-practice-rails-part-1/new_movie_860_530.png)

*Note: In case you are curious what software I used to create the wireframes, it's actually Mac's Preview. They have simple shape drawing tools that I used to draw the outlines and text tool that I used to write the text and emojis. Even the workflow image from the previous section was put together using a lot of "signatures" in Preview. Then I used Lightshot to snap a picture of what I created in Preview and save as image. There are probably better and easier tools out there for this task, but I didn't want to spend too much time researching and downloading those tools.*

[Back to top](#table-of-content)

# Model Design

After we have decided on the workflow and page design, it is time we come up with the model design. Now we know that there are a few domain models we need for our web app:

* User
* Item
* Review
* Comment

The relationships among the domain models are summarized in this image:

![Model Relationships]({{site.url}}/images/week-5-practice-rails-part-1/domain_600_300.png)

* Each user has many items created by him/her, which means that only the creator of the item can edit the item
* Each user has many reviews
* Each user has many comments
* Each item has many reviews
* Each review has many comments

[Back to top](#table-of-content)

## Model Attributes

We will give a very basic set of attributes for each model, just enough for our web app to function.

`id`, `created_at` and `updated_at` are created by default by Rails, so we will not explicitly list them here in our design.

[Back to top](#table-of-content)

### User

* `username` - Username selected by the user
* `email` - Email address of the user
* `password` - Hashed password of the user
* `avatar` - File name of the avatar image uploaded by the user

[Back to top](#table-of-content)

### Item

* `name` - Name of the book/music/movie
* `description` - Long description of the book/music/movie
* `image` - File name of the uploaded image
* `category` - Category: `book`, `music` or `movie`
* `user_id` - Id of the `user` who created this `item`

[Back to top](#table-of-content)

### Stakeholder

`Stakeholder` model is used to store the multiple stakeholders, eg. authors, artists, composers, actors or directors that belong to an item. We are going to differentiate between each type using a `type` attribuet.

* `name` - Name of the stakeholder
* `category` - Category: `author`, `artist_composer`, `actor_director`

[Back to top](#table-of-content)

### Review

* `title` - Short title of the review
* `content` - Long content of the review
* `star` - Number of stars rated by the user for the item
* `like` - Number of likes voted by other users for the review
* `dislike` - Number of dislikes voted by other users for the review
* `item_id` - Id of the `item` this `review` is written for
* `user_id` - Id of the `user` who created this `review`

[Back to top](#table-of-content)

### Comment

* `content` - Content of the comment
* `like` - Number of likes voted by other users for the comment
* `dislike` - Number of dislikes voted by other users for the comment
* `review_id` - Id of the `review` this `comment` is written for
* `user_id` - Id of the `user` who created this `comment`

[Back to top](#table-of-content)

# Setup and Installation

Now that we have an initial design, we can start setting up the RVM environment and install Rails.

## New Project Environment

First we will create a project directory called `reviewpository` and `cd` into the directory.

Then run the command `rvm gemset create reviewpository` to create an environment for developing this project.

```
ruby-2.3.0 - #gemset created /home/gohkhoonhiang/.rvm/gems/ruby-2.3.0@reviewpository
ruby-2.3.0 - #generating reviewpository wrappers........
```

We will run the command `rvm gemset use reviewpository` to make sure we are using the environment we have just created.

```
Using ruby-2.3.0 with gemset reviewpository
```

[Back to top](#table-of-content)

## `.rvmrc`

We don't want to type the command everytime we start working on the project, so we will create the `.rvmrc` file that will automatically switch to the environment everytime we `cd` into this project directory. To create the file, we can run the command `touch .rvmrc`, then `echo "rvm 2.3@reviewpository" >> .rvmrc` to write the `rvm` command into the file.

Now if we `cd` into the project directory the first time after creating the `.rvmrc` file, we will be prompted with the following:

```
You are using '.rvmrc', it requires trusting, it is slower and it is not compatible with other ruby managers,
you can switch to '.ruby-version' using 'rvm rvmrc to ruby-version'
or ignore this warning with 'rvm rvmrc warning ignore /home/gohkhoonhiang/projects/reviewpository/.rvmrc',
'.rvmrc' will continue to be the default project file in RVM 1 and RVM 2,
to ignore the warning for all files run 'rvm rvmrc warning ignore all.rvmrcs'.

********************************************************************************************************************
* NOTICE                                                                                                           *
********************************************************************************************************************
* RVM has encountered a new or modified .rvmrc file in the current directory, this is a shell script and           *
* therefore may contain any shell commands.                                                                        *
*                                                                                                                  *
* Examine the contents of this file carefully to be sure the contents are safe before trusting it!                 *
* Do you wish to trust 'reviewpository/.rvmrc'?                                                                    *
* Choose v[iew] below to view the contents                                                                         *
********************************************************************************************************************
y[es], n[o], v[iew], c[ancel]> y
```

Enter `y` to *trust* the file.

To make sure we are in the correct environment, run `rvm gemset name` to see the name of the environment.

```
reviewpository
```

[Back to top](#table-of-content)

## Install Rails

Once we have set up our environment, we can start installing Rails by running `gem install rails`.

```
Fetching: i18n-0.7.0.gem (100%)
Successfully installed i18n-0.7.0
...
Parsing documentation for rails-5.0.0
Installing ri documentation for rails-5.0.0
Done installing documentation for i18n, thread_safe, tzinfo, concurrent-ruby, activesupport, rack, rack-test, mini_portile2, pkg-config, nokogiri, loofah, rails-html-sanitizer, rails-dom-testing, builder, erubis, actionview, actionpack, activemodel, arel, activerecord, globalid, activejob, mime-types-data, mime-types, mail, actionmailer, nio4r, websocket-extensions, websocket-driver, actioncable, thor, method_source, railties, bundler, sprockets, sprockets-rails, rails after 112 seconds
37 gems installed
```

[Back to top](#table-of-content)

## New Rails Project

Then, we will create a new Rails project by running `rails new reviewpository`.

```
      create
      create  README.md
      create  Rakefile
      create  config.ru
      create  .gitignore
      create  Gemfile
      create  app
...
Fetching gem metadata from https://rubygems.org/
Fetching version metadata from https://rubygems.org/
Fetching dependency metadata from https://rubygems.org/
Resolving dependencies.................................................
Installing rake 11.2.2
Using rails 5.0.0
Installing sass-rails 5.0.6
Bundle complete! 15 Gemfile dependencies, 63 gems now installed.
Use `bundle show [gemname]` to see where a bundled gem is installed.
         run  bundle exec spring binstub --all
* bin/rake: spring inserted
* bin/rails: spring inserted
```

We have finally installed Rails and can start building our web app!

[Back to top](#table-of-content)

# Scaffolding

Based on our design, we can create some skeleton files first, and work on the details later.

## Model

First, let's start with creating our model files. We will use Rails's utility command `generate model` to create the Active Record Migration files, but we will start adding in the attributes later.

Let's run the command `bin/rails generate model User`:

```
Running via Spring preloader in process 27899
      invoke  active_record
      create    db/migrate/20160731095803_create_users.rb
      create    app/models/user.rb
      invoke    test_unit
      create      test/models/user_test.rb
      create      test/fixtures/users.yml
```

We will also do it for all other models: `Item`, `Stakeholder`, `Review` and `Comment`.

If we run the command `tree db/migrate`, we will see the migration files created for each model:

```
db/migrate/
├── 20160731095803_create_users.rb
├── 20160731095908_create_items.rb
├── 20160731095915_create_stakeholders.rb
├── 20160731095920_create_reviews.rb
└── 20160731095927_create_comments.rb

0 directories, 5 files
```

[Back to top](#table-of-content)

## Controller

Next, we will create the controllers for handling our app workflow. Recall that we have the following processes in our entire app workflow:

1. Login/logout
2. Search for item
3. View the item description, reviews and comments
4. Submit a review or comment
5. Post a new item
6. Change account settings
7. Sign up for a new account

We will create a few controllers to handle them like this:

|---
| Controller | Processes
|-|-
| SessionsController | Login/Logout
| UsersController | Change account settings, Signup for a new account
| ItemsController | Search for item, View the item description, Post a new item
| ReviewsController | View reviews, Submit a review
| CommentsController | View comments, Submit a comment
|---
{:.table}

To create the skeleton files for the controllers, we will use Rails's command `bin/rails generate controller <name>` for `Sessions`, `Users`, `Items`, `Reviews` and `Comments`.

If we run `tree app/controllers`, we will see the controller files are created:

```
app/controllers/
├── application_controller.rb
├── comments_controller.rb
├── concerns
├── items_controller.rb
├── reviews_controller.rb
├── sessions_controller.rb
└── users_controller.rb

1 directory, 6 files
```

[Back to top](#table-of-content)

## Routes

Next, we will create a few routes that we will need to use in the app. This is done by editing the `config/routes.rb` file.

We will start with `root 'items#search'`. This will make our item search page the default page to display when a user visits the website.

```
Rails.application.routes.draw do
  root 'items#search'
end
```

We also want to customize a few routes to use a more meaningful URL instead of the default resource URIs.

```
get 'login', to: 'sessions#new'
post 'login', to: 'sessions#create'
post 'logout', to: 'sessions#destroy'
get 'signup', to: 'users#new'
post 'signup', to: 'users#create'
get 'items/query', to: 'items#query'
get 'account/settings', to: 'users#edit'
get 'items/listing', to: 'items#index'
```

Finally, we include the default routes for our resources. Note that we use `except` option for `users#edit`, `users#new`, `users#create` and `items#index` resource, because we have already defined the custom routes for them previously.

```
resources :users, except: [:edit, :new, :create]
resources :items, except: [:index]
resources :reviews
resources :comments
```

If we run `bin/rake routes` command, we will have the full list of routes that are available.

```
Running via Spring preloader in process 17193
          Prefix Verb   URI Pattern                  Controller#Action
            root GET    /                            items#search
           login GET    /login(.:format)             sessions#new
                 POST   /login(.:format)             sessions#create
          logout POST   /logout(.:format)            sessions#destroy
          signup GET    /signup(.:format)            users#new
                 POST   /signup(.:format)            users#create
     items_query GET    /items/query(.:format)       items#query
account_settings GET    /account/settings(.:format)  users#edit
   items_listing GET    /items/listing(.:format)     items#index
           users GET    /users(.:format)             users#index
            user GET    /users/:id(.:format)         users#show
                 PATCH  /users/:id(.:format)         users#update
                 PUT    /users/:id(.:format)         users#update
                 DELETE /users/:id(.:format)         users#destroy
           items POST   /items(.:format)             items#create
        new_item GET    /items/new(.:format)         items#new
       edit_item GET    /items/:id/edit(.:format)    items#edit
            item GET    /items/:id(.:format)         items#show
                 PATCH  /items/:id(.:format)         items#update
                 PUT    /items/:id(.:format)         items#update
                 DELETE /items/:id(.:format)         items#destroy
         reviews GET    /reviews(.:format)           reviews#index
                 POST   /reviews(.:format)           reviews#create
      new_review GET    /reviews/new(.:format)       reviews#new
     edit_review GET    /reviews/:id/edit(.:format)  reviews#edit
          review GET    /reviews/:id(.:format)       reviews#show
                 PATCH  /reviews/:id(.:format)       reviews#update
                 PUT    /reviews/:id(.:format)       reviews#update
                 DELETE /reviews/:id(.:format)       reviews#destroy
        comments GET    /comments(.:format)          comments#index
                 POST   /comments(.:format)          comments#create
     new_comment GET    /comments/new(.:format)      comments#new
    edit_comment GET    /comments/:id/edit(.:format) comments#edit
         comment GET    /comments/:id(.:format)      comments#show
                 PATCH  /comments/:id(.:format)      comments#update
                 PUT    /comments/:id(.:format)      comments#update
                 DELETE /comments/:id(.:format)      comments#destroy
```

[Back to top](#table-of-content)

## Actions

Based on the routes we have defined whether by customization or by default, we can create the empty action methods that correspond to the routes.

Here is one controller class with action methods that correspond to customized routes.

```
class ItemsController < ApplicationController
  def index
  end

  def create
  end

  def new
  end

  def edit
  end

  def show
  end

  def update
  end

  def destroy
  end

  def search
  end

  def query
  end
end
```

The other controller classes will have the usual action methods for CRUD operations, so will not be shown in details here.

[Back to top](#table-of-content)

## Database Schema

Next, let's fill in the attributes of the models we have created. We will edit the Active Record Migration files to add the fields to each table representing our models.

### Users

```
class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password
      t.string :avatar

      t.timestamps
    end
  end
end
```

[Back to top](#table-of-content)

### Items

```
class CreateItems < ActiveRecord::Migration[5.0]
  def change
    create_table :items do |t|
      t.string :name
      t.text :description
      t.string :image
      t.string :category
      t.belongs_to :user

      t.timestamps
    end
  end
end
```

[Back to top](#table-of-content)

### Stakeholders

```
class CreateStakeholders < ActiveRecord::Migration[5.0]
  def change
    create_table :stakeholders do |t|
      t.string :name
      t.string :category
      t.belongs_to :item

      t.timestamps
    end
  end
end
```

[Back to top](#table-of-content)

### Reviews

```
class CreateReviews < ActiveRecord::Migration[5.0]
  def change
    create_table :reviews do |t|
      t.string :title
      t.text :content
      t.integer :star
      t.integer :like
      t.integer :dislike
      t.belongs_to :item
      t.belongs_to :user

      t.timestamps
    end
  end
end
```

[Back to top](#table-of-content)

### Comments

```
class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.text :content
      t.integer :like
      t.integer :dislike
      t.belongs_to :review
      t.belongs_to :user

      t.timestamps
    end
  end
end
```

[Back to top](#table-of-content)

### Migration

Then, we will run the `bin/rake db:migrate` command to generate the database tables.

```
Running via Spring preloader in process 31027
== 20160731095803 CreateUsers: migrating ======================================
-- create_table(:users)
   -> 0.0249s
== 20160731095803 CreateUsers: migrated (0.0265s) =============================

== 20160731095908 CreateItems: migrating ======================================
-- create_table(:items)
   -> 0.0079s
== 20160731095908 CreateItems: migrated (0.0089s) =============================

== 20160731095915 CreateStakeholders: migrating ===============================
-- create_table(:stakeholders)
   -> 0.0041s
== 20160731095915 CreateStakeholders: migrated (0.0047s) ======================

== 20160731095920 CreateReviews: migrating ====================================
-- create_table(:reviews)
   -> 0.0112s
== 20160731095920 CreateReviews: migrated (0.0119s) ===========================

== 20160731095927 CreateComments: migrating ===================================
-- create_table(:comments)
   -> 0.0080s
== 20160731095927 CreateComments: migrated (0.0086s) ==========================
```

If we use the SQLite3 commandline tool, we can access the database and view the table schema:

```
sqlite> .schema users
CREATE TABLE "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar, "email" varchar, "password" varchar, "avatar" varchar, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
sqlite> .schema items
CREATE TABLE "items" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar, "description" text, "image" varchar, "category" varchar, "user_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE INDEX "index_items_on_user_id" ON "items" ("user_id");
sqlite> .schema stakeholders
CREATE TABLE "stakeholders" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar, "category" varchar, "item_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE INDEX "index_stakeholders_on_item_id" ON "stakeholders" ("item_id");
sqlite> .schema reviews
CREATE TABLE "reviews" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar, "content" text, "star" integer, "like" integer, "dislike" integer, "item_id" integer, "user_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE INDEX "index_reviews_on_item_id" ON "reviews" ("item_id");
CREATE INDEX "index_reviews_on_user_id" ON "reviews" ("user_id");
sqlite> .schema comments
CREATE TABLE "comments" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "content" text, "like" integer, "dislike" integer, "review_id" integer, "user_id" integer, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL);
CREATE INDEX "index_comments_on_review_id" ON "comments" ("review_id");
CREATE INDEX "index_comments_on_user_id" ON "comments" ("user_id");
```

[Back to top](#table-of-content)

## Model Associations

We should also define the model associations inside the model files. This makes it easier for us to manipulate the objects later using Rails's convenient operations.

### User

```
class User < ApplicationRecord
  has_many :items, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :comments, dependent: :destroy
end
```

[Back to top](#table-of-content)

### Item

```
class Item < ApplicationRecord
  has_many :stakeholders, dependent: :destroy
  has_many :reviews, dependent: :destroy
  belongs_to :user
end
```

[Back to top](#table-of-content)

### Stakeholder

```
class Stakeholder < ApplicationRecord
  belongs_to :item
end
```

[Back to top](#table-of-content)

### Review

```
class Review < ApplicationRecord
  has_many :comments, dependent: :destroy
  belongs_to :user
  belongs_to :item
end
```

[Back to top](#table-of-content)

### Comment

```
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :review
end
```

[Back to top](#table-of-content)

## Views

Earlier, we have run the `bin/rails generate controller <name>` command. The views directories are created in `app/views` directory as a result of the command:

```
app/views/
├── comments
├── items
├── layouts
│   ├── application.html.erb
│   ├── mailer.html.erb
│   └── mailer.text.erb
├── reviews
├── sessions
└── users

6 directories, 3 files
```

Only the layout files are generated for us. Based on the routes we defined, we can also generate the view files to render when the routes are requested. There are only a few routes that will require rendering a view, so let's create the empty files for these views.

```
touch /reviewpository/app/views/items/edit.html.erb
touch /reviewpository/app/views/items/index.html.erb
touch /reviewpository/app/views/items/new.html.erb
touch /reviewpository/app/views/items/search.html.erb
touch /reviewpository/app/views/items/show.html.erb
touch /reviewpository/app/views/sessions/new.html.erb
touch /reviewpository/app/views/users/edit.html.erb
touch /reviewpository/app/views/users/new.html.erb
```

We will fill in the details later as we start building the concrete parts of the app.

[Back to top](#table-of-content)

