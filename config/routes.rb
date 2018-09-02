Rails.application.routes.draw do
  get '/messages' => 'messages#index'
  post 'signup' => 'users#create'
  root to: 'pages#home'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
