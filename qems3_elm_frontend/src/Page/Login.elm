module Page.Login exposing (..)

import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onSubmit, onInput)
import Http
import Json.Encode as Encode exposing (..)
import Json.Decode as Decode exposing (Decoder, list, string)


type Msg
    = LogInSuccess
    | LogInFailure
    | SetUsername String
    | SetPassword String
    | SubmitLogIn
    | AuthResponseMsg (Result Http.Error String)

type alias Model =
    { username : String
    , password : String
    }
    
type LogInFormField
    = Username
    | Password


encodeCreds : Model -> Encode.Value
encodeCreds model =
    Encode.object [ ("username", Encode.string model.username)
                  , ("password", Encode.string model.password)
                  ]

 
tokenDecoder : Decoder String
tokenDecoder =
    Decode.field "token" Decode.string

      
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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetUsername username ->
            ( { model | username = username }, Cmd.none )
        SetPassword password ->
            ( { model | password = password }, Cmd.none )
        SubmitLogIn ->
            let
                body = model |> encodeCreds |> Http.jsonBody
            in
                ( model, Http.post
                      { url = "qsub/webapp_login/"
                      , body = body
                      , expect = Http.expectJson AuthResponseMsg tokenDecoder
                      } )
        _ ->
            ( model, Cmd.none)
