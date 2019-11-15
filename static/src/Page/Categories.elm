module Page.Categories exposing (Model, Msg, init, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode
import Models.Category exposing (Category, CategoryId, categoriesDecoder)
import RemoteData exposing WebData


type alias Model =
    { categories : WebData (List Category)
    }

