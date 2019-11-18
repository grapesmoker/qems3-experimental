module Main exposing (main)

import Browser exposing (UrlRequest, Document)
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Route exposing (Route)
import Url exposing (Url)
import Page.Login as Login


type alias User =
    { username : String
    , password : String
    , token : String
    }

type alias Model =
    { route : Route
    , page : Page
    , navKey : Nav.Key
    , user : User
    }

type alias Flags =
    { csrftoken: String
    }

type Page
    = NotFoundPage
    | HomePage
    | LoginPage
    | RegisterPage
    | SetsPage
    | DistributionsPage
    | CategoriesPage

type Msg
    = LoginPageMsg Login.Msg
    | RegisterPageMsg
    | LinkClicked UrlRequest
    | UrlChanged Url


view : Model -> Document Msg
view model =
    { title = "QEMS v3"
    , body = [ currentView model ]
    }


currentView : Model -> Html Msg
currentView model =
    case model.page of
        HomePage -> homePageView
        LoginPage -> Login.loginPageView |> Html.map LoginPageMsg
        _ -> notFoundView

main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        , onUrlRequest = LinkClicked
        , onUrlChange = UrlChanged
        }


init : Flags -> Url -> Nav.Key -> ( Model, Cmd Msg)
init flags url navKey =
    let
        model =
            { route = Route.parseUrl url
            , page = HomePage
            , navKey = navKey
            , user = { username = ""
                     , password = ""
                     , token = ""
                     }
            }
    in
        Debug.log (Debug.toString flags)
        initCurrentPage (model, Cmd.none)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( LinkClicked urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl model.navKey (Url.toString url)
                    )
                Browser.External url ->
                    ( model
                    , Nav.load url
                    )
        ( UrlChanged url, _ ) ->
            let
                newRoute =
                    Route.parseUrl url
            in
                ( { model | route = newRoute }, Cmd.none )
                    |> initCurrentPage
        ( LoginPageMsg login, _ ) ->
            let
                _ = Debug.log "login" login
            in
                case login of
                    Login.SetUsername data ->
                        -- Debug.log "setting username to" data
                        let
                            oldUser = model.user
                            newUser = { oldUser | username = data }
                            _ = Debug.log "the user is now" newUser
                        in
                            ( { model | user = newUser }, Cmd.none )
                    _ ->
                        Debug.log "some other thing happening"
                        ( model, Cmd.none )

        ( _, _ ) ->
            ( model, Cmd.none )


initCurrentPage : (Model, Cmd Msg ) -> ( Model, Cmd Msg)
initCurrentPage ( model, existingCmds ) =
    let
        ( currentPage, mappedPageCmds ) =
            case model.route of
                Route.NotFound -> ( NotFoundPage, Cmd.none )
                Route.Home -> ( HomePage, Cmd.none )
                Route.Login -> ( LoginPage, Cmd.none )
                Route.Register -> ( RegisterPage, Cmd.none )
    in
        ( { model | page = currentPage }
        , Cmd.batch [ existingCmds, mappedPageCmds ]
        )
 
        
homePageView : Html Msg
homePageView =
    div [ class "main-container" ]
        [ header [ class "header header-6"]
              [ div [ class "branding" ]
                    [ a [] [ span [ class "title" ] [ text "QEMS3" ] ] ]
              , div [ class "header-nav" ]
                  [ a [ class "nav-link", href "sets" ]
                        [ span [ class "nav-text" ] [ text "Sets" ] ]
                  , a [ class "nav-link", href "distributions" ]
                      [ span [ class "nav-text" ] [ text "Distributions" ] ]
                  , a [ class "nav-link", href "categories" ]
                      [ span [ class "nav-text" ] [ text "Categories" ] ]
                  ]
              , div [ class "header-actions" ]
                  [ a [ class "nav-link nav-icon", href "login" ] [ text "Login" ]
                  , a [ class "nav-link nav-icon" ] [ text "Register" ]
                  ]
              ]
        ]
    

notFoundView : Html Msg
notFoundView =
    div [ class "main-container" ]
        [ header [ class "header header-6"]
              [ div [ class "branding" ]
                    [ a [] [ span [ class "title" ] [ text "QEMS3" ] ] ]
              , div [ class "header-nav" ]
                  [ a [ class "nav-link", href "sets" ]
                        [ span [ class "nav-text" ] [ text "Sets" ] ]
                  , a [ class "nav-link", href "distributions" ]
                      [ span [ class "nav-text" ] [ text "Distributions" ] ]
                  , a [ class "nav-link", href "categories" ]
                      [ span [ class "nav-text" ] [ text "Categories" ] ]
                  ]
              , div [ class "header-actions" ]
                  [ a [ class "nav-link nav-icon", href "login" ] [ text "Login" ]
                  , a [ class "nav-link nav-icon" ] [ text "Register" ]
                  ]
              ]
        , text "oh noes asdfasd" 
        ]


         
