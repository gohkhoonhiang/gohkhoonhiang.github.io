---
layout: post
title:  "Week 4: Learn Rails (Part 3)"
date: 2016-07-24 23:06:20 +0800
tags: [ruby, rails, tutorial]
description: This post is a summary of what I have learnt in the fourth week of the six-week Ruby on Rails learning project.
---

This is the fourth part of the six-week Ruby on Rails learning project.

1. [Week 1: Learn Ruby]({{site.url}}/2016/06/week-1-learn-ruby/)
2. [Week 2: Learn Rails (Part 1)]({{site.url}}/2016/07/week-2-learn-rails-part-1/)
3. [Week 3: Learn Rails (Part 2)]({{site.url}}/2016/07/week-3-learn-rails-part-2/)
4. [Week 4: Learn Rails (Part 3)]({{site.url}}/2016/07/week-4-learn-rails-part-3/)
5. Week 5: Practice Rails (Part 1)
6. Week 6: Practice Rails (Part 2)

<!-- more -->

# Table of Content

* [Asset Pipeline](#asset-pipeline)
* [Configuring Database](#configuring-database)
* [Testing](#testing)
* [Mailers](#mailers)

# Asset Pipeline

## Features

Asset pipeline provides a framework for managing the assets, namely Javascript and CSS, in a Rails application. There are 3 main features of asset pipeline:

1. Concatenate assets into single files
2. Minify and compress asset files
3. Precompile higher-level language assets into actual assets

Asset pipeline is implemented by the [sprockets-rails](https://github.com/rails/sprockets-rails) gem.

[Back to top](#table-of-content)

## Fingerprinting

Asset files in the asset pipeline are *fingerprinted*, that means, each version of the asset file is hashed and the hash is appended to the filename to differentiate each version of the file. The asset files are hashed and renamed everytime a change is made, allowing clients to cache the files and know when to make request for new files where the fingerprint has changed.

Fingerprinting is enabled by default. To disable it, edit the `config/environments/<environment>.rb` file and set `config.assets.digest = false`.

[Back to top](#table-of-content)

## Assets Organization

Assets can be organized in 3 different directories in a Rails application.

1. `app/assets` for application-specific assets
2. `lib/assets` for library codes
3. `vendor/assets` for third-party assets

All files included in these 3 directories will be publicly accessible by entering the URL `<ip>:<port>/assets/<filename>`. For example, if we have a file in `app/assets/javascripts/application.js`, this file is automatically available via the URL `<ip>:<port>/assets/application.js`.

[Back to top](#table-of-content)

## Manifest

Manifest files are used by the Sprockets gem to manage the assets to include and serve. They contain something called *directives*, which tell Sprockets which files to include in the file that is served to the client.

There are 3 commonly used directives:

* `require` - include a single file
* `require_tree` - include all files recursively relative to the current directory
* `require_directory` - include only files in the current directory and not the subdirectories
* `require_self` - include the body of the current file before the content of any other `require`d files

For example, inside the `app/assets/javascripts/application.js` file, we can find similar directives to the following:

```
//= require jquery
//= require jquery_ujs
//= require_self
//= require_tree .

alert("Hello")
```

`//= require_self` tells Sprockets to include the code `alert("Hello")` before all the other scripts to be included. `//= require jquery` and `//= require jquery_ujs` tell Sprockets to search for `jquery.js` and `jquery_ujs.js` files within `app/assets/javascripts`, while `//= require_tree .` tells Sprockets to recursively include all script files inside `app/assets/javascripts`. Then, Sprockets will concatenate all the scripts into `application.js`, and it will be served via `<ip>:<port>/assets/application.js`.

In the event that we want to exclude subdirectories in the load path, instead of using `//= require_tree .`, we can use `//= require_directory .`. This will tell Sprockets to load only the files which are at the same directory level as the file containing this directive.

Or, we can choose to include certain files or subdirectories by explicitly requiring the files/subdirectories:

```
//= require user
//= require product
//= require_tree ./public
```

This will tell Sprockets to only include `app/assets/javascripts/user.js`, `app/assets/javascripts/product.js` and `app/assets/javascripts/public/*` files.

You can read specifically about the directives in the [source code](https://github.com/rails/sprockets/blob/master/lib/sprockets/directive_processor.rb) comments.

[Back to top](#table-of-content)

## Pre-compile

In production mode, Rails assumes assets have been pre-compiled and served as static assets by the web server. To pre-compile the assets, we can run the Rake task:

```
RAILS_ENV=production bin/rake assets:precompile
```

The pre-compilation requires some memory, if you encounter errors such as this:

```
rake aborted!
ExecJS::RuntimeError:
(execjs):1
```

You may want to temporarily increase your memory space so that there is enough RAM to execute the command.

After running the task successfully, all assets will be combined into a single file with fingerprint and saved to `public/assets` directory.

When you run the server in *production* mode locally (by providing the `-e production` flag), you will be able to access the asset files via `<ip>:<port>/assets/<filename>-<fingerprint>.js`.

However, note the default behaviour is that the asset files are not served by Rails. Rails assumes that your server, such as Nginx, will handle serving the static files. To tell Rails to serve the static files when you run the *production* mode locally, you have to change the `config/environments/production.rb` file and set `config.serve_static_assets = true`.

There are other more advanced topics on the asset pipeline, such as customization of the pipeline, which are beyond this simple learning project. For more details, please read the [docs](http://guides.rubyonrails.org/asset_pipeline.html).

[Back to top](#table-of-content)

# Configuring Database

Rails can be used with a variety of databases, it currently supports MySQL, PostgreSQL and SQLite3. It is simple to configure which database to use in different deployment environment.

The place where we configure the database settings is in the `config/database.yml` file.

By default, Rails uses SQLite3 database in development mode. If we create a new Rails app and look at `config/database.yml` file, the default settings will be like this:

```
default: &default
  adapter: sqlite3
  pool: 5
  timeout: 5000

development:
  <<: *default
  database: db/development.sqlite3

test:
  <<: *default
  database: db/test.sqlite3

production:
  <<: *default
  database: db/production.sqlite3
```

In the default generated configuration file, we are using SQLite3 database, so the `adapter` we use is `sqlite3`. `pool` option indicates the connection pool size, which is `5` in this case. To avoid waiting to establish connection infinitely, the `timeout` option is used to indicate how long to wait to create the connection before terminating the attempt after failing to make one, and it is set as `5000` (in ms) by default.

In each deployment environment, we specify a different `database` option and use other default options from `default` configuration.

Besides SQLite3, we can also use PostgreSQL and MySQL. Here are some configuration options available for each type of database (reference [here](https://gist.github.com/erichurst/961978)):

```
#mysql2
development:
  adapter: mysql2
  encoding: utf8
  reconnect: false
  database: dev_db
  pool: 5
  username: dev
  password:
  socket: /tmp/mysql.lock

#postgresql
test:
  adapter: postgresql
  encoding: unicode
  database: test_db
  pool: 5
  username: test
  password: test
  host: localhost
  port: 5432
  prepared_statements: false
  statement_limit: 200
  schema_search_path: blogapp,public
  min_messages: warning
```

Besides specifying various configuration options, another way to define the connection settings is to use the `url` option like this:

```
test:
  url: postgresql://test:test@localhost:5432/test_db?pool=5&encoding=unicode
```

which will be translated into this:

```
test:
  adapter: postgresql
  username: test
  password: test
  host: localhost
  port: 5432
  database: test_db
  pool: 5
  encoding: unicode
```

If you use version control and push the code to a public repository, it is not a good idea to expose your DB credentials. To avoid that, you can specify the connection URL in an environment variable, and then reference the variable in your configuration file like this:

```
production:
  url: <%= ENV['DATABASE_URL'] %>
```

then set the environment variable before starting your Rails server, similar to this:

```
DATABASE_URL=postgresql://prod:prod@localhost:5432/prod_db?pool=5&encoding=unicode bin/rails server -b 0.0.0.0 -p 9080 -e production
```

In summary, there are 2 ways to configure a database, using the `config/database.yml` file, and using `ENV['DATABASE_URL']` environment variable. It is possible to mix a few of them for each deployment environment. However, there are some rules to which way of configuration will have a higher priority, described below in decreasing order of precedence.

[Back to top](#table-of-content)

## Using `url` option in `config/database.yml`

The `url` option will take the highest precedence even if `ENV['DATABASE_URL']` is available.

For example, if we define `config/database.yml` as such:

```
test:
  url: mysql2://test:test@localhost:3306/mysql_test_db
```

and we have the `ENV['DATABASE_URL']` defined as such:

```
postgresql://test:test@localhost/postgresql_test_db
```

then the final configuration will be:

```
adapter: mysql2
username: test
password: test
host: localhost
port: 3306
database: mysql_test_db 
```

[Back to top](#table-of-content)

## Using `ENV['DATABASE_URL']` environment variable

In the event that the `config/database.yml` file is present but has no configuration, `ENV['DATABASE_URL']` will be used.

In the event that the `config/database.yml` file is present with configuration, except `url` option, both `config/database.yml` and `ENV['DATABASE_URL']` will be used. Rails will attempt to merge the options from both, but the ones from the environment variable will take precedence.

For example, if we define `config/database.yml` as such:

```
test:
  adapter: mysql2
  pool: 5
  database: test_db
```

and we have the `ENV['DATABASE_URL']` defined as such:

```
postgresql://test:test@localhost/postgresql_test_db
```

then the final configuration will be:

```
adapter: postgresql
username: test
password: test
host: localhost
database: postgresql_test_db
pool: 5
```

The configuration in `config/database.yml` is ignored, except for `pool` option, which is absent in the environment variable, so it gets merged in to the final configuration.

[Back to top](#table-of-content)

## Using `config/database.yml`

If no `ENV['DATABASE_URL']` is present, then the configuration in `config/database.yml` will be used.

[Back to top](#table-of-content)

# Testing

Testing is default in Rails. When you create a new Rails project, it automatically creates the `test` directory for you, which has a few subdirectories like this:

```
test
├── controllers/
├── fixtures/
├── helpers/
├── integration/
├── mailers/
├── models/
└── test_helper.rb
``` 

`controllers` contains tests for controllers.

`fixtures` contains `.yml` files used to organize test data.

`helpers` contains tests for view helpers.

`integration` contains tests for interaction between controllers.

`mailers` contains tests for the mailers.

`models` contains tests for models.

`test_helper.rb` contains default configurations for tests.

To run a test case, we can use the `bin/rake test <test_file>.rb` command.

[Back to top](#table-of-content)

## Test Case

When we first generate a model using Rail's generator, the test stubs are also created for us in the `test` directory. Every test case will start with the line `require 'test_helper'`, so that we can define common methods in `test_helper.rb` that can be used for all test cases created.

Next, we will define the test class which extends from a variety of classes provided by Rails, such as `ActiveSupport::TestCase`. These predefined classes by Rails provide various methods that will be useful for us without us reinventing the wheel.

* `ActiveSupport::TestCase` - inherited by model test cases
* `ActionMailer:TestCase` - inherited by mailer test cases
* `ActionView::TestCase` - inherited by view helper test cases
* `ActionDispatch:IntegrationTest` - inherited by controller integration test cases
* `ActiveJob::TestCase` - inherited by job test cases

A test case can be defined as a block like this:

```
test "sum of one plus one is two" do
  assert 1+1==2
end
```

Or, we can define a method like this:

```
def test_sum_of_one_plus_one_is_two
  assert 1+1==2
end
```

This will give us the test result like this:

```
> bin/rake test test/models/product_test.rb
Run options: --seed 37219

# Running:

.

Finished in 0.036363s, 27.5004 runs/s, 27.5004 assertions/s.

1 runs, 1 assertions, 0 failures, 0 errors, 0 skips
```

Let's look at how the result will be for this assertion:

```
def test_sum_of_one_plus_one_is_two
  assert 1+1==3
end
```

which will give us a failure:

```
> bin/rake test test/models/product_test.rb
Run options: --seed 25948

# Running:

F

Finished in 0.016445s, 60.8082 runs/s, 60.8082 assertions/s.

  1) Failure:
ProductTest#test_sum_of_one_plus_one_is_two [/blog/test/models/product_test.rb:8]:
Expected false to be truthy.

1 runs, 1 assertions, 1 failures, 0 errors, 0 skips
```

On the other hand, we may have errors in our test case, that is, the test case cannot be run due to some errors such as missing variable. One such example is like this:

```
def test_sum_of_one_plus_one_is_two
  no_such_variable
  assert 1+1==2
end
```

which will give us the following result:

```
> bin/rake test test/models/product_test.rb
Run options: --seed 30859

# Running:

E

Finished in 0.032698s, 30.5832 runs/s, 0.0000 assertions/s.

  1) Error:
ProductTest#test_sum_of_one_plus_one_is_two:
NameError: undefined local variable or method `no_such_variable' for #<ProductTest:0x00000004a51c08>
    test/models/product_test.rb:8:in `test_sum_of_one_plus_one_is_two'

1 runs, 0 assertions, 0 failures, 1 errors, 0 skips
```

There is a list of available assertions in the [docs](http://guides.rubyonrails.org/testing.html#available-assertions), which will not be covered in this tutorial for clarity.

[Back to top](#table-of-content)

## Fixtures

As mentioned earlier, fixtures are test data used for our test cases. When we run the `bin/rake test` command, the test data will automatically be loaded to the test database so that we can make use of the test data in our test cases.

For example, we can define our fixture in `test/fixtures/products.yml` like this:

```
iphone:
  name: iphone6s
  category: phone
  price: 1299
```

To use the fixture, we can do this in the test case:

```
def test_iphone_exists
  phone = products(:iphone)
  assert_not_nil(phone)
end
```

If there is an association defined between 2 models, we can create the fixtures like this:

```
# test/fixtures/products.yml
iphone:
  name: iphone6s
  category: phone
  price: 1299

# test/fixtures/categories.yml
phone:
  name: Mobile Phone
```

Sometimes, you may need to load a few hundreds or thousands of rows of data at once, but it will be a hassle to define each fixture one by one. Rails allows us to embed Ruby code in the YAML file so that we can programatically generate the fixtures. For example, if we need to generate 1000 products, we can use ERB to do it:

```
<% 1000.times do |n| %>
product_<%= n %>:
  name: item_<%= n %>
  category: generic
  price: <%= n %>
<% end %>
```

This will give us 1000 fixtures like this:

```
product_1:
  name: item_1
  category: generic
  price: 1

product_2:
  name: item_2
  category: generic
  price: 2

# ...

product_999:
  name: item_999
  category: generic
  price: 999

product_1000:
  name: item_1000
  category: generic
  price: 1000
```

[Back to top](#table-of-content)

## Controller Test

A simple controller test case can be written to test the controller actions. For example, we can test the `show` action correctly returns a view for an available resource by `id`.

First, we create the fixture in `test/fixtures/products.yml`:

```
product_1:
  id: 1
  name: item_1
  category: generic
  price: 1
```

In our `test/controllers/products_controller_test.rb`, we can write a simple test like this:

```
test "should get product 1" do
  get :show, id:1
  assert_response :success
end
```

Since we have created the sample data for product of `id=1`, we should expect this test case to pass like this:

```
> bin/rake test test/controllers/products_controller_test.rb
Run options: --seed 52061

# Running:

.

Finished in 0.811479s, 1.2323 runs/s, 1.2323 assertions/s.

1 runs, 1 assertions, 0 failures, 0 errors, 0 skips
```

Besides `get` method, we can also test other HTTP methods:

* `post`
* `patch`
* `put`
* `head`
* `delete`

[Back to top](#table-of-content)

## Integration Test

The `ActionDispatch::IntegrationTest` class provides various methods that allow us to write test cases for controller interactions. Integration tests are created using `bin/rails generate integration_test` command and will be saved to the `test/integration` directory.

[Back to top](#table-of-content)

### Flow with Redirect

A simple integration test will be to access the `/products/new` page and to create a new product. For example, we can generate a `test/integration/product_flow_test.rb` file to test such flow like this:

```
require 'test_helper'

class ProductFlowTest < ActionDispatch::IntegrationTest
  test "create product" do
    get "/products/new"
    assert_response :success

    post products_url,
      product: { name: "iphone6s", category: "phone", price: 1299 }
    assert_response :redirect
    follow_redirect!
    assert_response :success
    assert_select "div.product", "iphone6s"
  end
end
```

Assuming that we have created the `ProductsController` with the `new` and `create` actions. The `new` action should render the `new.html.erb` view which contains the product creation form. The `create` action is mapped by `products_url`, which is just `/products` that takes in a `hotel` parameter containing `name`, `category` and `price`. The `create` action should redirect to the `show` action, which renders the `show.html.erb` view, containing markups that display the product information, such as `<div class="product"><%= @product.name %></div>`, which should render the product's `name` attribute.

What we are doing in the above test case is that, we will first send a GET request to `/products/new` to get the `new.html.erb` view. We expect this response to be a `200`, so we use `assert_response :success`. Then, we make a POST request to `products_url` by passing in the parameter containing the `product`'s `name`, `category` and `price`. We expect this to redirect us to the `show.html.erb` view, so we use `assert_response :redirect`. If we want to follow through to the `show.html.erb` view, we need to use `follow_redirect!` method to make the subsequent request to the next resource. We expect to be given the `show.html.erb` view, so we use `assert_response :success`. Finally, we make sure the product is created by checking that the product name matches what we pass in the request parameter earlier. For that, we use `assert_select` to get the corresponding element, which we have defined as `<div class="product">`, then make sure the value is `iphone6s`.

This should give us a result similar to this:

```
> bin/rake test test/integration/product_flow_test.rb
Run options: --seed 27034

# Running:

.

Finished in 0.713950s, 1.4007 runs/s, 5.6026 assertions/s.

1 runs, 4 assertions, 0 failures, 0 errors, 0 skips
```

[Back to top](#table-of-content)

### Flash Message

Besides testing for data rendered in a view, we can also test for flash messages.

Let's say we want to update the product price, and in our controller action we have some validation that the price should be less than 100. If it is 100 or larger, we render the flash message "Product not updated!".

```
test "update product 1" do
  get "/products/1/edit"
  assert_response :success

  put product_url,
    { id: 1, product: { price: 100 } }
  assert_response :success
  assert_equal "Product not updated!", flash[:danger]
end
```

In our test case, we make a GET request to `/products/1/edit` which we expect to receive a `success` response. Then, we make a PUT request to `product_url` and pass in the `id: 1` and `product: {price: 100}` parameters. We should still expect a `success` response for rendering the `edit.html.erb` view, but this time we check that there should be a flash message that equals to `Product not updated!`. We run the test and should expect that all assertions pass.

```
> bin/rake test test/integration/product_flow_test.rb
Run options: --seed 5523

# Running:

.

Finished in 0.478451s, 2.0901 runs/s, 6.2702 assertions/s.

1 runs, 3 assertions, 0 failures, 0 errors, 0 skips
```

There are more details on testing which can be found in the [docs](http://guides.rubyonrails.org/testing.html), such as testing the mailers and jobs. These will not be covered in this simple learning project.

[Back to top](#table-of-content)

# Mailers

If your application has a kind of user account feature, it is very likely you will need to use the Action Mailer provided by Rails to send emails to your app users. It is very easy to configure the email settings and invoke some APIs from Action Mailer to send the emails, provided you already have a email server.

Mailers are similar to controllers, they consist of methods which are similar to controller actions, which take care of the logic of sending emails. Email templates are similar to application views, which are just HTML or plain text files with embedded Ruby code.

To generate a mailer, it is as simple as running `bin/rails generate mailer <MailerClass>` command. This will generate a few skeleton files and directories like this:

```
> bin/rails generate mailer UserMailer
create  app/mailers/user_mailer.rb
create  app/mailers/application_mailer.rb
invoke  erb
create    app/views/user_mailer
create    app/views/layouts/mailer.text.erb
create    app/views/layouts/mailer.html.erb
invoke  test_unit
create    test/mailers/user_mailer_test.rb
create    test/mailers/previews/user_mailer_preview.rb
```

[Back to top](#table-of-content)

## Email Server Settings

The email server settings can be configured in `config/environments/<environment>.rb` files. Let's say we want to configure the settings in development mode, we will add the following to `config/environments/development.rb`:

```
config.action_mailer.perform_deliveries = true
config.action_mailer.raise_delivery_errors = true
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address:              'your-email-server',
  port:                 587,
  domain:               'your-domain.com',
  user_name:            'your-email-username',
  password:             'your-email-password',
  authentication:       'plain',
  enable_starttls_auto: true  }
```

You can set up your own email server, or use existing email service to send emails. For example, you can use Gmail or Outlook as your email server. The SMTP settings vary depending on the email service you use, so that will not be covered here.

`perform_deliveries` option set to `true` will trigger the email sending, otherwise, the emails will not be sent. Usually it is `false` in development and test modes because you don't want to add to the load of the email server when you perform testing. The default is `false` if the option is not set.

`raise_delivery_errors` option set to `true` will raise errors, if any, if external email server is used for immediate delivery.

`delivery_method` option set to `:smtp` indicates that settings are configured in `smtp_settings`. Other methods are available, such as `:sendmail`, `:file` and `:test`.

`smtp_settings` option is a hash containing all necessary options for SMTP mail delivery.

[Back to top](#table-of-content)

## Base Application Mailer

A base `ApplicationMailer` class is created in `app/mailers/application_mailer.rb`. It can contain things that are common to all mailers, for example, sender of the emails and default layout.

```
class ApplicationMailer < ActionMailer::Base
  default from: "notifications@your-domain.com"
  layout 'mailer'
end
```

Each individual mailer will extend from `ApplicationMailer` and will be saved to `app/mailers/<mailer_name>.rb` files.

[Back to top](#table-of-content)

## Email Layouts

The base email layouts are generated and saved to `app/views/layouts/mailer.text.erb` and `app/views/layouts/mailer.html.erb`. This is similar to view layouts, where you can create a common look-and-feel of your email content that can be used for all types of emails in the system. For example, we can define the HTML layout like this:

```
<html>
  <body>
    <h1>Notification from Your-Domain.com</h1>
    <%= yield %>
  </body>
</html>
```

Then, every email that is sent out will contain a header "Notification from Your-Domain.com".

[Back to top](#table-of-content)

## Mailer Templates

The individual email templates are generated and saved to `app/views/<mailer_name>` directory, where each method in the mailer class will have its own template with the method name as file name, such as `app/views/user_mailer/welcome_email.html.erb`.

```
<!DOCTYPE html>
<html>
  <head>
    <meta content='text/html; charset=UTF-8' http-equiv='Content-Type' />
  </head>
  <body>
    <h1>Welcome to your-domain.com, <%= @user.username %></h1>
    <p>
      You have successfully signed up to your-domain.com,
      your username is: <%= @user.username %>.<br>
    </p>
    <p>
      To login to the site, just follow this link: <%= @url %>.
    </p>
    <p>Thanks for joining and have a great day!</p>
  </body>
</html>
```

Each template is just the usual HTML file. Ruby code can be embedded to display dynamic content, such as username and URLs. These Ruby objects are provided by the mailer class methods as explained in the following section.

[Back to top](#table-of-content)

## Mailer Methods

Methods are created in the mailer class to create some Ruby objects and compose a mail message based on some given data, which will then be used to send the actual email. For example, we can have a method that creates instances of `user` and `url`, and composes a mail message containing the welcome message and login link when a user signs up for an account.

In the `app/mailers/user_mailer.rb` file, we can create a method `welcome_email` like this:

```
class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    @url = "your-domain.com/login"
    mail(to: @user.email, subject: "Welcome to Our App!")
  end
end
```

The `@user` and `@url` can be used in the email template, as seen in the previous section. The method returns a `mail` object, which is initialized to having the `@user.email` value for `to` field and "Welcome to Our App!" for the `subject` field.

This method can be invoked from the application controller to send out the email after the user signs up for an account successfully.

[Back to top](#table-of-content)

## Invoking Email Sending

To use the mailer, we can simply add a line in our `UsersController` class's `create` action like this:

```
def create
  @user = User.new(user_params)
  if @user.save
    UserMailer.welcome_email(@user).deliver_now
    flash.now[:success] = "You have signed up successfully!"
    clear_flash_danger
  else
    flash.now[:danger] = "Invalid form"
    clear_flash_success
  end
  render "new"
end
```

The `UserMailer.welcome_email` method is called, passing in the `@user` object. The `mail` object returned by the method has a `deliver_now` method, which tells the mailer to send the email immediately synchronously. If you want to send the email asynchronously (which is the recommended way), you can use `deliver_later` instead. Active Job will pick up the email and send out automatically.

## Attachments

Sometimes you might want to attach something inline in the email, for example, your website logo, and it is fairly simple to implement. In the mailer method, we create another object to hold the image file, and use it in the email template.

In the `app/mailers/user_mailer.rb` file, we add one more line:

```
class UserMailer < ApplicationMailer
  def welcome_email(user)
    @user = user
    @url = "your-domain.com/login"
    attachments.inline['logo.jpg'] = File.read(Rails.root.join("public/assets/logo.jpg"))
    mail(to: @user.email, subject: "Welcome to Our App!")
  end
end
```

Note that we need to call the `inline` method to make this attachment available for inline attaching.

Then in the `app/views/user_mailer/welcome_email.html.erb` file, we add the `image_tag` to the image URL like this:

```
<%= image_tag attachments['logo.jpg'].url %>
```

The email sent out will then have the image embedded in the content.

If you just simply want to attach a file to the email, you can remove the `image_tag` in the view, and do not invoke the `inline` method when creating the `attachments` hash.

[Back to top](#table-of-content)

## Generated URLs

Sometimes you don't want to hardcode URLs in your email templates, for example, the domain name, which *might* change some day in the future. We can make use of an additional option in the configuration that specifies the host, and we can use the `_url` method helper to generate the URLs accordingly.

In the `config/environments/<environment>.rb` file, add the following option:

```
config.action_mailer.default_url_options = { host: 'your-domain' }
```

Then in the mailer method, we can call the `_url` method helper like this:

```
@url = login_url
```

Say your login URL is `your-domain/login`, the helper above together with the `host` option will generate the full URL in the email like this:

```
http://your-domain/login
```

Usually you don't need more advanced configuration for sending simple emails like the above welcome emails. If you want to know more detailed configuration, you can refer to the [docs](http://guides.rubyonrails.org/action_mailer_basics.html).

[Back to top](#table-of-content)

