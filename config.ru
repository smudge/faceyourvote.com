require "rubygems"
require "bundler"
Bundler.require

set :root, File.dirname(__FILE__)
set :views, File.dirname(__FILE__) + "/views"
set :public, "public_folder"

require "./app.rb"
run Sinatra::Application
