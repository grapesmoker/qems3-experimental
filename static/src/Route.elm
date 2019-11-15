module Route exposing (Route(..), parseUrl)

import Url exposing (Url)
import Url.Parser exposing (..)

type Route
    = Home
    | Login
    | Register
    | NotFound


parseUrl : Url -> Route
parseUrl url =
    case parse matchRoute url of
        Just route ->
            route

        Nothing ->
            Debug.log ("path: " ++ url.path)
            NotFound


matchRoute : Parser (Route -> a) a
matchRoute =
    oneOf [ map Home top
          , map Home (s "/static/index.html")
          , map Login (s "/static/login")
          , map Register (s "register")
          ]
        
