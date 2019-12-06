module Main exposing (main)

import Browser exposing (UrlRequest, Document)
import Browser.Navigation as Nav
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http exposing (post, expectJson, expectString, Error)
import Route exposing (Route)
import Url exposing (Url)
import Page.Login as Login
import Page.Categories as Categories
import Json.Encode as Encode exposing (..)
import Json.Decode as Decode exposing (Decoder, list, string)
import RemoteData exposing (..)
import Models.Flags exposing (Flags)

type alias User =
    { username : String
    , password : String
    , token : String
    }

type alias Model =
    { route : Route
    , page : Page
    , navKey : Nav.Key
    , auth : Login.Model
    , categoriesModel : Categories.Model
    , flags : Flags
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
    | CategoriesPageMsg Categories.Msg
    | RegisterPageMsg
    | LinkClicked UrlRequest
    | UrlChanged Url
    | AuthResponseMsg (Result Http.Error String)


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
        CategoriesPage -> Categories.view model.categoriesModel |> Html.map CategoriesPageMsg
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
            , auth = { username = ""
                     , password = ""
                     }
            , categoriesModel = { categories = NotAsked
                                , selectedCategory = NotAsked
                                }
            , flags = flags
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
        ( LoginPageMsg loginMsg, _ ) ->
            let
                ( updatedAuth, cmd ) = Login.update loginMsg model.auth
            in
                ( { model | auth = updatedAuth }, cmd |> Cmd.map LoginPageMsg )

        ( AuthResponseMsg result, _ ) ->
            ( model, Cmd.none )

        ( CategoriesPageMsg categories, CategoriesPage ) ->
            let
                ( updatedCategoriesModel, cmd ) =
                    Categories.update model.flags categories model.categoriesModel
            in
                ( { model | categoriesModel = updatedCategoriesModel }, cmd |> Cmd.map CategoriesPageMsg )
                    
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
                Route.Categories -> ( CategoriesPage, Categories.getCategories |> Cmd.map CategoriesPageMsg )
                Route.Category category -> ( CategoriesPage,
                                                 Cmd.batch [ Categories.getCategory category
                                                           , Categories.getCategories ]
                                           |> Cmd.map CategoriesPageMsg )
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
                  [ a [ class "nav-link", href "/sets" ]
                        [ span [ class "nav-text" ] [ text "Sets" ] ]
                  , a [ class "nav-link", href "/distributions" ]
                      [ span [ class "nav-text" ] [ text "Distributions" ] ]
                  , a [ class "nav-link", href "/categories" ]
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


encodeUser : User -> Encode.Value
encodeUser user =
    Encode.object [ ("username", Encode.string user.username)
                  , ("password", Encode.string user.password)
                  ]
    

tokenDecoder : Decoder String
tokenDecoder =
    Decode.field "token" Decode.string

