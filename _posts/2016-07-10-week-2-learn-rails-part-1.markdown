---
layout: post
title:  "Week 2: Learn Rails (Part 1)"
date: 2016-07-10 14:04:03 +0800
tags: [ruby, rails, tutorial]
description: This post is a summary of what I have learnt in the second week of the six-week Ruby on Rails learning project.
---

This is the second part of the six-week Ruby on Rails learning project.

1. [Week 1: Learn Ruby]({{site.url}}/2016/06/week-1-learn-ruby/)
2. [Week 2: Learn Rails (Part 1)]({{site.url}}/2016/07/week-2-learn-rails-part-1/)
3. Week 3: Learn Rails (Part 2)
4. Week 4: Learn Rails (Part 3)
5. Week 5: Learn Rails (Part 4)
6. Week 6: Practice Rails

<!-- more -->

# Table of Content

* [History and Introduction](#history-and-introduction)
* [Structure of Rails App](#structure-of-rails-app)
* [Gems and Bundler](#gems-and-bundler)
* [Routes](#routes)
* [Coding Style](#coding-style)

*Note: This tutorial assumes that you are working on a Linux-based OS. If you come from Windows or MacOS, you may have you look elsewhere for resources created specifically to deal with these platforms. However, I believe that a major difference is in the installation process, and once you get past the installation, the rest of this tutorial should be applicable to any platform.*

# History and Introduction

Rails is a MVC (model-view-controller) web framework written in the Ruby programming language, it was created by David Heinemeier Hansson and was first released in 2004. One core principle of the framework is *convention over configuration*. For example, if you have a model named `User`, by convention you would expect to find it defined in a file named `app/models/user.rb`, and the database table will be named `Users`, and its controller will be a class named `UsersController` created in the file `app/controllers/users_controller.rb`, so on and so forth. Because of such convention, programmers usually do not need to write extra code to make things work. There is a whole page [doctrine](http://rubyonrails.org/doctrine/) written by the creator of Rails himself, read it if you are interested.

## MVC

In Rails, there is a clear separation of each part of MVC in terms of code organization. Later, you will see that the directory structure of a Rails app contains 3 distinct directories: `models`, `views` and `controllers` under the `app` application specific directory.

Models deal with business logic and data persistence.

Views deal with rendering display to users.

Controllers deal with receiving requests and sending responses, and controlling the data flow between views and models. Ideally, controllers should be thin, and should not contain *any* business logic.

We will discuss in greater details the role of each part of MVC in next week's tutorial.

## RVM

Ruby Version Manager, or RVM for short, as the name suggests, is a Ruby version manager (duh!). What it does is to help isolate your Ruby environments for various projects, so as to avoid version conflicts on your dependencies. For example, you may have created App A when the latest Rails version then was 3.2. Later, you create a new App B which runs on Rails 4.2. If you have not used RVM to manage the Ruby and gems versions, you may likely run into problem in your older App A when you upgrade to Rails 4.2. To solve this kind of version problems, you can use RVM to isolate the Ruby environment and the gems for each individual project. This allows you to continue running App A on Rails 3.2, while running App B on Rails 4.2.

RVM is considered beyond the scope of this learning project, so if you want to find out how to use it, please read the official [docs](https://rvm.io/).

## Installation

Rails can be installed using RubyGems package manager by issuing the `gem` command like this:

```
gem install rails
```

You can provide the `-v` flag to indicate the version of Rails you want to install, for example, if you want to install the latest build which is not a stable release yet, you can specify `-v 5.0.0.rcl`, where `5.0.0` is the latest release candidate as of this writing. Otherwise, the default version will be the latest stable release, which is `4.2.6` as of this writing.

## Creating a New Rails App

After installing Rails, you can verify the installation by running `rails -v`. You should probably see something like this `Rails 4.2.6`.

Now that we have installed Rails, we can start creating our web app by the command `rails new blog`. This will create a `blog` directory which contains all the pre-generated code by Rails.

[Back to top](#table-of-content)

# Structure of Rails App

Running the `rails new` command will help generate the following folder structure and certain pre-configured files. It is a very convenient and fast way of generating an application skeleton, but to be able to customize it with ease, it is best to understand the structure and what the pre-configured files do.

```
├── app/
│   ├── assets/
│   ├── controllers/
│   ├── helpers/
│   ├── mailers/
│   ├── models/
│   └── views/
├── bin/
├── config/
|── config.ru
├── db/
├── Gemfile
├── Gemfile.lock
├── .gitignore
├── lib/
├── log/
├── public/
├── Rakefile
├── README.rdoc
├── test/
├── tmp/
└── vendor/
```

`app` directory contains most of the application code, including the static files, models, views and controllers.

`bin` directory contains executable scripts that run tasks such as DB migration and generating routes.

`config` directory contains configuration for the application, for example, you can customize your routes in the `routes.rb` configuration file.

`config.ru` file contains configuration to run the application via `rackup` command instead of `rails server`. `rackup` is a command of Rack, the minimal web interface for Ruby. Rack is beyond the scope of this learning project, to read more, please see the official [docs](http://rack.github.io/).

`db` directory contains all the model creation/update code. Instead of writing SQL, you will be using Ruby for dealing with the DB.

`Gemfile` file contains the declaration for the required gems in the application. Running `bundle install` command will install the gems as defined.

`Gemfile.lock` file contains a snapshot of all the gems, including their dependencies and specific versions.

`.gitignore` file is generated for a Git repository. You define the files you *do not* want to commit to a remote repository, for example, `secrets.yml`.

`lib` directory contains library modules.

`log` directory contains the log files of your running application.

`public` directory contains files that are accessible to the public as they are such as compiled asset files and error pages.

`Rakefile` file contains tasks that can be run using `rake` command. In a Rails app, you should not directly change this file, instead, put your tasks into the `lib/tasks` directory and let the `Rakefile` be the entry point of all your tasks.

`README.rdoc` file is a simple documentation which can cover things like Ruby version, deployment instructions etc.

`test` directory contains the tests code for the application.

`tmp` directory contains temporary files such as cache and session files.

`vendor` directory contains third-party code such as plugins and gems.

[Back to top](#table-of-content)

# Gems and Bundler

Gems are packages written in Ruby. They are usually reusable components and can be used by your Ruby application so that you don't have to write your own code. One such example is Rails itself, which is a reusable web framework, created for the convenience of other Ruby developers in building a web application. Therefore, it is important to understand how to search for such reusable packages and install them for your own use.

In the Rails project directory structure above, there are `Gemfile` and `Gemfile.lock` files. These files will be the ones used to manage the gems required for our application. We will only make changes to the `Gemfile` file and use Bundler to manage the dependencies of the required gems.

Let's look at an example of a `Gemfile` that is created after we run `rails new blog` command previously.

```
source 'https://rubygems.org'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.6'
# Use sqlite3 as the database for Active Record
gem 'sqlite3'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
```

At the beginning of the `Gemfile`, we must specify the source of Ruby gems. In this case, the Bundler application should search for the gems from `https://rubygems.org`. If you need to access a private gem repository, then you need to specify the source for the gem like this:

```
gem 'private_gem', '1.0', :source => 'https://privategemrepo.com'
```

For each gem required, we need to minimally define the gem name, eg. `sqlite3`. Then Bundler will just take the latest stable release of the gem. If we want a specific version, then specify the second argument of `gem` with the required version number. For example, we use version `4.2.6` for `rails` gem.

Once you have specified all the gems required, run the command `bundle install`. Bundler will then install the required gems together with all dependencies as and when necessary and generate a snapshot of all gems including dependencies and their versions in the `Gemfile.lock` file.

## Versioning

There are 2 special notations for using gem version.

`~>` means that we require at least the version specified up to the latest minor point release (minor point release as in 4.0.0 to 4.0.1), but not later than next major point release (major point release as in 4.0 to 4.1). For example, `gem 'sass-rails', '~> 5.0'` means that we only require at least version `5.0` and anything up to `5.0.x` where `x` can be any number, but not the next major point version, `5.1` in this case.

`>=` means that any version including and after the specified one will be used as and when a new version is released. For example, `gem 'uglifier', '>= 1.3.0'` means that we require at least version `1.3.0`, if there is new version released after that, then the new version will be used.

*Note: By convention, minor point release should not break things, but it's hard to control what external gems do with each version release. It is therefore best to use exact version when including the gem.*

## Groups

Grouping allows you to specify gems required only for certain environments. For example, you may want to use `sqlite3` as DB for your development environment, but may want to use `pg` (PostgreSQL) as DB for your production environment.

Groups are declared like this:

```
group :development, :test do
  gem 'sqlite3'
end

group :production do
  gem 'pg'
end
```

Then, when you run `bundle install`, you can specify which group to *exclude*. For example, if you are in test environment, you can run `bundle install --without development production`. This will install only the default gems and gems declared under the `test` group.

*Note: Any gem that is declared in both development/production and test groups in the above example will still be installed.*

[Back to top](#table-of-content)

# Routes

The router takes care of routing browser requests (or requests that may come from API calls) to specific controller actions. To define routes, we will make changes to the `config/routes.rb` file. By convention, we only need to specify the resource available for our app in the `config/routes.rb` file, and Rails will define the CRUD (Create, Retrieve, Update, Delete) routes accordingly.

For example, our app has a `product` resource, which we define as `resources :products` in `config/routes.rb` file. Then, we run `bin/rake routes` to find out what routes are available for `product` by default: 

```
Running via Spring preloader in process 8724
      Prefix Verb   URI Pattern                  Controller#Action
        root GET    /                            welcome#index
    products GET    /products(.:format)          products#index
             POST   /products(.:format)          products#create
 new_product GET    /products/new(.:format)      products#new
edit_product GET    /products/:id/edit(.:format) products#edit
     product GET    /products/:id(.:format)      products#show
             PATCH  /products/:id(.:format)      products#update
             PUT    /products/:id(.:format)      products#update
             DELETE /products/:id(.:format)      products#destroy
```

We can see that many routes have been defined for the `product` resource, let's go through them one-by-one.

Remember previously we mentioned that Rails emphasizes *convention over configuration*, so in this case, we can safely assume that the model file for `product` will be in `app/models/product.rb`, the controller file will be in `app/controllers/products_controller.rb` and the view files in `app/views/products/*`. We will discuss in greater details the convention of the view files in next week's tutorial.

|---
| Route | Purpose
|-|-
| GET `/products(.:format)` | Return a collection of `product` resource, can be filtered depending on the request parameters
| POST `/products(.:format)` | Create a new `product` resource according to the request parameters
| GET `/products/new(.:format)` | Return a page containing the form that allows creating a new `product` resource
| GET `/products/:id/edit(.:format)` | Return a page containing the form that allows editing the attributes of the `product` resource identified by `:id`
| GET `/products/:id(.:format)` | Return the `product` resource identified by `:id`
| PATCH `/products/:id(.:format)` | Update the `product` resource identified by `:id` according to the request parameters, the resource must already exists
| PUT `/products/:id(.:format)` | Update the `product` resource identified by `:id` according to the request parameters, if the resource does not exist, create a new resource
| DELETE `/products/:id(.:format)` | Delete the `product` resource identified by `:id`
|---
{:.table}

We will discuss the implementation of the controller actions in next week's tutorial. For now, we will keep in mind that each route should correspond to a method defined in the corresponding controller class.

## Root

Every web application has an initial entry point, usually it's the root URL defined by `/`. We need to tell the router which controller action to route to when it encounters `/` URL. To do that, we will declare in `config/routes.rb` file the following:

```
root 'welcome#index'
```

This tells the router that the root URL should be routed to the `WelcomeController`'s `index` action.

## Prefix

You notice that when you run `bin/rake routes`, the table includes a `Prefix` column. You can append `_path` or `_url` to the `Prefix` in your Ruby code to get the corresponding URL.

To illustrate, let's say you want to provide a link to the `product` resource identified by `10` as the `:id`. Instead of writing the long string of URL (this is especially tedious if you have nested resources), you can just write `product_path(10)` and it will return the URL as `/products/10`. This is commonly used in views when generating a link tag for a particular resource, for example:

```
<%= link_to 'Edit Product', edit_product_path(@product) %>`
```

Note that you don't always have to provide the `:id` parameter for the `_path` or `_url` helper. Instead, if you have already an instance of the resource, you can directly pass in the instance as parameter, as shown in the above example.

The difference between `url` and `path` is that, `path` returns a URL that is relative to your app root, whereas `url` provides the absolute URL including the protocol and hostname.

## Custom Routes

You don't always have to use the predefined routes by Rails. Sometimes, you need to create pages which have nothing to do with your app resources, for example, an `About` page. You can define your custom controller class and actions with custom URLs.

Let's say you want to create static pages for `About` and `Contact`. You can create a new controller, the corresponding view file and define the routes in `config/routes.rb` like this:

```
# app/controllers/pages_controller.rb
class PagesController < ApplicationController
  def about
  end

  def contact
  end
end

# app/views/pages/about.html.erb
<h1>About</h1>
<p>This is the About page</p>

# app/views/pages/contact.html.erb
<h1>Contact</h1>
<p>This is the Contact page</p>

# config/routes.rb
Rails.application.routes.draw do
  get 'pages/about'
  get 'pages/contact'
end
```

Now, when you enter `http://<ip>:<port>/pages/about` in the browser address bar, you should see the HTML rendered has the heading `About` and body `This is the About page`.

[Back to top](#table-of-content)

# Coding Style

Rails applications follow certain common style, so that it is easier for other Rails developers to read, understand and maintain the applications which are not developed by them. A full list of coding style for Rails is found [here](https://github.com/bbatsov/rails-style-guide). I will just highlight some of the more commonly used style (at least for myself) here.

## Naming Conventions

As mentioned again and again, Rails's principle is *convention over configuration*, so it is important to follow certain naming conventions which make your code more readable for other developers.

When defining a resource, here are some of the conventions to follow:

|---
| Component | Naming 
|-|-
| Route | `resources :products` with resource in plural form using symbols
| Controller File | `app/controllers/products_controller.rb` with name of corresponding model in plural form, suffixed by `_controller` in snake_case
| Controller Class | `class ProductsController < ApplicationController` with name of corresponding model in plural form, suffixed by `Controller` in CamelCase
| Model File | `app/models/product.rb` with name of the model in singular form
| Model Class | `class Product < ActiveRecord::Base` with name of model in singular form
| View Directory | `app/views/products/` with the name of the model in plural form
| View File | `app/views/products/index.html.erb` with the name of the corresponding action, and `.html.erb` extension
| View Partial File | `app/views/products/_product.html.erb` with the model in singular form, prefixed by `_`, and `.html.erb` extension
|---
{:.table}

## Separation of MVC

Business logic and data persistence code should reside only in the models. Try not to perform any business logic directly in the controllers. Views should not directly interact with models, but should go through the controllers.

## Partial Templates

As a result of following the MVC pattern, it is not advisable to include inline rendering in the controllers. Instead, create a partial view template, and use `<%= render partial: 'product', collection: products %>`.

## Status Codes

Instead of using hard-to-remember HTTP status code, use the corresponding symbols like this: `render status: :forbidden`. For a full list of status code symbols, please see this [gist](https://gist.github.com/mlanett/a31c340b132ddefa9cca).

## Non-persistent Business Logic

Sometimes you have business logic code that does not deal with data persistence, in this case, you don't actually need an `ActiveRecord` model, but an `ActiveAttr` module. Include the `ActiveAttr` gem, and create a non-persistent model class in `app/models/` like this:

```
class Message
  include ActiveAttr::Model

  attribute :name
  attribute :email
  attribute :subject
  attribute :content
  
  # other code here...
end
```

## Validators

If you have commonly used validators, for example, email validators, it is better to extract it into a separate class instead of writing the same validation code everywhere.

First, we need to create a new directory `app/validators`. This directory contains all the validator files. Then, we need to tell Rails where to load the validator files by adding this line in `config/application.rb`:

```
config.autoload_paths += %W["#{config.root}/app/validators/"]
```

Now, create a new file `app/validators/email_validator.rb`. In this file, define the `EmailValidator` class like this:

```
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
      record.errors[attribute] << (options[:message] || "wrong email address")
    end
  end
end
```

Then, you can now validate your email address field in your model like this:

```
validates :email_field, email: true
```

[Back to top](#table-of-content)

