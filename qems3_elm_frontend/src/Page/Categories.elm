module Page.Categories exposing (Model, Msg(..), init, update, view, getCategory, getCategories)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http exposing (expectJson)
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (required, optional, hardcoded)
import Models.Category exposing (Category, CategoryId, categoryDecoder, categoriesDecoder)
import RemoteData exposing (..)

type alias Categories =
    List Category

type alias Model =
    { categories : WebData (List Category)
    , selectedCategory : WebData Category
    }

type Msg
    = ListCategories
    | CategoriesResponse (WebData Categories)
    | CategoryResponse (WebData Category)
    | ShowCategoryDetail Category

view : Model -> Html Msg
view model =
    let
        _ = Debug.log "categories model" model
    in
        div [ class "main-container" ]
            [ headerView
            , div [ class "content-container" ]
                [ (viewSidebar model)
                , div [ class "content-area" ] [ ( viewCategory model ) ]
                ]
            ]


headerView : Html Msg
headerView =
    header [ class "header-6"]
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
            [ a [ class "nav-link nav-icon", href "/login" ] [ text "Login" ]
            , a [ class "nav-link nav-icon", href "/register" ] [ text "Register" ]
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
          [ a [ class "clr-treenode-link", href
                    ( case category.id of
                          Just id ->
                              "/categories/" ++ (String.fromInt id)
                          Nothing ->
                              "#"
                          )
              ] [ text category.name ]
          ]
        ]
      ]
          
     ) ++ [ div [ class "clr-treenode-children" ]
            ( case category.subcategories of 
                  Models.Category.SubCategories subcategories ->
                      List.map viewSidebarCategory subcategories
            )
          ]
    )

viewCategory : Model -> Html Msg
viewCategory model =
    case model.selectedCategory of
        Success category ->
            Html.form [ class "clr-form" ]
                [ div [ class "clr-form-control" ]
                  [ label [ for "category-name", class "clr-control-label" ]
                    [ text "Category name" ]
                  , div [ class "clr-control-container" ]
                      [ div [ class "clr-input-wrapper" ]
                        [ input [ type_ "text", id "category-name", placeholder "Name", class "clr-input"
                                , value category.name
                                ]
                              [ Html.node "clr-icon" [ class "clr-validate-icon" ] [] ]
                        ]
                      ]
                  ]
                , div [class "clr-form-control" ]
                    [ label [ for "category-description", class "clr-control-label" ]
                      [ text "Description" ]
                    , div [ class "clr-control-container" ]
                        [ div [ class "clr-input-wrapper" ]
                          [ input [ type_ "textarea", id "category-description"
                                  , placeholder "Description", class "clr-textarea", value category.description
                                  ] []
                          ]
                        ]
                    ]
                , div [class "clr-form-control" ]
                    [ label [ for "category-parent", class "clr-control-label" ]
                      [ text "Parent category" ]
                    , div [ class "clr-control-container" ]
                        [ div [ class "clr-input-wrapper" ]
                          [ select [ id "category-parent", class "clr-select", value category.description ]
                            []
                          ]
                        ]
                    ]
                    
                ]
        _ -> Html.div [] []
        
        
getCategories : Cmd Msg
getCategories =
    Http.get
        { url = "qsub/api/categories/"
        , expect = expectJson (RemoteData.fromResult >> CategoriesResponse) categoriesDecoder
        }

getCategory : Int -> Cmd Msg
getCategory id =
    Http.get
        { url = "qsub/api/categories/" ++ String.fromInt id ++ "/"
        , expect = expectJson (RemoteData.fromResult >> CategoryResponse) categoryDecoder
        }
        
init : ( Model, Cmd Msg )
init =
    ( { categories = NotAsked
      , selectedCategory = NotAsked
      }
    , getCategories )

    
update : Msg -> Model -> ( Model, Cmd Msg)
update msg model =
    case msg of
        CategoriesResponse response ->
            ( { model | categories = response }, Cmd.none )
        CategoryResponse response ->
            ( { model | selectedCategory = response }, Cmd.none )
        _ ->
            ( model, Cmd.none)
