module Main exposing (main)

import Browser exposing (UrlRequest)
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Route exposing (Route)
import Url exposing (Url)


type alias Model =
    { route : Route
    , page : Page
    , navKey: Nav.Key
    }

type Page
    = NotFoundPage
    | LoginPage
    | RegisterPage

type Msg
    = LoginPageMsg
    | RegisterPageMsg
    | LinkClicked UrlRequest
    | UrlChanged Url

      
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
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg)
init flags url navKey =
    let
        model =
            { route = Route.parseUrl url
            , page = NotFoundPage
            , navKey = navKey
            }
    in
        initCurrentPage (model, Cmd.none)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( _, _ ) ->
            ( model, Cmd.none )


initCurrentPage : (Model, Cmd Msg ) -> ( Model, Cmd Msg)
initCurrentPage ( model, existingCmds ) =
    let
        ( currentPage, mappedPageCmds ) =
            case model.route of
                Route.NotFound -> ( NotFoundPage, Cmd.none )
                Route.Login -> ( LoginPage, Cmd.none )
                Route.Register -> ( RegisterPage, Cmd.none )
    in
        ( { model | page = currentPage }
        , Cmd.batch [ existingCmds, mappedPageCmds ]
        )
        

