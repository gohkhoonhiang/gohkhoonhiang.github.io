---
layout: post
title:  "Week 6: Practice Rails (Part 2)"
date: 2016-11-20 16:34:14 +0800
tags: [ruby, rails, tutorial, project]
description: This post is the second part of my process of applying what I have learnt in the past few weeks of the six-week Ruby on Rails learning project.
---

This is the final part of the six-week Ruby on Rails learning project.

1. [Week 1: Learn Ruby]({{site.url}}/2016/06/week-1-learn-ruby/)
2. [Week 2: Learn Rails (Part 1)]({{site.url}}/2016/07/week-2-learn-rails-part-1/)
3. [Week 3: Learn Rails (Part 2)]({{site.url}}/2016/07/week-3-learn-rails-part-2/)
4. [Week 4: Learn Rails (Part 3)]({{site.url}}/2016/07/week-4-learn-rails-part-3/)
5. [Week 5: Practice Rails (Part 1)]({{site.url}}/2016/07/week-5-practice-rails-part-1/)
6. [Week 6: Practice Rails (Part 2)]({{site.url}}/2016/08/week-6-practice-rails-part-2/)

<!-- more -->

*This is a throwback post that I started writing back in August but did not manage to complete. Today, I finally found the time to complete this post and publish it officially. The content may have been outdated by now, but I tried to stick to what I intended to write back then, so as to present its most original form.*

# Table of Content

