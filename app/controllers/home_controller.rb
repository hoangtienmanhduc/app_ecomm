class HomeController < ApplicationController
  def index
    @main_categories = Category.take(8)
  end
end
