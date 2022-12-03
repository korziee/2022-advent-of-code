-module(sol_1).
-export([solve/0]).

% pattern matching
score(["S", "S"]) -> 3 + 3;
score(["P", "P"]) -> 2 + 3;
score(["R", "R"]) -> 1 + 3;
score(["R", "S"]) -> 3 + 0;
score(["R", "P"]) -> 2 + 6;
score(["S", "R"]) -> 1 + 6;
score(["S", "P"]) -> 2 + 0;
score(["P", "R"]) -> 1 + 0;
score(["P", "S"]) -> 3 + 6.

% pattern matching
decode(<<"X">>) -> "R";
decode(<<"A">>) -> "R";
decode(<<"Y">>) -> "P";
decode(<<"B">>) -> "P";
decode(<<"Z">>) -> "S";
decode(<<"C">>) -> "S".

score_pairs({[], Score}) ->
    Score;
score_pairs({[Pair | Pairs], Score}) ->
    [Them, Me] = Pair,
    score_pairs({Pairs, Score + score([Them, Me])}).

decode_pairs({[], DecodedPairs}) ->
    DecodedPairs;
decode_pairs({[Pair | Rest], DecodedPairs}) ->
    [Them, Me] = Pair,
    decode_pairs({Rest, DecodedPairs ++ [[decode(Them), decode(Me)]]}).

reduce_to_pairs({[], Pairs}) ->
    Pairs;
reduce_to_pairs({[Line | Rest], Pairs}) ->
    % ++ concatenates two lists
    reduce_to_pairs({Rest, Pairs ++ [re:split(Line, " ")]}).

solve() ->
    {ok, Data} = file:read_file("input"),
    Splits = binary:split(Data, <<"\n">>, [global]),
    Pairs = reduce_to_pairs({Splits, []}),
    Decoded_Pairs = decode_pairs({Pairs, []}),
    score_pairs({Decoded_Pairs, 0}).
