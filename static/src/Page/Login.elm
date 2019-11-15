module Page.Login exposing (loginPageView, Msg)

import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)


type Msg
    = LogInSuccess
    | LogInFailure


loginPageView : Html Msg
loginPageView =
   div [ class "login-wrapper" ]
       [ Html.form [ class "login" ]
         [ section [ class "title" ]
           [ h3 [ class "welcome" ] [ text "QEMS3 Login" ] 
           , h5 [ class "hint" ] [ text "Log in or create an account" ] ]
         , div [ class "login-group" ]
             [ Html.node "clr-input-container" []
               [ label [ class "clr-sr-only" ] [ text "Username" ]
               , input [ type_ "text", name "username", placeholder "Username" ] []
             ]
           ]
         ]
       ]
