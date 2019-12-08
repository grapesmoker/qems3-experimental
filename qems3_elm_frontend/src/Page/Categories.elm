module Page.Categories exposing (Model, Msg(..), init, update, view, getCategory, getCategories)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick, onSubmit, onInput)
import Http exposing (expectJson)
import Json.Decode as Decode
import Json.Decode.Pipeline exposing (required, optional, hardcoded)
import Models.Category exposing (Category, CategoryId, SubCategories, categoryDecoder, categoriesDecoder, categoryEncoder)
import Models.Flags exposing (Flags)
import RemoteData exposing (..)
import Task exposing (Task)


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
    | SetCategoryName String
    | SetCategoryDescription String
    | SetCategoryParent String
    | ShowCategoryDetail Category
    | SaveCategoryDetail
    | CategoriesReloaded (Result Http.Error (List Category))

view : Model -> Html Msg
view model =
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
          [ a [ class "clr-treenode-link", href ("/categories/" ++ (String.fromInt category.id))
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
            Html.form [ class "clr-form", onSubmit SaveCategoryDetail ]
                [ div [ class "clr-form-control" ]
                  [ label [ for "category-name", class "clr-control-label" ]
                    [ text "Category name" ]
                  , div [ class "clr-control-container" ]
                      [ div [ class "clr-input-wrapper" ]
                        [ input [ type_ "text", id "category-name", placeholder "Name", class "clr-input"
                                , value category.name, onInput SetCategoryName
                                ]
                              [ Html.node "clr-icon" [ class "clr-validate-icon" ] [] ]
                        ]
                      ]
                  ]
                , div [ class "clr-form-control" ]
                    [ label [ for "category-description", class "clr-control-label" ]
                      [ text "Description" ]
                    , div [ class "clr-control-container" ]
                        [ div [ class "clr-input-wrapper" ]
                          [ input [ type_ "textarea", id "category-description"
                                  , placeholder "Description", class "clr-textarea", value category.description
                                  , onInput SetCategoryDescription
                                  ] []
                          ]
                        ]
                    ]
                , div [ class "clr-form-control" ]
                    [ label [ for "category-parent", class "clr-control-label" ]
                      [ text "Parent category" ]
                    , div [ class "clr-control-container" ]
                        [ div [ class "clr-select-wrapper" ]
                          [ select [ id "category-parent", class "clr-select", onInput SetCategoryParent ]
                            ([ option [ value "" ] [ text "None" ] ] ++
                             (List.map
                                  (\c -> option [ value (String.fromInt c.id)
                                                , case category.parentCategory of
                                                      Just parentCategory ->
                                                          if c.id == parentCategory then selected True
                                                          else selected False
                                                      Nothing ->
                                                          selected False
                                                ] [ text c.name ]) 
                                  (flattenCategories model.categories)))
                          ]
                        ]
                    ]
                , button [ class "btn btn-primary" ] [ text "Save" ]
                ]
        _ -> Html.div [] []
        
        
getCategories : Cmd Msg
getCategories =
    Http.get
        { url = "/qsub/api/categories/"
        , expect = expectJson (RemoteData.fromResult >> CategoriesResponse) categoriesDecoder
        }

getCategoriesTask : Task Http.Error (List Category)
getCategoriesTask =
    Http.task
        { method = "GET"
        , headers = []
        , url = "/qsub/api/categories/"
        , body = Http.emptyBody
        , resolver = Http.stringResolver <| handleJson <| categoriesDecoder
        , timeout = Nothing
        }
            

getCategory : Int -> Cmd Msg
getCategory id =
    Http.get
        { url = "/qsub/api/categories/" ++ String.fromInt id ++ "/"
        , expect = expectJson (RemoteData.fromResult >> CategoryResponse) categoryDecoder
        }
        
init : ( Model, Cmd Msg )
init =
    ( { categories = NotAsked
      , selectedCategory = NotAsked
      }
    , getCategories )

    
update : Flags -> Msg -> Model -> ( Model, Cmd Msg)
update flags msg model =
    case msg of
        CategoriesResponse response ->
            ( { model | categories = response }, Cmd.none )
        CategoryResponse response ->
            ( { model | selectedCategory = response }, Cmd.none )
        SetCategoryName name ->
            case model.selectedCategory of
                Success category ->
                    let
                        newCategory = { category | name = name }
                    in
                        ( { model | selectedCategory = Success newCategory }, Cmd.none )
                _ -> ( model, Cmd.none )
        SetCategoryDescription description ->
            case model.selectedCategory of
                Success category ->
                    let
                        newCategory = { category | description = description }
                    in
                        ( { model | selectedCategory = Success newCategory }, Cmd.none )
                _ -> ( model, Cmd.none )
        SetCategoryParent parent ->
            case model.selectedCategory of
                Success category ->
                    let
                        newCategory = { category | parentCategory = String.toInt parent }
                    in
                        ( { model | selectedCategory = Success newCategory }, Cmd.none )
                _ -> ( model, Cmd.none )
        SaveCategoryDetail ->
            case model.selectedCategory of
                Success category ->
                    ( model, Task.attempt CategoriesReloaded (saveAndReload flags category))
                    -- let
                    --     body = category |> categoryEncoder |> Http.jsonBody
                    -- in
                    --     { 
                        -- ( { model | categories = updateCategories category model.categories }
                        -- , Cmd.none 
                        -- )
                _ -> ( model, Cmd.none )
        CategoriesReloaded result ->
            case result of
                Ok categories ->
                    ( { model | categories = Success categories }, Cmd.none )
                _ ->
                    let
                        _ = Debug.log "some error happened" result
                    in
                        ( model, Cmd.none )
                
                    
        _ ->
            ( model, Cmd.none)


handleJson : Decode.Decoder a -> Http.Response String -> Result Http.Error a
handleJson decoder response =
    case response of
        Http.GoodStatus_ _ body ->
            case Decode.decodeString decoder body of
                Err _ ->
                    Err (Http.BadBody body)
                Ok result ->
                    Ok result
        _ ->
            Err (Http.BadStatus 500)

saveCategory : Flags -> Category -> Task Http.Error Category
saveCategory flags category =
    let
        body = category |> categoryEncoder |> Http.jsonBody
    in
        Http.task
            { method = "PUT"
            , url = "/qsub/api/categories/" ++ String.fromInt category.id ++ "/"
            , body = body
            , headers = [ Http.header "X-CSRFToken" flags.csrftoken ]
            , resolver = Http.stringResolver <| handleJson <| categoryDecoder
            , timeout = Nothing
            }


saveAndReload : Flags -> Category -> Task Http.Error (List Category)
saveAndReload flags category =
    saveCategory flags category
        --|> Task.mapError HttpError
        |> Task.andThen
           (\_ ->
                getCategoriesTask )
 
           
updateCategories : Category -> WebData (List Category) -> WebData (List Category)
updateCategories category categories =
    case categories of
        Success cats ->
            Success (List.map (recursiveCategoryUpdate category) cats)
        _ ->
            categories


recursiveCategoryUpdate : Category -> Category -> Category
recursiveCategoryUpdate targetCategory candidateCategory =
    if targetCategory.id == candidateCategory.id then
        targetCategory
    else
        case candidateCategory.subcategories of
            Models.Category.SubCategories [] -> candidateCategory
            Models.Category.SubCategories subcategories ->
                let
                    updatedSubcategories =
                        case subcategories of
                            [] -> []
                            children ->
                                List.map (\c -> recursiveCategoryUpdate targetCategory c) children
                in
                    { candidateCategory | subcategories = Models.Category.SubCategories updatedSubcategories }

                
flattenCategory : Category -> List Category
flattenCategory category =
    case category.subcategories of
        Models.Category.SubCategories subcategories ->
            [category] ++ List.concatMap flattenCategory subcategories
                
flattenCategories : WebData (List Category) -> List Category
flattenCategories categories =
    case categories of
        RemoteData.Success categoriesData ->
            List.concatMap flattenCategory categoriesData
        _ -> []
