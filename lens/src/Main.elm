module Main exposing (..)

import Browser
import Browser.Dom as Dom exposing (Element, Error)
import Browser.Events
import Dict exposing (Dict)
import Html exposing (Html)
import Json.Decode as Decode exposing (Decoder)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Svg.Events as Events
import Task


main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = always <| Browser.Events.onResize (\_ _ -> Resize)
        }


type alias Model =
    { points : Dict Int ( Float, Float )
    , lens : Lens
    , viewbox : Viewbox
    , clickbox : Viewbox
    , id : Int
    , dragging : Maybe Int
    }


type alias Viewbox =
    { x : Float
    , y : Float
    , width : Float
    , height : Float
    }


type alias Lens =
    { diameter : Float
    , focalLength : Float
    }


type Msg
    = New ( Float, Float )
    | Move ( Float, Float )
    | Drag (Maybe Int)
    | Resize
    | UpdateClickbox (Result Error Element)
    | Nop


init : () -> ( Model, Cmd Msg )
init =
    always
        ( { points = Dict.empty
          , lens = { diameter = 52, focalLength = 35 }
          , viewbox = { x = -500, y = -200, width = 600, height = 400 }
          , clickbox = { x = -500, y = -200, width = 600, height = 400 }
          , id = 0
          , dragging = Nothing
          }
        , Task.attempt UpdateClickbox <| Dom.getElement "svgVis"
        )


viewPoint : Lens -> Float -> ( Int, ( Float, Float ) ) -> Svg Msg
viewPoint lens dist ( id, ( x, y ) ) =
    let
        stringify : List ( Float, Float ) -> String
        stringify =
            List.map (\( x_, y_ ) -> String.fromFloat x_ ++ "," ++ String.fromFloat y_)
                >> String.join " "

        refract : Float -> ( Float, Float )
        refract lensy =
            let
                viewSlope =
                    (lensy - y) / -x

                ( focalx, focaly ) =
                    ( lens.focalLength, viewSlope * lens.focalLength )

                refractedSlope =
                    (lensy - focaly) / -focalx
            in
            ( dist, lensy + refractedSlope * dist )

        drawRay : Float -> Svg Msg
        drawRay i =
            let
                lensy =
                    lens.diameter * (i - 0.5)
            in
            polyline
                [ fill "none"
                , stroke "black"
                , points <| stringify [ ( x, y ), ( 0, lensy ), refract lensy ]
                ]
                []

        rays =
            List.map drawRay (List.map (\i -> toFloat i / 10) (List.range 0 10))
    in
    g []
        (rays
            ++ [ circle
                    [ Events.stopPropagationOn "pointermove" <| Decode.succeed ( Nop, True )
                    , Events.stopPropagationOn "pointerdown" <| Decode.succeed ( Drag <| Just id, True )
                    , cx (String.fromFloat x)
                    , cy (String.fromFloat y)
                    , r "5"
                    ]
                    []
               ]
        )


view : Model -> Html Msg
view ({ clickbox, viewbox } as model) =
    let
        viewboxString =
            List.map (\f -> f viewbox) [ .x, .y, .width, .height ]
                |> List.map String.fromFloat
                |> String.join " "

        clientToScene : Float -> Float -> ( Float, Float )
        clientToScene x y =
            ( (x - clickbox.x) / clickbox.width * viewbox.width + viewbox.x
            , (y - clickbox.y) / clickbox.height * viewbox.height + viewbox.y
            )

        pointerDecoder : (( Float, Float ) -> a) -> Decoder a
        pointerDecoder msg =
            Decode.map msg <|
                Decode.map2 clientToScene
                    (Decode.field "clientX" Decode.float)
                    (Decode.field "clientY" Decode.float)
    in
    svg
        [ id "svgVis"
        , viewBox viewboxString
        , width <| String.fromFloat viewbox.width
        , height <| String.fromFloat viewbox.height
        , Events.on "pointerleave" <| Decode.succeed <| Drag Nothing
        , Events.on "pointerup" <| Decode.succeed <| Drag Nothing
        , Events.on "pointermove" <| pointerDecoder Move
        , Events.on "pointerdown" <| pointerDecoder New
        ]
        (List.map (viewPoint model.lens (viewbox.x + viewbox.width)) (Dict.toList model.points))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        New coord ->
            ( { model
                | points = Debug.log "new" <| Dict.insert model.id coord model.points
                , dragging = Just model.id
                , id = model.id + 1
              }
            , Cmd.none
            )

        Move coord ->
            case model.dragging of
                Just id ->
                    ( { model
                        | points = Dict.insert id coord model.points
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( model, Cmd.none )

        Drag id ->
            ( { model | dragging = Debug.log "drag" id }, Cmd.none )

        UpdateClickbox (Ok { element }) ->
            ( { model | clickbox = element }, Cmd.none )

        UpdateClickbox (Err _) ->
            ( model, Cmd.none )

        Resize ->
            ( model
            , Task.attempt UpdateClickbox <| Dom.getElement "svgVis"
            )

        Nop ->
            ( model, Cmd.none )
