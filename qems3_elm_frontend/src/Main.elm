module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Route exposing (Route)


-- type alias Model =
--     { route : Route
--     , page : Page
--     }

view model =

    div [ class "main-container" ]
        [ header [ class "header header-6"]
              [ div [ class "branding" ]
                    [ a [] [ span [ class "title" ] [ text "QEMS3" ] ] ]
              , div [ class "header-nav" ]
                  [ a [ class "nav-link" ]
                        [ span [ class "nav-text" ] [ text "Sets" ] ]
                  , a [ class "nav-link" ]
                        [ span [ class "nav-text" ] [ text "Distributions" ] ]
                  , a [ class "nav-link" ]
                        [ span [ class "nav-text" ] [ text "Categories" ] ]
                  ]
              , div [ class "header-actions" ]
                  [ a [ class "nav-link nav-icon" ] [ text "Login" ]
                  , a [ class "nav-link nav-icon" ] [ text "Register" ]
                  ]
              ]
              
        ]
        
              


main =
    view "dummy model"
