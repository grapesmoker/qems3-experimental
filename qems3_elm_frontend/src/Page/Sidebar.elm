module Page.Login exposing (loginPageView, Msg)
module Main exposing (Model)
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)


sidebarView : Model -> Html Msg
sidebarView =
    nav [ class "sidenav" ]
        [ section [ class "sidenav-content" ]
          [ section [ class "nav-group collapsible" ]
            [ input [ type_ "checkbox" ] []
            , label [] [ text "foo bar" ]
            ]
          ]
        -- all the page-specific stuff goes here
        ]
