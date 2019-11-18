module Page.Login exposing (..)

import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onSubmit, onInput)


type Msg
    = LogInSuccess
    | LogInFailure
    | SetUsername String
    | SetPassword String
    | SubmitLogIn

type alias Username = String
type alias Password = String
      
type LogInFormField
    = Username
    | Password

      
loginPageView : Html Msg
loginPageView =
   div [ class "login-wrapper" ]
       [ Html.form [ class "login", onSubmit SubmitLogIn ]
         [ section [ class "title" ]
           [ h3 [ class "welcome" ] [ text "QEMS3 Login" ] 
           , h5 [ class "hint" ] [ text "Log in or create an account" ] ]
         , div [ class "login-group" ]
               [ Html.node "clr-input-container" [ class "clr-form-control" ]
                 [ label [ class "clr-sr-only clr-control-label" ] [ text "Username" ]
                 , input [ class "clr-input", type_ "text", name "username"
                         , placeholder "Username", attribute "clrInput" ""
                         , onInput SetUsername ] []
                 ]
               , Html.node "clr-password-container" [ class "clr-form-control" ]
                 [ label [ class "clr-sr-only clr-control-label" ] [ text "Password" ]
                 , input [ class "clr-input", type_ "password", name "password"
                         , placeholder "Password", attribute "clrInput" ""
                         , onInput SetPassword ] []
                 ]
               ]
         , button [ class "btn btn-primary" ] [ text "Login" ]
         ]
       ]
