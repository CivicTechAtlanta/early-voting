#!/usr/bin/env ruby

require 'json'
require 'capybara/poltergeist'
require 'capybara/dsl'

Capybara.run_server = false
Capybara.current_driver = :poltergeist
Capybara.app_host = "http://sos.ga.gov/"

module GA
  class SOS
    include Capybara::DSL
 
    def early_voting_locations
      visit('/elections/CountyContacts/AdvanceVotingDisplay.aspx')

      county_selector.all('option').map{ |e| {name: e.text, value: e.value} }.each do |county| 
        select_county(county[:value])
        go_button.click

        county[:locations] = all('tbody span.standardfont').map{ |e| {text: e.native.value} }
      end
    end

    private

    def select_county(value)
      find("select#ctl00_ContentPlaceHolder2_ddlCounty option[value=\"#{value}\"]").select_option
    end

    def county_selector
      find('select#ctl00_ContentPlaceHolder2_ddlCounty')
    end

    def go_button
      find('input#ctl00_ContentPlaceHolder2_btnGoToCounty')
    end

  end
end

ga_sos = GA::SOS.new
puts JSON.generate(ga_sos.early_voting_locations)
