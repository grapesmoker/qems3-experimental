module Models.Category exposing (Category, SubCategories(..), CategoryId(..), categoryDecoder, categoriesDecoder) 

import Json.Decode as Decode exposing (Decoder, int, list, string, nullable)
import Json.Decode.Pipeline exposing (required, optional)


type CategoryId
    = CategoryId (Maybe Int)

type SubCategories
    = SubCategories (List Category)

type alias Category =
    { id : (Maybe Int)
    , name : String
    , description : String
    , parentCategory : CategoryId
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
        |> required "id" (nullable int)
        |> required "name" string
        |> required "description" string
        |> required "parent_category" idDecoder
        |> optional "subcategories" subCategoriesDecoder (SubCategories [])


           
