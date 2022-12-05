% TODO: WIP

-module(sol).
-export([solve/0]).

populate_map({"", Map}) ->
    Map;
populate_map({Sack, Map}) ->
    {Char, Rest} = lists:split(1, Sack),
    populate_map({Rest, maps:put(Char, true, Map)}).

group_lines({[], Groups}) ->
    Groups;
group_lines({[L1, L2, L3 | Lines], Groups}) ->
    group_lines({Lines, [[binary_to_list(L1), binary_to_list(L2), binary_to_list(L3)]] ++ Groups}).

is_equal(X, Y, Z) when X == true, Y == true, Z == true ->
    true;
is_equal(_, _, _) ->
    false.

find_group_badges({[], Badges}) ->
    Badges;
find_group_badges({[Group | Groups], Badges}) ->
    First = lists:nth(1, Group),
    Second = lists:nth(2, Group),
    Third = lists:nth(3, Group),
    io:write("hello"),
    Badges = lists:map(
        fun(Int) -> Int
            % is_equal(
            %     maps:get(Int, First, false),
            %     maps:get(Int, Second, false),
            %     maps:get(Int, Third, false)
            % )
        end,
        lists:seq(65, 122)
    ),
    io:write("hello"),
    find_group_badges({Groups, []}).

score_badges({[], Score}) ->
    Score;
score_badges({Badges, Score}) ->
    "TODO".

solve() ->
    {ok, Data} = file:read_file("input"),
    Splits = binary:split(Data, <<"\n">>, [global]),
    Groups = group_lines({Splits, []}),
    Maps = lists:map(
        fun(Group) ->
            lists:map(fun(List) -> populate_map({List, #{}}) end, Group)
        end,
        Groups
    ),
    % io:write(Maps),
    Badges = find_group_badges({Maps, []}),
    % Score = score_badges({Badges, 0}),
    Badges.
