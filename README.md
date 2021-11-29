# Table of Contents
    [Key Demo]
    [Project title]
    [Task description]
    [User Story]
    [Acceptance Criteria]
    [Reference]
    [Repository structure]

# Key Demo
The gif (Reference/result.gif) arise made to demostrate the following key features:

### Basic features demostration
    Search weather of a specific city
    Display of the following elements:
        - current weather condition
        - 5 day weather forcast
        - city name
        - date
        - weather icon
        - temperature
        - humidity
        - wind speed
        - UV Index
        - UV Index with colour code
    Adding the searched city into the history
    Click on the history and load the corresponding weather condition

# Project title
Weather Dashboard

# Task description
This is a timed coding quiz with multiple-choice questions.
This app will run in the browser and will feature dynamically updated HTML and CSS powered by JavaScript code that is written.
It will have a clean, polished, and responsive user interface.

# User Story
Use the [OpenWeather One Call API](https://openweathermap.org/api/one-call-api) to retrieve weather data for cities. Read through the documentation for setup and usage instructions. You will use `localStorage` to store any persistent data. For more information on how to work with the OpenWeather API.

# Acceptance Criteria

GIVEN a weather dashboard with form inputs

WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
// local storage

WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// API

WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// js if statement

WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
api

WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city

# Reference

The following picture has been taken as a reference (Reference/06-server-side-apis-homework-demo.png)

# Repository structure

WEATHER-BOARD/Assets/
    javascript to functionalise the page
    css file to give the main page a style

WEATHER-BOARD/Reference
    Requirement photo (Reference/06-server-side-apis-homework-demo.png)
    Requirement explanation (Reference/Requirement.md)
    Delivered result (Reference/result.gif)