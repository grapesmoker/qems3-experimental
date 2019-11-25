module Route exposing (Route(..), parseUrl)

import Url exposing (Url)
import Url.Parser exposing (..)

type Route
    = Home
    | Login
    | Register
    | Categories
    | NotFound


parseUrl : Url -> Route
parseUrl url =
    case parse matchRoute url of
        Just route ->
            Debug.log url.path
            route

        Nothing ->
            Debug.log ("path: " ++ url.path)
            NotFound


matchRoute : Parser (Route -> a) a
matchRoute =
    oneOf [ map Home top
          , map Login (s "login")
          , map Register (s "register")
          , map Categories (s "categories")
          ]
        
