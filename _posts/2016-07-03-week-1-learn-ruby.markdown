---
layout: post
title:  "Week 1: Learn Ruby"
date: 2016-07-03 23:24:42 +0800
tags: [ruby, rails, tutorial]
description: This post is a summary of what I have learnt in the first week of the six-week Ruby on Rails learning project.
---

This is the first part of the six-week Ruby on Rails learning project.

1. [Week 1: Learn Ruby]({{site.url}}/2016/06/week-1-learn-ruby/)
2. Week 2: Learn Rails (Part 1)
3. Week 3: Learn Rails (Part 2)
4. Week 4: Learn Rails (Part 3)
5. Week 5: Practice Rails (Part 1)
6. Week 6: Practice Rails (Part 2)

<!-- more -->

# Table of Content

* [History and Introduction](#history-and-introduction)
* [OO in Ruby](#oo-in-ruby)
* [Basic Constructs](#basic-constructs)
* [Coding Style](#coding-style)
* [Collections and String APIs](#collections-and-string-apis)

# History and Introduction

Ruby is an interpreted scripting language created by Yukihiro "Matz" Matsumoto in 1995. It was inspired by a mix of languages then: Perl, Smalltalk, Eiffel, Ada and Lisp. The language has features of functional, imperative and object-oriented languages.

Ruby is a flexible language when it comes to extending or altering the core functionality of the language. It is possible to redefine the core parts of the language, by redefining methods of builtin classes. Besides, developers can also add new methods to a builtin class as easily. Operators are actually syntatic sugars for methods, so they can also be redefined (with the exception of these operators: `=, .., ..., not, &&, and, ||, or, ::` as described in [Ruby from other languages](https://www.ruby-lang.org/en/documentation/ruby-from-other-languages/)).

## Using a Ruby Program

A Ruby program can be used in various ways.

Let's say we have a Ruby script `hello_world.rb` written as such:

```
puts "Hello"

def say_hi
  puts "Hi"
end

def return_hi
  hi = "Hi value"
end

puts return_hi
```

### Using Ruby Interpreter

It can be executed directly via the Ruby interpreter. In the command prompt, simply call `ruby hello_world.rb`. The script will be interpreted line-by-line and any `puts` or `print` calls will output the results to the terminal.

```
> ruby test.rb
Hello
Hi value
```

Notice how `Hi` is not being output. This is because `puts "Hi"` is wrapped inside the `say_hi` method, but there is no caller to invoke this method, so the code inside is not being executed, and so the word `Hi` is not being output.

On the other hand, `Hi value` is being output, because the method `return_hi` that contains the variable is being invoked at the end of the program by calling `puts return_hi`.

### As Executable Script

It can also be executed like an executable. At the start of the Ruby program, define the shebang as such `#!/usr/bin/env ruby`. Then in the command prompt, call `./hello_world.rb`. The output will be like how it is executed by the `ruby` command.

```
> ./test.rb
Hello
Hi value
```

### Loaded in IRB

IRB (which is short for Interactive Ruby) is an interactive Ruby shell. In the command prompt, type `irb` to fire up the IRB.

In the IRB shell, the `hello_world.rb` program can be loaded as such:

```
2.3.0 :001 > load "./test.rb"
Hello
Hi value
 => true
```

*Note: The shell prompt may be different depending on the version of Ruby you use. In this case, the RVM's ruby-2.3.0 is used, so the prompt is displayed as `2.3.0 :001`.*

`=> true` is the result of the executing the script. If you had typed an expression `2 + 5` in IRB, it would have returned something like this:

```
2.3.0 :001 > 2 + 5
 => 7
```

where `=> 7` is simply the result of executing `2 + 5`.

The advantage of using IRB to load the script instead of simply calling the `ruby` command is that you can access the variables and methods in the script after loading it.

Recall that when the script was interpreted, the `Hi` string was not output because it was wrapped inside the `say_hi` method. Without invoking the method, the code inside will not be executed. Using the `ruby` command to run the script does not allow us to make use of the variables and methods in the script, because once the script is run, the interpreter exits.

However, by loading the script inside the IRB, the variables and methods are still in "session", and as long as we have not exited the IRB shell, we can reference the variables and methods in the scripts that are loaded.

Now, still inside the same IRB session where the script was loaded, we can invoke `say_hi` method and the `Hi` string will be output.

```
2.3.0 :002 > say_hi
Hi
 => nil
```

This comes in handy if we want to "interact" with the Ruby program instead of merely executing it to see the output.

There are many other ways to load a Ruby script, which is beyond the scope of this learning project. If you are interested to find out more, please read [this](https://www.practicingruby.com/articles/ways-to-load-code) article.

[Back to top](#table-of-content)

# OO in Ruby

## Everything an Object

Everything in Ruby is an object, meaning, everything can have its own properties and actions, which are referred to as *instance variables* and *methods* respectively. This even includes those considered as primitive types in other languages, such as numbers. In Ruby, a floating point number is an instance of the `Float` class, and it exposes methods such as `nan?` which checks whether the given floating point number is invalid, so you can code something like `(0.0/0.0).nan?`, which gives you `true`. This is different from other languages, say Java, where you have to do something like this:

```
Float a = 0.0f/0.0f;
System.out.println(a.isNaN());
```

If you try doing something like this `(0.0f/0.0f).isNaN()`, you will get `error: float cannot be dereferenced` at compilation.

## Mixin

Ruby only allows single inheritance, but a class can receive various sets of methods through *mixin* modules. A module is a collection of methods, and any class that includes the module will be able to call those methods as its own.

For example, we can define a sort of `SuperMath` class that includes the `Math` module to receive all the `Math` methods.

```
class SuperMath
  include Math

  def always_sqrt_times_three(val)
      sqrt(val) * 3
    end
end

super_math = SuperMath.new
puts super_math.always_sqrt_times_three(4)
```

Executing the above script will result in the following:

```
> ruby test.rb
6.0
```

What happens in the `SuperMath`'s `always_sqrt_times_three` method is that it invokes `sqrt` method as if it is its own method, without having to write `Math.sqrt`.

If you are writing your custom modules which will be included in your classes, be careful with method names collision. To illustrate, let's look at the following script:

```
module Printer
  def print_hi(name)
    puts "Hi #{name}"
  end
end

module HyperPrinter
  def print_hi(name)
    puts "Hi #{name}!!!"
  end
end

class MyPrinter
  include Printer
  include HyperPrinter

  def print_hi_and_bye(name)
    print_hi(name)
    puts "Bye #{name}"
  end
end

my_printer = MyPrinter.new
my_printer.print_hi_and_bye("world")
```

When we execute the script, we will get an output like this:

```
Hi world!!!
Bye world
```

Let's look at another version of the script:

```
class MyPrinter
  include HyperPrinter
  include Printer

  def print_hi_and_bye(name)
    print_hi(name)
    puts "Bye #{name}"
  end
end
```

Now the output will be like this:

```
Hi world
Bye world
```

Let's try to analyze what has happened. Due to both modules having the same method name, when we include both in the `MyPrinter` class, and call the `print_hi` method, the last `include` module's `print_hi` method "wins" and gets executed.

Actually, there are more rules to method lookup beyond the example above. If you are interested in more advanced and detailed explanation, you can refer to [this](https://www.practicingruby.com/articles/method-lookup-1) and [this](https://www.practicingruby.com/articles/method-lookup-2) articles which are not within the scope of this simple learning project.

[Back to top](#table-of-content)

# Basic Constructs

If you have some knowledge of other programming languages, you will be quite familiar with constructs such as `if/else/end` and `while/end`. I will not go into details for this. In this learning project, I will explore certain interesting constructs that are quite unique to Ruby.

## Universal Truth

In Ruby, everything is `true`, except `false` and `nil`.

So, if you are trying to do this:

```
if 0
  puts "this is true"
else
  puts "this is false"
end
```

you will end up seeing `this is true` even though you might have expected the result to be `this is false`.

## Unless

`unless/else/end` construct behaves in the opposite way of `if/else/end` construct. Traditionally, if you have a `if` statement and the condition is fulfilled, the code inside the `if` scope will be executed. On the other hand, if you have a `unless` statement and the condition is fulfulled, the code inside the `unless` scope will *not* be executed.

To illustrate, let's look at the following code blocks:

```
a = [0,1,2,3,4]
if a.length > 1
  puts "a has more than 1 element"
else
  puts "a has less than 1 element"
end
```

will give the result `a has more than 1 element`.

```
a = [0,1,2,3,4]
unless a.length > 1
  puts "a has more than 1 element"
else
  puts "a has less than 1 element"
end
```

will give the result `a has less than 1 element`

In this case, we see that when the `unless` condition is fulfilled, the code inside is not executed, instead the `else` code is executed.

## Method

Methods are just a wrapper for reusable series of steps that perform certain logic and may or may not return a result. It can describe the behaviour of an object, or it can be just a logical wrapper of operations.

Methods are defined with the following syntax:

```
def method(param1, param2, ..., named_param1 = default1, named_param2 = default2, ...)
  # body
    # declare the return result at the last line of the body
end
```

Interestingly, if your method does not have parameters, you can omit the parentheses when defining the method, like this:

```
def method_without_parameters
  # body
end
```

## Block

Being inspired by functional languages such as Lisp, Ruby provides a feature called a **Block**, which is a closure attached to any method. This provides great flexibility for coders to define the details of what a method should do by filling in the block.

An example taken from the [Ruby About Page](https://www.ruby-lang.org/en/about/) to demonstrate the use of a block:

```
search_engines =
  %w[Google Yahoo MSN].map do |engine|
    "http://www." + engine.downcase + ".com"
  end
```

The code between `do` and `end` is the block. The *thing* inside the pipe characters is the block parameter. Depending on the implementation of the method that takes in the block, the block parameter is *yielded* by the method in different ways.

Let's look at an example I read from [here](http://mixandgo.com/blog/mastering-ruby-blocks-in-less-than-5-minutes).

```
def my_map(array)
  new_array = []

  for element in array
    new_array.push yield element
  end

  new_array
end

my_map([1, 2, 3]) do |number|
  number * 2
end
```

What happens here is that, we define a method `my_map` that takes in an `array`. Inside the method, we will iterate through the array, for each `element` call `yield element`, and push the result of `yield element` to the `new_array`. At the end of the method, the `new_array` is returned. Then, we invoke the `my_map` method with an array `[1,2,3]`. The `number` block parameter is actually from `yield element`. We see that each time the array is iterated, the `element` is `yield`ed. This is passed to the block parameter `number`, which we can use to do something with, like `number * 2`. The result of this, for example `1 * 2` becomes the input for parameter for the `push` method. At the end of it, we will get `[2,4,6]` as the result.

You don't always have to have a block parameter for the method taking in a block. For example, you can do something like this, although it's not very meaningful:

```
def say_hello
  puts "Hello"
  yield
  puts "!"
end
```

Then we can provide a block to the method like this:

```
say_hello { puts "Bob" }
```

which will output the result as:

```
Hello
Bob
!
```

In short, what `yield` does is to execute the given block of code. If `yield` has parameters, they become the block parameters, which the block can make use of to do some computation. The method can take the result of the computation and do something inside, like adding to an array.

What's the use of blocks? I have no idea at this moment. Perhaps when I encounter an use case in the future, I will update this section of the tutorial.

## Class and Object

As mentioned, Ruby is an object-oriented language as well. A class is a blueprint for a type of object with certain properties and actions. Every instance of the class will have the properties and actions defined in its class.

To define a class, it's as simple as this:

```
class ClassName
  attr_accessor :variable1, :variable2, ...
    
  def initialize(param1, param2, ..., named_param1 = default1, named_param2 = default2, ...)
    end
    
    # public methods
    
    protected
    # protected methods
    
    private
    # private methods
end
```

`attr_accessor` is a keyword for defining the getters and setters of the class's instance variables. Without this definition, the instance variables cannot be retrieved or set from outside the methods of the class.

`initialize(...)` is the constructor of the class, which is invoked at the point an object of the class is instantiated. If arguments are passed into the constructor, these are arguments can be used to initialize the instance variables of the class, or to perform any initialization logic.

To create an instance of the class, use the `new` method:

```
object = ClassName.new
```

if the `initialize` method does not have parameters;

```
object = ClassName.new(arg1, arg2, ..., named_arg1 = val1, named_arg2 = val2, ...)
```

if the `initialize` method has parameters.

## Symbol

Symbol is a very peculiar feature of Ruby, at least I find it so coming from a background of Java. According to the Ruby [docs](https://www.ruby-lang.org/en/documentation/ruby-from-other-languages/), symbols are used when the identity of an object is more important than its content, for example, hash keys are constant and do not change, so instead of using strings for hash keys, symbols will be a better choice.

To declare a symbol, simply prefix the string with `:`, like this `:id`. One and only one instance of the `:id` symbol will be created in memory, and it cannot be changed subsequently.

Why not use a constant variables? Like you just declare a constant `ID = "id"`, and to use it as hash key, do this `h = {ID => 1}`. It will create a hash which looks like this `{"id" => 1}`, then you can access the hash using the key like this `h[ID]`. However, this requires you to always declare the constant at the beginning, in order to use it in subsequent sections of the code.

Using symbol, you just declare as and when required. Using the same example above, without declaring at the beginning of the program, you can just do this `h = {:id => 1}`. It will create a hash which looks like this `{:id => 1}`, then you access the hash using the same symbol like this `h[:id]`.

An advantage of using symbols over constants when it comes to things like hash keys is that it saves memory. To illustrate, let's consider these 2 blocks of codes:

```
a = [{:id=>1,:name=>"hello"},{:id=>2,:name=>"world"}]
```

and

```
ID = "id"
NAME = "name"
b = [{ID=>1,NAME=>"hello"},{ID=>2,NAME=>"world"}]
```

The 2 blocks of codes do exactly the same thing: define an array of hashes.

When we look into the `object_id` of the `:id` key of array `a`, we get that both hash keys in the array have the same `object_id`, meaning, they are actually the exact same instance in the memory.

```
irb(main):089:0> a[0].keys[0].object_id
=> 494248
irb(main):090:0> a[1].keys[0].object_id
=> 494248
```

However, for the other array `b`, we get different `object_id` for the hash keys in the array.

```
irb(main):095:0> b[0].keys[0].object_id
=> 70234271707420
irb(main):096:0> b[1].keys[0].object_id
=> 70234271707300
```

This means that every hash key referenced is a new instance in the memory.

As more hash objects are added to the array, more instances of the hash key will be created in memory. This is unnecessary, because what we are concerned with the hash key is its identity, that is, `name` is to represent the name of the hash. We don't really care whether it is spelled out as `n` or `name`, that is, the content is not important. Instead of occupying the memory with many instances of the string whose content we don't care, a better choice is to use symbols.

Symbols of the same sequence of characters represent exactly the same instance in memory. As we reference the hash key by adding more hashes to the array, we are still referencing the exact same hash key instance. This serves our purpose of giving the hash key an identity, yet without the overhead of multiple instances of the string in memory.

Of course, I think my explanation of what symbol really does is very simplistic and flawed, that is because at this point my knowledge of Ruby is still very limited. If you really crave a better explanation, it is best that you read up more on the topic [here](http://www.troubleshooters.com/codecorn/ruby/symbols.htm) or [here](http://rubylearning.com/satishtalim/ruby_symbols.html) or [here](http://rubylearning.com/blog/2007/11/26/akitaonrails-on-ruby-symbols/).

[Back to top](#table-of-content)

# Coding Style

Every language has its own conventions and styles. Here are some of the basic conventions and styles that are the preferred ways of coding Ruby.

## Two-space indentation

Use 2-space indentation with soft-tabs.

## Characters limit

The character limit in Ruby is 80.

## Parentheses

In Ruby, it is common to define and invoke methods without parameters without the parentheses. For example, if we have a method without parameters, we define it as such:

```
class Greeter
  def hello
    puts "Hello"
  end
end
```

then, we call the method like this `greeter.hello` instead of `greeter.hello()`.

## ? and ! in methods

In Ruby, the characters `?` and `!` are allowed in method names. However, they should be used only for specific cases to provide meaning and improve readability. `?` is by convention appended to the end of a method's name to signal a method that answers a question. For example, the `empty?` method in `Array` class answers the question of `is the array empty?`. `!` is by convention appended to the end of a method's name to signal a method that will potentially perform "dangerous" operation, such as modifying the object's `self` or its arguments. For example, the `sort!` method in `Array` class modifies the `self` by sorting the elements in-place instead of returning a new instance of the sorted array.

## Variable names

### Normal variable

Declare a normal variable like this `var`.

### Instance variable

Declare an instance variable like this `@instance_var`, with `@` as the prefix.

### Global variable

Declare a global variable like this `$global_var`, with `$` as the prefix.

### Class variable

Declare a class variable like this `@@class_var`, with `@@` as the prefix.

## Casing

### Filenames, Variables, Symbols, Methods

Use `snake_case` for filenames, variables, symbols and methods.

For example:

```
this_var = "hello world"

my_hash = {:my_name => "hello"}

def this_method
  puts "does nothing"
end
```

and name a file `this_program.rb`.

### Classes, Modules

Use `CamelCase` for classes and modules

For example:

```
module MyModule
end

class MyClass
end
```

Except that if the name contains acronyms, the acronyms should be uppercase.

For example:

```
class MyXMLReader
end
```

### Constants

Use `SCREAMING_SNAKE_CASE` for constants.

For example:

```
THIS_IS_A_CONSTANT = "hello"
```

There are a lot more styles and conventions to Ruby programming. For more details, please read the [style guide](https://github.com/bbatsov/ruby-style-guide).

[Back to top](#table-of-content)

# Collections and String APIs

One of the things I found useful when learning Ruby was reading the String APIs docs. Since string manipulation is so ubiquitous in programming, it helps to learn some of the most commonly used operations of the String library. On top of that, collections manipulation is equally common, so it is good to study the Array library as well.

Here, I list down some of the operations *I* commonly use in string and collections manipulation with their equivalent forms in Ruby. I hope to be able to use them as naturally as me typing `"".equals("")` in Java (okay, this is a bad example, but I hope you get the point).

*Note: If the method ends with `!`, it means the object itself is modified instead of a new object being returned.*

## String

### APIs

|---
| Purpose | Method
|-|-
| Convert to lower case | `"STRING".downcase` or `"STRING".downcase!`
| Convert to upper case | `"string".upcase` or `"string".upcase!`
| Split a string by newline character | `"hello\nworld".each_line` returns `#<Enumerator: "hello\nworld":each_line>` or `"hello\nworld".lines` returns `["hello\n", "world"]`
| Split a string by whitespaces without returning the separator | `"hello world".split` returns `["hello", "world"]`
| Split a string by a separator | `"hello-world-there".each_line("-")` returns `#<Enumerator: "hello-world-there":each_line("-")>` or `"hello-world-there".lines("-")` returns `["hello-", "world-", "there"]`
| Split a string by a separator without returning the separator | `"hello-world-there".split` returns `["hello", "world", "there"]`
| Check if string length is 0 | `"".empty?` returns `true`
| Check if string starts with another string | `"hello".start_with?("he")` returns `true`
| Check if string ends with another string | `"helloworld".end_with?("ld")` returns `true`
| Check if two strings are equal | `"hello".eql?("hello")` returns `true`
| Check if string contains another string | `"helloworld".include?("ll")` returns `true`
| Check length of string | `"hello".length` or `"hello".size` returns `5`
| Strip leading and trailing whitespaces | `"    hello    ".strip` or `"    hello    ".strip!`
| Strip leading whitespaces | `"    hello".lstrip` or `"    hello".lstrip!`
| Strip trailing whitespaces | `"hello   ".rstrip` or `"hello   ".rstrip!`
| Convert to integer | `"123".to_i` returns `123`
|---
{:.table}

## Array

### Creating an array

There are a few ways to instantiate an array.

#### Literal Constructor

You can create an array simply using the `[]` constructor like this:

```
arr = [1,2,3,4,5,6]
```

#### Using `new` Method

```
arr = Array.new
```

will return an empty array `[]`.

```
arr = Array.new(3)
```

will return an array of size 3 with `nil` values `[nil, nil, nil]`.

```
arr = Array.new(3, 0)
```

will return an array of size 3 with default values `0` like this `[0, 0, 0]`.

Note that the same instance of the object is used as values for the array if you supply a default value when instantiating the new array. Therefore, it is best to do this only for immutable objects such as numbers and boolean values.

One pretty common use case for array is to generate a matrix, which can be easily achieved like this:

```
matrix = Array.new(3) { Array.new(3, 0) }
```

What this does is it will first create an array of size 3, and for each slot in the array, create a nested array of size 3 with default values `0`. This will result in a matrix like this:

```
[[0, 0, 0], [0, 0, 0], [0, 0, 0]]
```

### Accessing array

Accessing elements in an array is simple and can be done without calling methods. Arrays in Ruby are zero-indexed. Let's say we have an array like this: `a = [0,1,2,3,4,5,6,7,8]`.

#### Single element access

You can get an element at index `3` by calling `a[3]`, which will return the value `3`.

If you provide an index beyond the size of the above array, say `10`, it will simply return `nil` instead of `IndexOutOfBoundError` in some other languages like Java.

You can also provide a negative index, like `a[-2]`, which simply returns the second element counting from the end of the array, that is `7` in this case.

#### Range access

You can retrieve a range of elements from the array by providing the first index and the size you want, like `a[3, 2]`, meaning you want to get the elements from index `3` up to `2` elements, which will return `[3,4]`. If the size from the starting index goes beyond the actual size of the array, then you will just get whatever that is available since the starting index. Say you do `a[8, 3]`, it will simply return you `[8]`.

You can also specify the range exactly to get the elements within the range, like `a[3..6]`, which means getting the elements from index `3` to index `6`, will return the elements `[3,4,5,6]`. Similarly, if you specify an ending index that is beyond the size of the array, you will simply get whatever that is available since the starting index. Say you do `a[6..10]`, it will simply return you `[6,7,8]`.

Or, if you like to get elements from a starting index relative to the start of the array, and ending index relative to the end of the array, you can specify a negative index in the range. For example, you can get the third element through the last third element of the array like this `a[3..-3]`, then you will get `[3,4,5,6]`, where index `-3` is third from the end of the array, which gives `6`.

### APIs

|---
| Purpose | Method
|-|-
| Remove elements of value | `[0,1,2,3,4].delete(3)` returns the elements removed and modifies the array
| Remove an element at index | `[0,1,2,3,4].delete_at(2)` returns the element removed at index 2 and modifies the array
| Iterate the array and access value | `[0,1,2,3,4,5,6].each { |v| do_something_to_value(v) }`
| Iterate the array and access index | `["a","b","c","d","e"].each { |i| do_something_to_index(i) }`
| Check if array is empty | `[].empty?` returns `true`
| Get index of element | `["a","b","c","d","e"].index("b")` or `["a","b","c","d","e"].find_index("b")` returns index `1`
| Check if array contains element | `[0,1,2,3,4].include?(3)` returns `true`
| Insert element at index | `[0,1,2,3,4].insert(3,5)` returns `[0,1,2,5,3,4]`
| Concatenate all elements by a separator | `["a","b","c","d","e"].join(",")` returns `"a,b,c,d,e"`
| Check the length of array | `[0,1,2,3,4].length` or `[0,1,2,3,4].size` returns `5`
| Remove last element | `[0,1,2,3,4].pop` returns `4`
| Remove n last elements | `[0,1,2,3,4].pop(2)` returns `[3,4]`
| Append element | `[0,1,2,3,4].push(5)` returns `[0,1,2,3,4,5]`
| Sort array | `[1,6,3,2,8,4,5,7].sort` or `[1,6,3,2,8,4,5,7].sort!`
|---
{:.table}

[Back to top](#table-of-content)

