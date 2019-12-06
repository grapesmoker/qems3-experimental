module Models.Category exposing (Category, SubCategories(..), CategoryId(..), categoryDecoder, categoriesDecoder, categoryEncoder) 

import Json.Decode as Decode exposing (Decoder, int, list, string, nullable)
import Json.Decode.Pipeline exposing (required, optional)
import Json.Encode as Encode

type CategoryId
    = CategoryId (Maybe Int)

type SubCategories
    = SubCategories (List Category)

type alias Category =
    { id : Int
    , name : String
    , description : String
    , parentCategory : Maybe Int
    , subcategories : SubCategories
    }


idDecoder : Decoder CategoryId
idDecoder =
    Decode.map CategoryId (nullable int)

categoriesDecoder : Decoder (List Category)
categoriesDecoder =
    list categoryDecoder
        
subCategoriesDecoder : Decoder SubCategories
subCategoriesDecoder =
    --Decode.lazy (\_ -> list categoryDecoder)
    Decode.map SubCategories <| (Decode.lazy (\_ -> categoriesDecoder))
        
categoryDecoder : Decoder Category
categoryDecoder =
    Decode.succeed Category
        |> required "id" int
        |> required "name" string
        |> required "description" string
        |> required "parent_category" (nullable int)
        |> optional "subcategories" subCategoriesDecoder (SubCategories [])


categoryEncoder : Category -> Encode.Value
categoryEncoder category =
    Encode.object [ ("name", Encode.string category.name)
                  , ("description", Encode.string category.description)
                  , ("id", Encode.int category.id)
                  , ("parent_category",
                     case category.parentCategory of
                         Just parentId ->
                             Encode.int parentId
                         Nothing ->
                             Encode.null
                    )
                  ]
                        
