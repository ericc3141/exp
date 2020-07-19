module Main exposing (..)

import Browser
import Browser.Dom as Dom exposing (Element, Error)
import Browser.Events
import Color exposing (Color)
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
    , clicked : Bool
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
    | Del Int
    | Resize
    | UpdateClickbox (Result Error Element)
    | Nop


init : () -> ( Model, Cmd Msg )
init =
    always
        ( { points =
                Dict.fromList
                    [ ( 0, ( -80, -40 ) )
                    , ( 1, ( -120, 20 ) )
                    ]
          , lens = { diameter = 52, focalLength = 35 }
          , viewbox = { x = -500, y = -100, width = 400, height = 200 }
          , clickbox = { x = -500, y = -100, width = 400, height = 200 }
          , id = 2
          , dragging = Nothing
          , clicked = False
          }
        , Task.attempt UpdateClickbox <| Dom.getElement "demosvg"
        )


pointColor : Int -> Color
pointColor id =
    Color.hsl (toFloat (modBy 11 (id * 3)) / 11) 1 0.5


stringify : List ( Float, Float ) -> String
stringify =
    List.map (\( x_, y_ ) -> String.fromFloat x_ ++ "," ++ String.fromFloat y_)
        >> String.join " "


viewRays : Lens -> Float -> ( Int, ( Float, Float ) ) -> Svg Msg
viewRays lens dist ( id, ( x, y ) ) =
    let
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

        radius =
            lens.diameter / 2

        color =
            Color.toHsla <| pointColor id
    in
    polyline
        [ fill <| Color.toCssString <| Color.fromHsla { color | alpha = 0.3 }
        , points <|
            stringify
                [ ( x, y )
                , ( 0, -radius )
                , refract -radius
                , refract radius
                , ( 0, lens.diameter / 2 )
                , ( x, y )
                ]
        ]
        []


viewPoint : ( Int, ( Float, Float ) ) -> Svg Msg
viewPoint ( id, ( x, y ) ) =
    circle
        [ Events.stopPropagationOn "pointerdown" <| Decode.succeed ( Drag <| Just id, True )
        , Events.on "pointerup" <| Decode.succeed <| Del id
        , cx (String.fromFloat x)
        , cy (String.fromFloat y)
        , r "5"
        , fill <| Color.toCssString <| pointColor id
        ]
        []


viewLens : Viewbox -> Lens -> Svg Msg
viewLens viewbox lens =
    let
        radius =
            lens.diameter / 2

        fromtop =
            (viewbox.height - lens.diameter) / 2
    in
    g []
        [ Svg.path
            [ d <|
                "M 0 "
                    ++ String.fromFloat radius
                    ++ " a 100 100 0 0 0 0 "
                    ++ String.fromFloat -lens.diameter
                    ++ " a 100 100 0 0 0 0 "
                    ++ String.fromFloat lens.diameter
            , fill <| Color.toCssString <| Color.hsla 0.6 1 0.8 0.8
            ]
            []
        , Svg.path
            [ d <|
                "M 0 "
                    ++ String.fromFloat (viewbox.height / 2)
                    ++ " v "
                    ++ String.fromFloat -fromtop
                    ++ "M 0 "
                    ++ String.fromFloat (-viewbox.height / 2)
                    ++ " v "
                    ++ String.fromFloat fromtop
            , stroke <| Color.toCssString <| Color.hsla 0 0 0.2 0.8
            ]
            []
        , Svg.path
            [ d <|
                "M "
                    ++ String.fromFloat lens.focalLength
                    ++ " "
                    ++ String.fromFloat viewbox.y
                    ++ " v "
                    ++ String.fromFloat viewbox.height
            , stroke <| Color.toCssString <| Color.hsla 0 0 0.8 0.8
            ]
            []
        ]


view : Model -> Html Msg
view ({ clickbox, viewbox, lens } as model) =
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
                    (Decode.field "pageX" Decode.float)
                    (Decode.field "pageY" Decode.float)
    in
    svg
        [ id "demosvg"
        , viewBox viewboxString
        , width "100%"
        , height "100%"
        , Events.on "pointerleave" <| Decode.succeed <| Drag Nothing
        , Events.on "pointerup" <| Decode.succeed <| Drag Nothing
        , Events.preventDefaultOn "pointermove" <| Decode.map (\msg -> ( msg, True )) <| pointerDecoder Move
        , Events.preventDefaultOn "pointerdown" <| Decode.map (\msg -> ( msg, True )) <| pointerDecoder New
        ]
        (List.map (viewRays lens (viewbox.x + viewbox.width)) (Dict.toList model.points)
            ++ [ viewLens viewbox lens ]
            ++ List.map viewPoint (Dict.toList model.points)
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        New ( x, y ) ->
            ( { model
                | points = Dict.insert model.id ( Basics.min -1 x, y ) model.points
                , dragging = Just model.id
                , id = model.id + 1
                , clicked = False
              }
            , Cmd.none
            )

        Move ( x, y ) ->
            case model.dragging of
                Just id ->
                    ( { model
                        | points = Dict.insert id ( Basics.min -1 x, y ) model.points
                        , clicked = False
                      }
                    , Cmd.none
                    )

                Nothing ->
                    ( model, Cmd.none )

        Drag id ->
            ( { model | dragging = id, clicked = True }, Cmd.none )

        Del id ->
            if model.clicked then
                ( { model | points = Dict.remove id model.points }, Cmd.none )

            else
                ( model, Cmd.none )

        UpdateClickbox (Ok { element }) ->
            let
                viewbox =
                    model.viewbox

                scale =
                    viewbox.height / element.height
            in
            ( { model
                | clickbox = element
                , viewbox = { viewbox | x = -scale * element.width * 0.7, width = scale * element.width }
              }
            , Cmd.none
            )

        UpdateClickbox (Err _) ->
            ( model, Cmd.none )

        Resize ->
            ( model
            , Task.attempt UpdateClickbox <| Dom.getElement "demosvg"
            )

        Nop ->
            ( model, Cmd.none )
