---
layout: post
title:  "Week 3: Learn Rails (Part 2)"
date: 2016-07-17 13:36:08 +0800
tags: [ruby, rails, tutorial]
description: This post is a summary of what I have learnt in the third week of the six-week Ruby on Rails learning project.
---

This is the third part of the six-week Ruby on Rails learning project.

1. [Week 1: Learn Ruby]({{site.url}}/2016/06/week-1-learn-ruby/)
2. [Week 2: Learn Rails (Part 1)]({{site.url}}/2016/07/week-2-learn-rails-part-1/)
3. [Week 3: Learn Rails (Part 2)]({{site.url}}/2016/07/week-3-learn-rails-part-2/)
4. Week 4: Learn Rails (Part 3)
5. Week 5: Practice Rails (Part 1)
6. Week 6: Practice Rails (Part 2)

<!-- more -->

# Table of Content

* [Controllers](#controllers)
* [Views](#views)
* [Models](#models)

# Controllers

As mentioned in [last week's tutorial]({{site.url}}/2016/07/week-2-learn-rails-part-1/), controllers take care of receiving requests and returning responses, and controlling the data flow between views and models. 

[Back to top](#table-of-content)

## Actions

In last week's [tutorial]({{site.url}}/2016/07/week-2-learn-rails-part-1/), we mentioned how routing works by mapping certain URI patterns to the controller's actions.

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

Based on the routing table above, we will implement the `ProductsController` as follows:

```
class ProductsController < ApplicationController
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
end
```

As you can see, each method in the controller class corresponds to a URI pattern in the routing table. When the router receives the URI from the client, it will base on this routing table to forward the request to the corresponding controller method.

`index`, `new` and `edit` methods conventionally return HTML pages to the client, while the rest of the methods will perform the CRUD operations and redirect/render the HTML pages by calling the `index`, `new` or `edit` methods.

[Back to top](#table-of-content)

## Parameters

When the client sends a request, it may also send query parameters (for the case of GET requests) or parameters in the request body (for the case of POST/PUT requests). Instead of having to decode the parameters manually by checking if the request is a GET or POST/PUT request, Rails provides a straightforward and simple way of retrieving parameters from any request. This is done simply by using the `params` hash in the controller. The hash key will then be the parameter name, whether it is a query parameter or parameter in the request body.

For example, given a GET request `/products?name=iphone`, we can retrieve the parameter like this:

```
def index
  @products = Product.find_by(name: params[:name])
end
```

The `params` hash contains all the query parameters and by providing the symbol for the parameter `name`, we can get the corresponding value `iphone` from the hash.

Similarly, say you have a form for creating a new `product` like this:

```
<form action="/products" method="POST">
  <input type="text" name="product[name]"/>
  <input type="text" name="product[category]"/>
  <input type="text" name="product[price]"/>
</form>
```

When the form is submitted, a POST request is sent to `/products` URL with the form data in the request body, we can use the same way to retrieve the data like this:

```
def create
  @product = Product.new(params[:product])
  @product.save
end
```

The `:product` symbol represents the form data for a `product` resource which has the value `{ "name" => "", "category" => "", "price" => "" }`.

[Back to top](#table-of-content)

## Strong Parameters

Strong parameters pattern allows whitelisting certain parameters for mass assignment in create or update operations. This prevents the users from accidentally updating sensitive model attributes.

To use strong parameters, we will create a private method that sets the permissible parameters like this:

```
def create
  @product = Product.new(product_params)
end

private

def product_params
  params.require(:product).permit(:name, :category, :price)
end
```

The `product_params` is a common method that can be used by both the `create` and `update` methods to check for permissible parameters. In this method, `product` parameter is `require`d, so if it is missing in the parameters hash, an error is raised. If the `product` parameter is available, then only `name`, `category` and `price` parameters can be mass assigned to the `product` model. By `permit`ing, only these parameters can be assigned to the model. If they are missing, Rails will not complain with an error unlike using `require`.

[Back to top](#table-of-content)

## Sessions

Sessions are used to store some data about the client between requests to allow the server to identify the client. There are a few different ways to implement sessions:

* Using cookie store, where the session data is stored at the client
* Using cache store, where the session data is stored in Rails cache
* Using ActiveRecord store, where the session data is stored in the database

To store something in the session, simply assign the value to the hash key of the `session` object like this:

```
def login
  if authenticate(params[:username], params[:password])
    session[:current_username] = params[:username]
  end
end
```

In this example, after the user successfully logs in, the `username` is set to the `session`'s `current_username` key.

To access the session data, access it like you normally would a hash object:

```
def index
  current_username = session[:current_username]
  @products = Product.find_by(username: current_username)
end
```

To remove a session data, simply set the value of the key to `nil`.

Or, if you want to remove the entire session data, just call `reset_session` like this:

```
def logout
  reset_session
  redirect_to :login_page
end
```

[Back to top](#table-of-content)

## Cookies

Cookies are similar to sessions, except that cookies can be persisted across sessions, that means, even after the browser closes and sessions are ended, cookies are still "remembered", until the cookies expire by a predefined timeframe.

Cookies are used in similar ways to sessions, like this:

```
def login
  if cookies[:username] && cookies[:user_token]
    redirect_to root_url
  else
    if authenticate(params[:username], params[:password])
      if params[:remember_me]
        cookies[:username] = params[:username]
        cookies[:user_token] = generate_token(params[:username])
      else
        cookies.delete(:username)
      end
      redirect_to root_url
    else
      render :login_page
    end
  end
end
```

In the example above, we attempt to implement the "Remember Me" feature, where the user using the same computer and browser to login does not need to enter the username and password again. This is done by storing the username and a special token in the cookies on the user's browser. When the request is sent to `/login`, we will attempt to look for the `username` and `user_token` keys in the `cookies` hash object. If found, we can immediately redirect the user to the home page. Otherwise, we will require the user to provide the login credentials for authentication. If the user is authenticated successfully and the "Remember Me" option is checked, we will store the username and a specially generated token in the cookies. This allows the user to visit the page again without having to provide the credentials.

*Note: Security is a very broad topic and requires in-depth discussion which is beyond the scope of this learning project. The example above is simplistic and should not be used as a model answer to building production-ready web applications.*

[Back to top](#table-of-content)

## Flash

Flash messages are useful for transmitting messages to the client between requests. For example, the client may send a request to perform some operation, and the server can use flash messages to inform the client the outcome. The flash message will only be available in the immediate new request, and will be cleared in any subsequent requests.

```
def create
  @product = Product.new(product_params)
  if @product.save
    flash[:notice] = "You have successfully created a new product"
    redirect_to products_url
  else
    flash.now[:alert] = "Error creating new product"
    render :new
  end
end
```

In the example above, if the product is created successfully, a `notice` flash message is displayed to the client when the `products` page is rendered. On the other hand, the `alert` flash message will be displayed when the product creation form is rendered.

Notice that for `notice`, we use `flash` directly, but for `alert`, we use `flash.now`. The difference is that, if the create operation is successful, the controller will return a response to ask the browser to send a new request to `/products`, then the flash message will be displayed; however, if the operation fails, the `new` page is rendered in the same request, and the flash message will not display until the next request is sent, so to display the message correctly, we need to use `flash.now` to indicate that the message should be displayed in the current request.

To access the flash message in the views, you can include this markup:

```
<% flash.each do |name, msg| -%>
  <%= content_tag :div, msg, class: name %>
<% end -%>
```

In the above example, we will iterate the `flash` hash object to get the key (mapped to `name` variable) and value (mapped to `msg` variable) and display the message. Notice that the `name` is used as the `div` tag class. To display the message contextually, you can define the style for `.notice` and `.alert` classes accordingly. This also means that, you are not limited to using `notice` or `alert` in the `flash` hash object. You can use whatever key that is meaningful in defining the type of message, and then create the corresponding class style.

[Back to top](#table-of-content)

## Filters

Filters intercept a request before, after or around the controller actions. These are useful for performing common operations such as user authentication for every request sent to the server. For example, you can implement a `before_action` filter that checks if the user is logged in, and redirects to the login page whenever necessary.

```
class ApplicationController < ActionController::Base
  before_action :require_login
 
  private
 
  def require_login
    unless logged_in?
      flash[:error] = "You must be logged in to access this section"
      redirect_to new_login_url # halts request cycle
    end
  end
end
```

The above code taken from the [Rails guide](http://guides.rubyonrails.org/action_controller_overview.html#filters) demonstrates how to use filters to intercept every request to check if the user is logged in.

Of course, having the `require_login` filter does not make sense if the user requests for the login page. Rails allows you to indicate which controller should skip the filter for certain actions. For example, the `SessionsController` should skip the filter for `new` and `create` actions in order to allow users to access the login page successfully.

```
class SessionsController < ApplicationController
  skip_before_action :require_login, only: [:new, :create]
end
```

[Back to top](#table-of-content)

# Views

There are a few ways to render views inside the controller actions, for a detailed explanation, you can refer to the [docs](http://guides.rubyonrails.org/layouts_and_rendering.html). Here, we will introduce some commonly used ways to render views.

[Back to top](#table-of-content)

## Render View Implicitly

The most basic rendering is done implicitly. For example, the following code:

```
def index
  @products = Product.all
end
```

will implicitly render `app/views/products/index.html.erb` and inside the template, you can make use of `@products` model to render the list of `product` resources.

[Back to top](#table-of-content)

## Render Another Action View

Sometimes, you need to refer to another action view based on certain conditions. For example, your CRUD actions will invoke calls to models to perform business logic, and then redirect to other actions that render the views.

```
def update
  @product = Product.find(params[:id])
  if @product.update(product_params)
    redirect_to(@product)
  else
    render :edit
  end
end
```

If the update is successful, the controller will redirect to the `/products/:id` URL, which will show the `product` resource page. There are a few ways to use `redirect_to` method to render a redirect URL. For more details, read the API [docs](http://api.rubyonrails.org/classes/ActionController/Redirecting.html#method-i-redirect_to).

On the other hand, if the update is unsuccessful, we want to display the edit form to the user again, so we call `render :edit`, which will render the `edit.html.erb` page.

[Back to top](#table-of-content)

## Render Another Controller Action

Sometimes you need to redirect to another controller action view, to do that, you can use `render "another_controller/action"`, for example:

```
class SessionsController < ApplicationController
  def create
    if authenticate(params[:username], params[:password])
      render "products/index"
    else
      render :new
    end
  end
end
```

In this code, if user logs in successfully (`authenticate` method returns `true`), then we will redirect to the `products/index` route, which will render the `app/views/products/index.html.erb` template.

Otherwise, we will call `render :new` to render the `app/views/sessions/new.html.erb` page.

[Back to top](#table-of-content)

## Render Plain Text

When you are building APIs, you may not need to render HTML pages, instead you want to render plain text as responses. You can do so by supplying the `plain` option like this:

```
def update
  @product = Product.find(params[:id])
  if @product.update(product_params)
    render plain: "OK"
  else
    render plain: "Error"
  end
end
```

The plain text string `OK` or `Error` will be returned as response to the client.

[Back to top](#table-of-content)

## Render JSON/XML

Similarly, you may want to return JSON/XML responses for your APIs, and you can do so by using the `json`/`xml` option like this:

```
def update
  @product = Product.find(params[:id])
  if @product.update(product_params)
    render json: @product
  else
    render plain: "Error"
  end
end
```

The model `@product` will be transformed into a JSON object and returned to the client.

For XML format, simply call `render xml: @product`.

[Back to top](#table-of-content)

## Layouts

Layouts provide a consistent look-and-feel throughout the application. It saves us the trouble of duplicating the same set of markups for every page we create in the application.

Every controller render views based on a default layout that has the same name as the controller. For example, the `ProductsController` will render views with the `app/views/layouts/products.html.erb` layout if it is available. When the default layout of the same name is not found, it will render views with the `app/views/layouts/application.html.erb`, since every controller extends from the `ApplicationController`.

While it is not recommended practice to deviate from the conventions, you can still customize the layouts for each controller with a special declaration like this:

```
class ProductsController < ApplicationController
  layout "inventory"

  # other code
end
```

In this case, the `ProductsController` will look for `app/views/layouts/inventory.html.erb` layout for rendering views.

[Back to top](#table-of-content)

## Partials

For consistency in our application UI, it is better to extract some common markups of the UI into reusable components. We call these reusable components *partials*. Partials reside in the `app/views/` directory and can be defined inside nested directories depending on the use case, for example, `app/views/layouts/`, and partials files are always prefixed with `_` with `.html.erb` extension.

To use a partial template to render a component, we call the `render` method and pass in the name of the partial file relative to the `app/views/` directory. If we have a `app/views/layouts/header.html.erb` partial, then we render it by calling `render 'layouts/header` without the file extension.

It is often a common practice to make the page header and footer partials, because we want to have a consistent header and footer layout throughout the application, at the same time, it is hard to maintain the application if we just duplicate the same set of markups for header and footer for every page in the application.

Let's look at the `app/views/layouts/application.html.erb` file and see how we can incorporate partials into it.

```
<!DOCTYPE html>
<html>
<head>
  <title>Blog</title>
  <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track' => true %>
  <%= javascript_include_tag 'application', 'data-turbolinks-track' => true %>
  <%= csrf_meta_tags %>
</head>
<body>

<%= yield %>

</body>
</html>
```

So, we want to have a navigation bar at the top of every page in the application. To do that, we first include the markup `<%= render 'layouts/header' %>` just below the `<body>` tag like this:

```
<body>
<% render 'layouts/header' %>
<%= yield %>

</body>
```

Then, we need to create the corresponding partials file `app/views/layouts/_header.html.erb`. Note that the name used in `render 'layouts/header'` should correspond to the file name of the partials, prefixed with `_` with `.html.erb` extension.

Then inside the partials file, we can include the markup for the navigation menu like this:

```
<header class="navbar navbar-fixed-top navbar-inverse">
  <div class="container">
    <%= link_to "Blog", '#', id: "logo" %>
    <nav>
      <ul class="nav navbar-nav navbar-right">
        <li><%= link_to "Home",   '#' %></li>
        <li><%= link_to "Log in", '#' %></li>
      </ul>
    </nav>
  </div>
</header>
```

[Back to top](#table-of-content)

# Models

Active Record represents the model layer of the MVC architecture of Rails. It provides the features of an ORM framework and allows Rails developers to perform data persistence using objects instead of writing SQL.

[Back to top](#table-of-content)

## Naming Conventions

As mentioned earlier, it is recommended to follow certain naming conventions for anything in Rails. For the model layer, model classes are named in singular form while the corresponding database table is named in plural form. For example, if we have a `Post` model, then the corresponding database table will be named `posts`.

To represent associations between models, we will create a foreign key column in a database table that links to the primary key of another table. For example, in the post-comment association, we may have a `post_id` column in `comments` table that references `id` column of the `posts` table. The naming convention for such foreign key column is `<table_name_in_singular_form>_id`.

[Back to top](#table-of-content)

## Schema Conventions

There are certain reserved column names used by Rails for default behaviour.

* id
* created_at
* updated_at
* lock_version
* type
* (association_name)_type
* (table_name)_count

[Back to top](#table-of-content)

## Create Model

Rails provides a simple way to generate a new model class. Simply use the `bin/rails generate model <Model>` command, and Rails will create the files associated with the model. For example, we want to create a `Product` model, then we can do this:

```
bin/rails generate model Product name:string category:string price:float
```

Then, the `app/models/product.rb` file will be created. An Active Record migration class will also be created like this:

```
# db/migrate/20160710065428_create_products.rb
class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.string :name
      t.string :category
      t.float :price

      t.timestamps null: false
    end
  end
end
```

By running `bin/rake db:migrate`, the database table will be created accordingly:

```
Running via Spring preloader in process 24352
== 20160710065428 CreateProducts: migrating ===================================
-- create_table(:products)
   -> 0.0031s
== 20160710065428 CreateProducts: migrated (0.0040s) ==========================
```

Here is a snapshot of the database schema found in the `db/schema.rb` file:

```
ActiveRecord::Schema.define(version: 20160710065428) do

  create_table "products", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.float    "price"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

end
```

[Back to top](#table-of-content)

## CRUD Operations

Active Record provides model methods that perform the corresponding CRUD database operations. This saves developers from writing SQL statements and allows them to deal with just Ruby code for data persistence.

### Create

To persist a new record, use the `create` class method by passing a hash of the model attributes.

```
def create
  @product = Product.create(name: "iPhone 6s", category: "Mobile Phone", price: 799)
end
```

Alternatively, you can first create an instance of the model, and then call the `save` method like this:

```
def create
  @product = Product.new(name: "iPhone 6s", category: "Mobile Phone", price 799)
  if @product.save
    flash[:notice] = "Success"
    redirect_to products_url
  else
    flash[:alert] = "Failed"
    render :new
  end
end
```

In the above example, you can instantiate a new `product` and call `save` method to persist the object.

### Read

To retrieve data, you can use a few different APIs depending on the need. For example, if you want to retrieve all records in the `products` table for display in the `index` page, you can use the `all` class method like this:

```
def index
  @products = Product.all
end
```

A more detailed list of available methods will be discussed in a later section below.

### Update

Updating is similar to creating, where you just need to retrieve the object and call `save` after setting the attributes.

```
def update
  @product = Product.find_by(name: params[:name])
  @product.price = params[:price]
  @product.save
end
```

Alternatively, you can call the `update` method directly and pass in the attribute to update:

```
def update
  @product = Product.find_by(name: params[:name])
  @product.update(price: params[:price])
end
```

### Delete

Deleting a record is as simple as calling the `destroy` method like this:

```
def destroy
  @product = Product.find_by(name: params[:name])
  @product.destroy
end
```

## Migrations

Migration is a useful feature in Rails. It helps to manage the database as it evolves overtime, so that developers do not need to write SQL but use Ruby code to make changes to the database. We have seen how we used the `bin/rake db:migrate` command to create a new database table. Similarly we can add/remove columns from existing tables and change column type or name using the migration tool.

### Add/Remove Columns

By convention, we will name the add column migration as `AddXXXToYYY` where `XXX` represents the new column name and `YYY` represents the table name; remove column migration will then be `RemoveXXXFromYYY`.

For example, we want to add a new column called `release_at` to the `products` table, then we will use Rails script to generate a migration like this:

```
bin/rails generate migration AddReleaseAtToProducts release_at:timestamp
```

This will create a migration file `db/migrate/20160710072029_add_release_at_to_products.rb`, and the migration class will be:

```
class AddReleaseAtToProducts < ActiveRecord::Migration
  def change
    add_column :products, :release_at, :timestamp
  end
end
```

When you run `bin/rake db:migrate` command, the column will be added to the database table accordingly.

```
Running via Spring preloader in process 24495
== 20160710072029 AddReleaseAtToProducts: migrating ===========================
-- add_column(:products, :release_at, :timestamp)
   -> 0.0013s
== 20160710072029 AddReleaseAtToProducts: migrated (0.0022s) ==================
```

The database schema now looks like this:

```
ActiveRecord::Schema.define(version: 20160710072029) do

  create_table "products", force: :cascade do |t|
    t.string   "name"
    t.string   "category"
    t.float    "price"
    t.datetime "release_at"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

end
```

Removing a column is similar to adding a column, where the migration class will be named `RemoveReleaseAtFromProducts`, and instead of `add_column`, the method will be `remove_column`.

```
class RemoveReleaseAtFromProducts < ActiveRecord::Migration
  def change
    remove_column :products, :release_at, :timestamp
  end
end
```

### Change Table

Sometimes our application logic changes in such a way that we need to perform heavy modification to our database tables. Instead of multiple add/remove column migrations, we can consolidate all into a single migration for `change_table` like this:

```
class ChangeProducts < ActiveRecord::Migration
  def change
    change_table :products do |t|
      t.remove :name
      t.string :title
      t.rename :release_at, :release_date
    end
  end
end
```

And running `bin/rake db:migrate` command will change the table columns accordingly:

```
Running via Spring preloader in process 24637
== 20160710073154 ChangeProducts: migrating ===================================
-- change_table(:products)
   -> 0.0196s
== 20160710073154 ChangeProducts: migrated (0.0212s) ==========================
```

Now the schema looks like this:

```
ActiveRecord::Schema.define(version: 20160710073154) do

  create_table "products", force: :cascade do |t|
    t.string   "category"
    t.float    "price"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.datetime "release_date"
    t.string   "title"
  end

end
```

There are a lot more ways to use migration tool in Rails, which I will not cover in this basic learning project. To learn more, read the official [docs](http://guides.rubyonrails.org/active_record_migrations.html).

[Back to top](#table-of-content)

## Validations

Rails provides helpers for validation at model level. This helps to prevent persisting invalid data into the database. Validations happen only for the following methods before they are executed:

* save
* update
* create

and their corresponding *bang* versions. The difference is that if the normal validations fail, a `false` value is returned; using the *bang* versions, an exception is raised.

For models that fail validations, the errors associated with the failed attribute validation is available in the object's `errors[:attribute]` field. For example, if there is validation on the `product.name` field, any error found in the validation will be available when calling `product.errors[:name]`.

Rails have some predefined validation methods that are commonly used in web applications. Here are some of the examples:

### Acceptance

`acceptance` validation is used for checkbox validation. One common use case is for the `Accept terms and conditions` checkbox. To validate a checkbox, add the `validates` method in the model class like this:

```
def User < ApplicationRecord
  validates :terms_and_conditions, acceptance: true, message: "Must accept terms and conditions"
end
```

### Presence

`presence` validation checks that the field must not be empty, usually used in username field. To use this validation, add the `validates` method like this:

```
def User < ApplicationRecord
  validates :username, presence: true
end
```

### Confirmation

`confirmation` validation checks that two fields have the same values, usually used in confirming passwords or email addresses. To use this validation, add the `validates` method like this:

```
def User < ApplicationRecord
  validates :email, confirmation: true
  validates :email_confirmation, presence: true
end
```

`confirmation: true` tells Rails to validate the content of the `email` and `email_confirmation` fields matches, and `presence: true` makes sure `email_confirmation` is not empty.

Now you can display the fields in the view like this:

```
<%= text_field :email %>
<%= text_field :email_confirmation %>
```

### Length

`length` validation checks the length of the value of a field. One use case is in checking password length. To use this validation, add the `validates` method like this:

```
def User < ApplicationRecord
  validates :password, presence: true, length: { in: 6..12 }
end
```

This will validate that the password is at least 6 character-long and at most 12 character-long.

You can also use `minimum` or `maximum` on its own instead of a range using `in`. For exact length, use the `is` option.

### Numericality

`numericality` validation checks that the input consists of only numeric values. For example, quantity field takes in only numeric values. To use this validation, add the `validates` method like this:

```
def Product < ApplicationRecord
  validates :quantity, numericality: true
end
```

There are options that limit the numeric value, such as `greater_than`, `less_than` and `equal_to`.

### Allow Nil/Blank

Sometimes you have fields that require validation when the field is not empty, but passing the validation options for the fields turn them into required fields. To allow validation on optional fields, we can add the `allow_nil` or `allow_blank` option to the validation like this:

```
def User < ApplicationRecord
  validates :age, numericality: true, allow_nil: true
end
```

In this example, if user enters a value for the `age` field, the validation will be triggered to check that the input consists of numeric values only. But if the user decides to leave this field blank, the validation will be skipped and no error will be reported.

### Custom Validation

Besides the common validation helpers provided by Rails, we sometimes require custom validation for certain fields. To create a custom validator, we create the `app/validators` directory and a new validator class, for example, `apple_validator.rb`. The class will be defined like this:

```
class AppleValidator < ActiveModel::Validator
  def validate(record)
    if !record.name.start_with?("Apple")
      record.errors[:name] << "Apple product name must start with 'Apple'"
    end
  end
end
```

Then, we can use the validator like this:

```
def Product < ApplicationRecord
  validates_with AppleValidator
end
```

Alternatively, custom validation can also be created using `validates_each` like this:

```
class Product < ApplicationRecord
  validates_each :name, :category do |record, attr, value|
    if !value.start_with?("Apple")
      record.errors.add(attr, "Must start with 'Apple'")
    end
  end
end
```

In this example, we pass in a few attributes to the `validates_each` method which will perform a common validation in the block.

### Custom Validation Message

Instead of using the default error message, you can specify a custom error message for each validation. For example:

```
class User < ApplicationRecord
  validates :username, presence: { message: "Username must be provided" }
end
```

### Contextual Validation

By default, validation is performed during create and update operations. You can specify `on` option to perform validation only during certain operations. For example, you can share the password field in both create and update forms, but you only require the password during creation and not during update, then you can specify the option like this:

```
class User < ApplicationRecord
  validates :password, presence: true, on: :create
end
```

To read more about validations, refer to the [docs](http://guides.rubyonrails.org/active_record_validations.html).

[Back to top](#table-of-content)

## Associations

Model associations are handled by Rails with its Active Record framework. By writing the appropriate models and using the correct options, Rails can provide us with many useful functionalities to deal with model associations.

### Types of Associations

Rails supports 6 types of associations.

|---
| Type | Explanation | Example
|-|-|-
| `belongs_to` | One-to-one relationship where one instance of the declaring model belongs to exactly one instance of another model | one `book` belongs to one `author`
| `has_one` | One-to-one relationship where one instance of the declaring model has exactly one instance of another model | one `customer` has one `account`
| `has_one :through` | One-to-one relationship where one instance of the declaring model has exactly one instance of another model through a third model | one `customer` has one `account_history` through `account`
| `has_many` | One-to-many relationship where one instance of the declaring model has many instances of another model | one `author` has many `books`
| `has_many :through` | One-to-many relationship where one instance of the declaring model has many instances of another model through a third model | one `physician` has many `patients` through `appointments`
| `has_and_belongs_to_many` | Many-to-many relationship where one instance of the declaring model has many instances of another model, vice versa | one `author` has and belongs to many `books`, one `book` has and belongs to many `authors`
|---
{:.table}

Let's look at the model and table schema of each type of associations.

#### `belongs_to`

To model *one book belongs to one author*:

```
class Book < ApplicationRecord
  belongs_to :author
end
```

The corresponding migration method looks like this:

```
create_table :authors do |t|
  t.string :name
end

create_table :books do |t|
  t.string :title
  t.belongs_to :author, index: true
end
```

This will give us the database tables:

*Authors*

|---
| Type | Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Books*

|---
| Type | Column
|-|-
| integer | id
| string | title
| integer | author_id
|---
{:.table}

Note how the foreign key column must be created in the model that declares `belongs_to`.

#### `has_one`

To model *one customer has one account*:

```
class Customer < ApplicationRecord
  has_one :account
end
```

The corresponding migration method looks like this:

```
create_table customer do |t|
  t.string :name
end

create_table :accounts do |t|
  t.string :account_number
  t.belongs_to :customer,index: true
end
```

This will give us the database tables:

*Customers*

|---
| Type | Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Accounts*

|---
| Type | Column
|-|-
| integer | id
| string | account_number
| integer | customer_id
|---
{:.table}

Note how the foreign key is created in the other model that the declaring model `has_one` of.

#### `has_one :through`

To model *one customer has one account history through one account*:

```
class Customer < ApplicationRecord
  has_one :account
  has_one :account_history, through: :account
end

class Account < ApplicationRecord
  belongs_to :customer
  has_one :account_history
end

class AccountHistory < ApplicationRecord
  belongs_to :account
end
```

The corresponding migration method looks like this:

```
create_table :customers do |t|
  t.string :name
end

create_table :accounts do |t|
  t.string :account_number
  t.belongs_to :customer, index: true
end

create_table :account_histories do |t|
  t.integer :status
  t.belongs_to :account, index: true
end
```

This will give us the database tables:

*Customers*

|---
| Type | Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Accounts*

|---
| Type | Column
|-|-
| integer | id
| string | account_number
|---
{:.table}

*AccountHistories*

|---
| Type | Column
|-|-
| integer | id
| integer | status
| integer | account_id
|---
{:.table}

#### `has_many`

To model *one author has many books*:

```
class Author < ApplicationRecord
  has_many :books
end

class Book < ApplicationRecord
  belongs_to :author
end
```

The corresponding migration method looks like this:

```
create_table :authors do |t|
  t.string name
end

create_table :books do |t|
  t.string title
  t.belongs_to :author, index: true
end
```

This will give us the database tables:

*Authors*

|---
| Type | Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Books*

|---
| Type | Column
|-|-
| integer | id
| string | title
| integer | author_id
|---
{:.table}

#### `has_many :through`

To model *one physician has many patients through appointments*:

```
class Physician < ApplicationRecord
  has_many :appointments
  has_many :patients, through: :appointments
end

class Patient < ApplicationRecord
  has_many :appointments
  has_many :physicians, through: :appointments
end

class Appointment < ApplicationRecord
  belongs_to :physician
  belongs_to :patient
end
```

The corresponding migration method looks like this:

```
create_table :physicians do |t|
  t.string name
end

create_table :patients do |t|
  t.string name
end

create_table :appointments do |t|
  t.timestamp :appointment_date
  t.belongs_to :physician, index: true
  t.belongs_to :patient, index: true
end
```

This will give us the database tables:

*Physicians*

|---
| Type | Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Patients*

|---
| Type |  Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Appointments*

|---
| Type | Column
|-|-
| integer | id
| timestamp | appointment_date
| integer | physician_id
| integer | patient_id
|---
{:.table}

#### `has_and_belongs_to_many`

To model *one author has many books and one books belongs to many authors*:

```
class Author < ApplicationRecord
  has_and_belongs_to_many :books
end

class Book < ApplicationRecord
  has_and_belongs_to_many :authors
end
```

The corresponding migration method looks like this:

```
create_table :authors do |t|
  t.string :name
end

create_table :books do |t|
  t.string :title
end

create_table :authors_books, id: false do |t|
  t.belongs_to :author, index: true
  t.belongs_to :book, index: true
end
```

This will give us the database tables:

*Authors*

|---
| Type | Column
|-|-
| integer | id
| string | name
|---
{:.table}

*Books*

|---
| Type | Column
|-|-
| integer | id
| string | title
|---
{:.table}

*AuthorsBooks*

|---
| Type | Column
|-|-
| integer | author_id
| integer | book_id
|---
{:.table}

There are a lot more discussions on associations in Rails, which will not be covered in this simple learning project. For details, you can read the [docs](http://guides.rubyonrails.org/association_basics.html).

[Back to top](#table-of-content)

## Query Interfaces

The advantage of Active Record is in its extensive set of query interfaces, which saves developers a lot of time in writing repetitive SQL queries for common operations. Here are some of the most commonly used query interfaces, for more, you can read the [docs](http://guides.rubyonrails.org/active_record_querying.html).

[Back to top](#table-of-content)

### Single Table

|---
| Method | Example
|-|-
| `find(id)` or `find(ids)` | `user = User.find(10)` returns `user` with `id` = 10, `users = User.find([1,2,3])` returns `users` collection with `id` = 1,2,3
| `first` or `first(count)` | `user = User.first` returns the first `user` ordered by primary key, `users = User.first(5)` returns `users` collection with first 5 users ordered by primary key
| `last` or `last(count)` | `user = User.last` returns the last `user` ordered by primary key, `users = User.last(5)` returns `users` collection with last 5 users ordered by primary key
| `find_by(hash)` | `user = User.find_by(first_name: 'John')` returns `user` with `first_name` = 'John'
| `where(conditions, values)` | `users = User.where("active = ? AND locked = ?", true, false)` returns `users` collection with `active` = `true` and `locked` = `false`
| `where(conditions, hash)` | `users = User.where("active = :active AND locked = :locked", {active: true, locked: false})` returns `users` collection with `active` = `true` and `locked` = `false`
| `where(hash)` | `users = User.where(active: true)` returns `users` collection with `active` = `true`, `users = User.where(first_name: ['Doe','Smith'])` returns `users` collection with `first_name` = 'Doe' or 'Smith'
| `where.not` | `users = User.where.not(locked: true)` returns `users` collection with `locked` != `true`
| `order(symbol)` or `order(field: :asc)` or `order(field: :desc)` | `users = User.order(:first_name)` returns `users` collection ordered by `first_name` in ascending order, `users = User.order(first_name: :desc)` returns `users` collection ordered by `first_name` in descending order
| `select(symbols)` or `select(fields)` or `select(fields).distinct` | `users = User.select(:first_name, :last_name)` returns `users` collection with only `first_name` and `last_name` attributes initialized, `users = User.select("first_name, last_name")` returns `users` collection with only `first_name` and `last_name` attributes initialized, `users = User.select(:first_name, :last_name).distinct` returns `users` collection with only one instance of each unique `first_name` and `last_name`
| `limit(count).offset(count)` | `users = User.limit(5).offset(10)` returns `users` collection from 11th to 16th (count 5)
| `group(fields)` or `group(symbols)` | `users = User.select("date(created_at) as signup_date, count(id) as total_count").group("date(created_at)")` returns `users` collection with one instance of `user` for each `created_at` value and `signup_date` and `total_count` fields are accessible, `users = User.select("first_name, count(id) as total_count").group(:first_name)` returns `users` collection with one instance of `user` for each `first_name` value and `total_count` field is accessible
| `group(fields).count` | `counts = User.group(:first_name).count` returns a hash with each unique `first_name` as key and the total count as value
| `group(fields).having(condition, value)` | `users = User.select("first_name, count(id) as total_count").group(:first_name).having("count(id) > ?", 1)` returns `users` collection with one instance of `user` for each `first_name` value where the total count is more than 1 and `total_count` field is accessible
|---
{:.table}

[Back to top](#table-of-content)

### Join Table

|---
| Method | Example
|-|-
| `joins(symbols)` | `publishers = Publisher.joins(:books, :authors)` returns `publishers` collection with each `publisher` instance containing at least 1 associated `book` and `author`
| `joins(hash)` | `publishers = Publisher.joins(authors: :books)` returns `publishers` collection with each `publisher` instance containing at least 1 associated `author` who is associated with at least 1 `book`
| `joins(symbols).where(hash)` | `publishers = Publisher.joins(:authors).where(authors: { last_name: 'Smith' })` returns `publishers` collection with each `publisher` instance containing only `authors` whose `last_name` = 'Smith'
| `left_outer_joins(symbols)` | `publishers = Publisher.left_outer_joins(:authors)` returns `publishers` collection regardless of whether each has an associated `author`
|---
{:.table}

[Back to top](#table-of-content)

### Arithmetics

|---
| Method | Example
|-|-
| `count` | `users = User.count` returns the number of `users`
| `average(field)` | `avg_age = User.average("age")` returns the average age of all `users`
| `minimum(field)` | `min_age = User.minimum("age")` returns the minimum age of all `users`
| `maximum(field)` | `max_age = User.maximum("age")` returns the maximum age of all `users`
| `sum(field)` | `total_age = User.sum("age")` returns the sum of age of all `users`
|---
{:.table}

There are some discussions on scoping and eager loading which are beyond the scope of this learning project, to find out more, please read the [docs](http://guides.rubyonrails.org/active_record_querying.html).

[Back to top](#table-of-content)
