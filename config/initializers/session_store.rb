# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_autocomplete_session',
  :secret      => '08d905a20c374665af3cc2bb06954e8062fc6dd7412e7064abab431a816bfbbf498c2afe8008c449251362dab5fb61b4ce5659c3c4aa1c18418bbb575972af5a'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
