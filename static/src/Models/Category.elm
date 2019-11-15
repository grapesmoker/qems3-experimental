module Models.Category exposing (Category, CategoryId, categoryDecoder, categoriesDecoder)

import Json.Decode as Decode exposing (Decoder, int, list, string)
import Json.Decode.Pipeline exposing (required)


type CategoryId
    = CategoryId Int
      

type alias Category =
    { id : CategoryId
    , name : String
    , description : String
    , parentCategory : CategoryId
    }


idDecoder : Decoder CategoryId
idDecoder =
    Decode.map CategoryId int

categoriesDecoder : Decoder (List Post)
categoriesDecoder =
    list categoryDecoder
        
categoryDecoder : Decoder Category
categoryDecoder =
    Decode.succeed Category
        |> required "id" idDecoder
        |> required "name" string
        |> required "description" string
        |> required "parent_category" idDecoder

