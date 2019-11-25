module Page.Categories exposing (Model, Msg(..), init, update, view, getCategories)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http exposing (expectJson)
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (required, optional, hardcoded)
import Models.Category exposing (Category, CategoryId, categoriesDecoder)
import RemoteData exposing (..)

type alias Categories =
    List Category

type alias Model =
    { categories : WebData (List Category)
    , selectedCategory : Maybe Category
    }

type Msg
    = ListCategories
    | CategoriesResponse (WebData Categories)
    | ShowCategoryDetail Category

view : Model -> Html Msg
view model =
    let
        _ = Debug.log "categories model" model
    in
        div [ class "main-container" ]
            [ headerView
            , viewSidebar model
            ]


headerView : Html Msg
headerView =
    header [ class "header header-6"]
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
        

viewSidebar : Model -> Html Msg
viewSidebar model = 
    nav [ class "sidenav" ]
        [ section [ class "sidenav-content" ]
          [ section [ class "nav-group" ]
            [ Html.node "clr-tree" []
              ( case model.categories of
                    Success categories ->
                        List.map viewSidebarCategory categories
                    _ ->
                        []
              )
            ]
          ]
        -- all the page-specific stuff goes here
        ]

viewSidebarCategory : Category -> Html Msg
viewSidebarCategory category =
    Html.node "clr-tree-node" []
    (
     (
      [ div [ class "clr-tree-node-content-container" ] 
        [ div [ class "clr-treenode-content" ]
          [ text category.name ]
        ]
      ]
          
     ) ++ [ div [ class "clr-treenode-children" ]
            ( case category.subcategories of 
                  Models.Category.SubCategories subcategories ->
                      List.map viewSidebarCategory subcategories
            )
          ]
    )
        
        
getCategories : Cmd Msg
getCategories =
    Http.get
        { url = "qsub/api/categories/"
        , expect = expectJson (RemoteData.fromResult >> CategoriesResponse) categoriesDecoder
        }

init : ( Model, Cmd Msg )
init =
    ( { categories = NotAsked
      , selectedCategory = Nothing
      }
    , getCategories )

    
update : Msg -> Model -> ( Model, Cmd Msg)
update msg model =
    case msg of
        CategoriesResponse response ->
            ( { model | categories = response }, Cmd.none )
        _ ->
            ( model, Cmd.none)

{-

[
    {
        "id": 1,
        "name": "physics",
        "description": "physics",
        "parent_category": null,
        "path": "1",
        "subcategories": [
            {
                "id": 5,
                "name": "e&m",
                "description": "electricity and magnetism",
                "parent_category": 1,
                "path": "1/5",
                "subcategories": []
            },
            {
                "id": 4,
                "name": "mechanics",
                "description": "mech",
                "parent_category": 1,
                "path": "1/4",
                "subcategories": []
            },
            {
                "id": 3,
                "name": "thermo",
                "description": "sm",
                "parent_category": 1,
                "path": "1/3",
                "subcategories": []
            },
            {
                "id": 2,
                "name": "quantum mechanics",
                "description": "qm",
                "parent_category": 1,
                "path": "1/2",
                "subcategories": []
            }
        ]
    }
]

-}