* [Authentication](#authentication)
* [Posting Item](#posting-item)
* [Search and Listing](#search-and-listing)
* [View Item](#view-item)
* [Validations](#validations)
* [Post Mortem](#post-mortem)

In this final post of the learning project, I will discuss some of the implementation details, and hopefully conclude with a meaningful post mortem of what I have learnt from this project.

# Authentication 

I have designed the web app such that only registered users may post new items, review items, comment on reviews, like and dislike reviews/comments. To implement the access control, I used Rails's filters in `ApplicationController` to check for logged in user before allowing access to certain actions.

```
class ApplicationController < ActionController::Base
  before_filter :require_login

  def current_user
    @current_user ||= User.find_by(username: session[:username])
  end

  def require_login
    unless current_user
      flash[:login] = "Please login first"
      redirect_to root_url
    end
  end
end
```

All other controllers will extend from `ApplicationController`, so before every action (unless otherwise excluded) is executed, `require_login` method will be invoked and check if `current_user` is available. If user is not logged in, then he will be redirected back to the home page and a flash message will be displayed.

However, there are certain actions that we should not limit access to for obvious reasons, for example, login and signup. We also want to allow annonymous users to search and view listings without registering. To exclude these actions from the filter, we can add the `skip_before_action` method in the controller classes like this:

```
class UsersController < ApplicationController
  skip_before_action :require_login, :only => [:new, :create]
end

class SessionsController < ApplicationController
  skip_before_action :require_login, :only => [:new, :create]
end

class ItemsController < ApplicationController
  skip_before_action :require_login, :only => [:index, :search, :show, :query]
end
```

If there are requests to the above actions, the `skip_before_action` method will skip the `require_login` filter, and anonymous users can continue to sign up, log in or search for reviews.

[Back to top](#table-of-content)

# Posting Item 

Posting items is quite a straightforward function, except that there is a problematic part of the code that I have to handle, that is saving the stakeholders of the item. To make the `Item` model as flexible as possible, I decided to not make each item specific to a certain product type, eg. book. `Stakeholder` model is used to associate each item with its relevant stakeholder. For example, a book is associated to its authors; a movie is associated to its actors. When the user adds a new item, he can add a list of relevant stakeholders. Instead of doing a `Add to list` kind of UX, I decided to just provide a simple text field, and the user just has to enter the stakeholders separated by commas. Because of this, I have to specially handle the saving of `Stakeholder` objects when the user submits the form. This is done in the code of `ItemController` as follows:

```
def create
  Item.transaction do
    @item = current_user.items.new
    if @item.update(item_params)
      stakeholders = item_params[:stakeholder].split(",")
      stakeholders.each do |s|
        @stakeholder = @item.stakeholders.new
        @stakeholder.name = s
        if !@stakeholder.save
          flash.now[:alert] = "Create stakeholder failed"
          render :new
          return
        end
      end
      flash[:notice] = "Item created"
      redirect_to user_items_url
    else
      flash.now[:alert] = "Create item failed"
      render :new
    end
  end
end
```

I would like to think that this is definitely not the best way to approach this problem. I hope more proficient readers out there can suggest better ways of solving this.

[Back to top](#table-of-content)

# Search and Listing 

As mentioned in the previous section, I have implemented the `Stakeholder` model so that each item can be associated to its relevant stakeholders, like authors or actors for books and movies respectively. Then I also thought that it would be quite useful if the user can search for an item through its stakeholders, so I implemented a special query function to allow the users to do so. In the `ItemsController`'s `query` function, I take in a `q` parameter, which is the search keyword from the search form field. Using this keyword, I will query both `Item` and `Stakeholder` models, using wildcards to match the `Item`'s `name` or `description`, or `Stakeholder`'s `name`. This will allow the users to search by the item's name or description and by the item's stakeholders' names.

```
def query
  keyword = params[:q]
  @items = Item.joins(:stakeholders)
               .where('lower(items.name) like lower(?) ' \
                      'or lower(items.description) like lower(?) ' \
                      'or lower(stakeholders.name) like lower(?)',
                      '%'+keyword+'%', '%'+keyword+'%', '%'+keyword+'%')
               .distinct.page(params[:page]).per(5)
  session[:back_url] = request.referer
  session[:prev_search] = params[:q]
  render :index
end
```

[Back to top](#table-of-content)

# View Item

For viewing an item, I implemented something fun, which is to display the reviews and comments below the item description, at the same time provide a form for the user to submit a review or a comment directly. On top of that, users can like or dislike each review or comment. It is implemented similar to many popular web apps out there which has a commenting with rating system. However, it was not an easy task for me to incorporate 3 forms into a single view.

In the `../item/show.html.erb` view, I first implement the item details section as follows. This is a straightforward row and column layout that will display the item image and description.

```
<div class="row">
  <div class="col-md-3">
    <a href="#" class="thumbnail">
      <%= image_tag @item.image.url.nil? ? (@item.category == "book" ?
                                            "book_256_256.png" :
                                            (@item.category == "music" ?
                                             "music_256_256.png" :
                                             "movie_256_256.png")) :
                                           @item.image.url,
                    title: @item.name, size: "128x128", class: "media-object" %>
    </a>
  </div>
  <div class="col-md-8">
    <p class="lead">
      <strong><%= @item.name %></strong><br>
      <% if @item.stakeholders != nil %>
        <em><small><%= @item.stakeholders.map{|s| s.name}.join(",") %></small></em>
      <% end %>
    </p>
    <p class="justify"><%= @item.description %></p>
  </div>
</div>
<div class="row">
  <div class="col-md-12">
    <p class="pull-right">
      <% if logged_in? && @item.user.id == current_user.id %>
      <%= link_to "Edit", edit_item_path(@item), class: "btn btn-primary" %>
      <% end %>
      <%= link_to "Back", back_url, class: "btn btn-default" %>
    </p>
  </div>
</div>
```

The complication comes when I had to implement the view for reviews and comments below the item details section. These two sections each will have the `like` and `dislike` buttons, which have to send separate requests to the Rails server to increment the `like` and `dislike` count of the corresponding review or comment.

As you can see from the segment of code below, this thing is quite a mess. For each item, I have to iterate the reviews and display them, together with the `like` and `dislike` buttons for each review. For each review, I also have to iterate the comments and display the `like` and `dislike` buttons for each comment. At the end of each review, I have to create a form that will submit a new comment for the review. And at the end of all reviews, I have to create another form that will submit a new review for the item.

```
<div class="row">
  <div class="col-md-8 col-md-offset-2">
    <h3>Reviews</h3>
    <% if @item.reviews != nil && !@item.reviews.empty? %>
      <% reviews = @item.reviews.sort { |a,b| ((b.like-b.dislike) <=> (a.like-a.dislike)) } %>
      <% reviews.each do |review| %>
      <div class="media<%= (review.like - review.dislike) < 0 ? ' bad-review' : '' %>">
        <!-- review listing here -->
        <div class="btn-group" role="group">
          <%= link_to like_review_path(review), method: "post", class: "btn btn-sm" do %>
            <%= content_tag :span, " " + (review.like != nil ? review.like : 0).to_s, class: "glyphicon glyphicon-thumbs-up" %>
          <% end %>
          <%= link_to dislike_review_path(review), method: "post", class: "btn btn-sm" do %>
            <%= content_tag :span, " " + (review.dislike != nil ? review.dislike : 0).to_s, class: "glyphicon glyphicon-thumbs-down" %>
          <% end %>
        </div>
        <% if review.comments != nil && !review.comments.empty? %>
          <% comments = review.comments.sort { |a,b| ((b.like-b.dislike) <=> (a.like-a.dislike)) } %>
          <% comments.each do |comment| %>
          <div class="media">
            <!-- comment listing here -->
            <div class="media-body">
              <div class="btn-group" role="group">
                <%= link_to like_comment_path(comment), method: "post", class: "btn btn-sm" do %>
                  <%= content_tag :span, " " + (comment.like != nil ? comment.like : 0).to_s, class: "glyphicon glyphicon-thumbs-up" %>
                <% end %>
                <%= link_to dislike_comment_path(comment), method: "post", class: "btn btn-sm" do %>
                  <%= content_tag :span, " " + (comment.dislike != nil ? comment.dislike : 0).to_s, class: "glyphicon glyphicon-thumbs-down" %>
                <% end %>
              </div>
            </div>
          </div>
          <div class="media">
            <div class="media-body">
              <%= form_tag comments_path, method: :post do %>
              <!-- comment submit form fields here -->
              <% end %>
            </div>
          </div>
          <% end %>
        <% end %>
      </div>
      <% end %>
    <% else %>
      No reviews.
    <% end %>
    <div class="media">
      <div class="media-left">
        <a href="#">
          <%= image_tag current_user.avatar.url.nil? ? "avatar_200_200.png" : current_user.avatar.url, title: current_user.username, size: "64x64", class: "media-object" %>
        </a>
      </div>
      <div class="media-body">
        <%= form_tag reviews_path, method: :post do %>
        <!-- review submit form fields here -->
        <% end %>
      </div>
    </div>
  </div>
</div>
```

[Back to top](#table-of-content)

# Validations

The validations I have used in this project are quite straightforward, they are mainly to validate the presence of certain fields. There is one particular model which require custom validations, that is the `User`'s `email` and `password` fields. The app requires the user to enter the old password before he can change the email or password. This is an additional layer of security which ensures that only the rightful owner is changing the email or password. To implement this custom validation, I added this line of code in the `User` model:

```
class User < ApplicationRecord
  ...
  validate :email_update, :password_update, on: :update
  ...
end
```

Both `email_update` and `password_update` are activated upon `update` action. As illustrated in the segment of code below, the validator will first find the `user` object using the given `id`. If the `email` to be updated does not match the existing `email` of the `user` object, implying that the user wants to update his email, it will check if the `old_password` is provided. This `old_password` is supposed to be entered by the user when changing the email. It also has to match the correct `password` of the `user` object by passing the `authenticate` check.

```
def email_update
  if !email.nil? && !email.empty?
    old = User.find(id)
    if email != old.email
      if old_password.nil? || old_password.empty?
        errors.add(:old_password, "can't be blank")
      else
        if !old.authenticate(old_password)
          errors.add(:old_password, "doesn't match")
        end
      end
    end
  else
    errors.add(:email, "can't be blank")
  end
end
```

Similarly, the `user` object is also retrieved using the `id` field when the password is to be updated. First, the `old_password` that is provided by the user will be matched against the correct `password` of the `user` object. Then the validator also ensures that the `password_confirmation` matches the new `password` to be updated to.

```
def password_update
  if !password.nil? && !password.empty?
    old = User.find(id)
    if old_password.nil? || old_password.empty?
      errors.add(:old_password, "can't be blank")
    else
      if !old.authenticate(old_password)
        errors.add(:old_password, "doesn't match")
      else
        if password != password_confirmation
          errors.add(:password, "doesn't match Password confirmation")
          errors.add(:password_confirmation, "doesn't match Password")
        end
      end
    end
  end
end
```

I find such a use case quite common in systems that implement user update function, and I suspect there may already be gems out there that will deal with such cases automatically. However, I did not do a research on those as I wanted to try implementing a custom validator myself.

[Back to top](#table-of-content)

# Post Mortem

The rest of the app is pretty straightforward and I shall not spend more time to explain the implementations in details. However, I do have a few learning points that I would like to share out of this learning project.

## Render vs Redirect

After playing with `render` and `redirect_to` a few times, I finally get the difference between the two.

For `render`, Rails basically just pushes the HTML of the template that is used in the `render` function to the client, and it will be rendered on the user's browser. It is an HTML response to the client's request that is routed to the Rails controller's method.

On the other hand, for `redirect_to`, Rails actually returns a `302 Found` status code and the `Location` value in the response header to the client, so that the browser will redirect to the URL given in the `Location` header value, which is passed to the `redirect_to` method in the Rails controller.

[Back to top](#table-of-content)

## Flash vs Flash.now

Speaking of the differences of `render` and `redirect_to` methods, I must also mention the difference between `flash` and `flash.now`. If we are using `render` to return a direct HTML response, we should use `flash.now` if there are messages to be shown to the user. If we use `flash`, it will only be rendered in the subsequent response, which is usually in the case of `redirect_to`.

[Back to top](#table-of-content)

## Customization

Overall, I find that Rails is a good framework for implementing straightforward CRUD applications. However, if there are custom validations or view layouts required, I find it difficult to implement. For example, when I was implementing the item view, I had to build custom forms that post reviews and comments for an item. These are just plain forms with different form actions that submit via `post` request. I was not able to make use of Rails's form builder for these 2 models within the `item` show view, at least I was not able to figure out how to make them work together at the point I was doing this project. 6 weeks was a short time and I was not able to go into depths of how Rails works, so perhaps it is something that is possible, just that I was not aware of how to do it. 
